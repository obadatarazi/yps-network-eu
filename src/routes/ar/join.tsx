import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { pageHead } from "@/lib/i18n";

export const Route = createFileRoute("/ar/join")({
  head: () => pageHead("join", "ar"),
  component: JoinPageAr,
});

function JoinPageAr() {
  return <SitePage page="join" />;
}
