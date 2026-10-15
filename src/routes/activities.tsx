import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/activities")({
  head: () => pageHead("activities", "en"),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  return <SitePage page="activities" />;
}
