import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/regions")({
  head: () => pageHead("regions", "ar"),
  validateSearch: (search: Record<string, unknown>) => ({
    hub: typeof search.hub === "string" ? search.hub : undefined,
  }),
  component: RegionsPageAr,
});

function RegionsPageAr() {
  return <SitePage page="regions" />;
}
