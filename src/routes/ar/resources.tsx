import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/resources")({
  head: () => pageHead("resources", "ar"),
  component: ResourcesPageAr,
});

function ResourcesPageAr() {
  return <SitePage page="resources" />;
}
