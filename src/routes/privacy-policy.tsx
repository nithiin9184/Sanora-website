import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { legalHead, privacyPolicy } from "@/lib/legal-content";

export const Route = createFileRoute("/privacy-policy")({
  head: () => legalHead("/privacy-policy", privacyPolicy),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}