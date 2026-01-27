import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const candidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  skills: z.array(z.string().max(100, "Skill name too long")).max(50, "Too many skills"),
  notes: z.string().max(2000, "Notes too long").optional().nullable(),
});

const jobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  department: z.string().min(1, "Department is required").max(100, "Department too long"),
  description: z.string().max(5000, "Description too long").optional().nullable(),
  requirements: z.array(z.string().max(500, "Requirement too long")).max(50, "Too many requirements"),
});

const requestSchema = z.object({
  candidate: candidateSchema,
  job: jobSchema,
});

// Sanitize text for safe prompt injection prevention
function sanitizeForPrompt(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/[\r\n]+/g, " ") // Replace newlines with spaces
    .replace(/[`]/g, "'") // Replace backticks
    .slice(0, 1000); // Enforce max length per field
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
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

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

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input with Zod schema
    const validationResult = requestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      console.error("Validation error:", errors);
      return new Response(
        JSON.stringify({ error: `Invalid input: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { candidate, job } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Sanitize all user inputs before including in prompt
    const sanitizedCandidate = {
      name: sanitizeForPrompt(candidate.name),
      skills: candidate.skills.map(s => sanitizeForPrompt(s)).filter(Boolean),
      notes: sanitizeForPrompt(candidate.notes),
    };

    const sanitizedJob = {
      title: sanitizeForPrompt(job.title),
      department: sanitizeForPrompt(job.department),
      description: sanitizeForPrompt(job.description),
      requirements: job.requirements.map(r => sanitizeForPrompt(r)).filter(Boolean),
    };

    const systemPrompt = `You are an expert HR recruiter and talent evaluator. Your task is to analyze a candidate's profile against a job posting and provide a compatibility score.

Be objective and fair in your assessment. Consider:
1. Skills match - how well the candidate's skills align with job requirements
2. Experience relevance - inferred from skills and notes
3. Potential fit - based on available information

Respond using the provided function to return a structured score and reasoning.`;

    const userPrompt = `Evaluate this candidate for the following job position:

**Candidate Profile:**
- Name: ${sanitizedCandidate.name}
- Skills: ${sanitizedCandidate.skills.length > 0 ? sanitizedCandidate.skills.join(", ") : "Not specified"}
- Notes: ${sanitizedCandidate.notes || "No additional notes"}

**Job Position:**
- Title: ${sanitizedJob.title}
- Department: ${sanitizedJob.department}
- Description: ${sanitizedJob.description || "Not specified"}
- Requirements: ${sanitizedJob.requirements.length > 0 ? sanitizedJob.requirements.join("; ") : "Not specified"}

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
