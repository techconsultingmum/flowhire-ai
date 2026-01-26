import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CandidateData {
  name: string;
  skills: string[];
  notes: string;
}

interface JobData {
  title: string;
  department: string;
  description: string;
  requirements: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check user role - only recruiters and admins can score
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleError || !roleData) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Unable to verify user role" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["admin", "recruiter"].includes(roleData.role)) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions. Only recruiters and admins can score candidates." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { candidate, job } = await req.json() as { candidate: CandidateData; job: JobData };

    if (!candidate || !job) {
      throw new Error("Candidate and job data are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert HR recruiter and talent evaluator. Your task is to analyze a candidate's profile against a job posting and provide a compatibility score.

Be objective and fair in your assessment. Consider:
1. Skills match - how well the candidate's skills align with job requirements
2. Experience relevance - inferred from skills and notes
3. Potential fit - based on available information

Respond using the provided function to return a structured score and reasoning.`;

    const userPrompt = `Evaluate this candidate for the following job position:

**Candidate Profile:**
- Name: ${candidate.name}
- Skills: ${candidate.skills.length > 0 ? candidate.skills.join(", ") : "Not specified"}
- Notes: ${candidate.notes || "No additional notes"}

**Job Position:**
- Title: ${job.title}
- Department: ${job.department}
- Description: ${job.description || "Not specified"}
- Requirements: ${job.requirements.length > 0 ? job.requirements.join("; ") : "Not specified"}

Analyze the candidate's fit for this role and provide a score and reasoning.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_candidate",
              description: "Provide a compatibility score and reasoning for the candidate",
              parameters: {
                type: "object",
                properties: {
                  score: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                    description: "Compatibility score from 0-100 where 100 is a perfect match",
                  },
                  reasoning: {
                    type: "string",
                    description: "A concise 2-3 sentence explanation of the score, highlighting key strengths and gaps",
                  },
                },
                required: ["score", "reasoning"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "score_candidate" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "score_candidate") {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`AI scoring completed for user ${userId}: score=${result.score}`);

    return new Response(
      JSON.stringify({
        score: result.score,
        reasoning: result.reasoning,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI scoring error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
