import { createFileRoute } from "@tanstack/react-router";
import { handleJoinRequest } from "@/lib/join-mail.server";

export const Route = createFileRoute("/api/join")({
  server: {
    handlers: {
      POST: ({ request }) => handleJoinRequest(request),
    },
  },
});
