import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { dmcaDisclaimer, legalHead } from "@/lib/legal-content";

export const Route = createFileRoute("/dmca")({
  head: () => legalHead("/dmca", dmcaDisclaimer),
  component: DmcaPage,
});

function DmcaPage() {
  return <LegalPage document={dmcaDisclaimer} />;
}