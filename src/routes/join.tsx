import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/join")({
  head: () => pageHead("join", "en"),
  component: JoinPage,
});

function JoinPage() {
  return <SitePage page="join" />;
}
