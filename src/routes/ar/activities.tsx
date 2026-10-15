import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/activities")({
  head: () => pageHead("activities", "ar"),
  component: ActivitiesPageAr,
});

function ActivitiesPageAr() {
  return <SitePage page="activities" />;
}
