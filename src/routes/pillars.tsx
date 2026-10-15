import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/pillars")({
  head: () => pageHead("pillars", "en"),
  component: PillarsPage,
});

function PillarsPage() {
  return <SitePage page="pillars" />;
}
