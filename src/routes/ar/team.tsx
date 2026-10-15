import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/team")({
  head: () => pageHead("team", "ar"),
  component: TeamPageAr,
});

function TeamPageAr() {
  return <SitePage page="team" />;
}
