import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { legalHead, termsOfService } from "@/lib/legal-content";

export const Route = createFileRoute("/terms-of-service")({
  head: () => legalHead("/terms-of-service", termsOfService),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return <LegalPage document={termsOfService} />;
}