import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Server, FileCheck, Users } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II",
    description: "We maintain SOC 2 Type II compliance, with annual audits by independent third parties.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Role-based access control ensures team members only access data they need.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring and DDoS protection.",
  },
  {
    icon: FileCheck,
    title: "GDPR Compliant",
    description: "Full compliance with GDPR and other privacy regulations. Data processing agreements available.",
  },
  {
    icon: Users,
    title: "SSO & MFA",
    description: "Enterprise SSO integration and multi-factor authentication for enhanced account security.",
  },
];

const certifications = [
  "SOC 2 Type II",
  "GDPR",
  "CCPA",
  "ISO 27001",
  "HIPAA (BAA Available)",
];

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Security at Hireflow
            </h1>
            <p className="text-xl text-muted-foreground">
              We take the security of your data seriously. Learn about our security practices and certifications.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Certifications & Compliance
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="text-sm px-4 py-2">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* Security Practices */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Our Security Practices</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Infrastructure Security</h3>
                <p className="text-muted-foreground">
                  Our infrastructure is hosted on leading cloud providers with SOC 2 certification. We employ network segmentation, firewalls, intrusion detection systems, and regular vulnerability scanning to protect our systems.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Application Security</h3>
                <p className="text-muted-foreground">
                  We follow secure development practices including code reviews, automated security testing, and regular penetration testing by third-party security firms. All dependencies are monitored for vulnerabilities.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Data Protection</h3>
                <p className="text-muted-foreground">
                  Customer data is isolated using logical separation. We implement strict access controls, audit logging, and data retention policies. Regular backups ensure data durability and disaster recovery capability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Incident Response</h3>
                <p className="text-muted-foreground">
                  We maintain a documented incident response plan with defined roles and procedures. In the event of a security incident, affected customers will be notified promptly in accordance with applicable regulations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Employee Security</h3>
                <p className="text-muted-foreground">
                  All employees undergo background checks and security training. Access to customer data is limited to authorized personnel and requires multi-factor authentication. We follow the principle of least privilege.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Security Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              If you have security concerns or want to report a vulnerability, please contact our security team.
            </p>
            <a 
              href="mailto:security@hireflow.com" 
              className="text-primary hover:underline font-medium"
            >
              security@hireflow.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
