import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => pageHead("home", "en"),
  component: HomePage,
});

function HomePage() {
  return <SitePage page="home" />;
}
