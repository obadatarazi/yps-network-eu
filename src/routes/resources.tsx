import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => pageHead("resources", "en"),
  component: ResourcesPage,
});

function ResourcesPage() {
  return <SitePage page="resources" />;
}
