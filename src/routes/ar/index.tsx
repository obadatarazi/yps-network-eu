import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/")({
  head: () => pageHead("home", "ar"),
  component: HomePageAr,
});

function HomePageAr() {
  return <SitePage page="home" />;
}
