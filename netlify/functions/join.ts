import { handleJoinRequest } from "../../src/lib/join-mail.server.ts";

export default async function handler(request: Request): Promise<Response> {
  return handleJoinRequest(request);
}
