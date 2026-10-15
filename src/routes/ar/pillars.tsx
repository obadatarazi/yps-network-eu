import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/pillars")({
  head: () => pageHead("pillars", "ar"),
  component: PillarsPageAr,
});

function PillarsPageAr() {
  return <SitePage page="pillars" />;
}
