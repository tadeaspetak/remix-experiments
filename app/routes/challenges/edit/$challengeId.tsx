import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { getChallenge } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";
import { action, ChallengeForm } from "../CreateOrUpdateChallenge";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.challengeId, "challengeId not defined");

  const challenge = await getChallenge({ userId, id: params.challengeId });
  if (!challenge) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ challenge });
}

// reuse the same component for creating & updating
export { action };
export default function UpdateChallenge() {
  const data = useLoaderData<typeof loader>();
  return <ChallengeForm loaderData={data?.challenge} />;
}
