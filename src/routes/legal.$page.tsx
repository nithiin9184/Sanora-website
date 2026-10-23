import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/$page")({
  beforeLoad: ({ params }) => {
    if (params.page === "privacy") throw redirect({ to: "/privacy-policy", statusCode: 301 });
    if (params.page === "terms") throw redirect({ to: "/terms-of-service", statusCode: 301 });
    if (params.page === "dmca") throw redirect({ to: "/dmca", statusCode: 301 });
    throw notFound();
  },
  head: () => ({ meta: [
    { title: "Legal page unavailable — SANORA Music" },
    { name: "description", content: "Find SANORA Music legal documents through the Legal & Safety links." },
    { property: "og:title", content: "Legal page unavailable — SANORA Music" },
    { property: "og:description", content: "Find SANORA Music privacy, terms, and copyright documents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
