import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteChallenge, getChallenge } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.challengeId, "challengeId not found");

  const challenge = await getChallenge({ userId, id: params.challengeId });
  if (!challenge) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ challenge });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.challengeId, "challengeId not found");

  await deleteChallenge({ userId, id: params.challengeId });

  return redirect("/challenges");
}

export default function ChallengeDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.challenge.title}</h3>
      <p className="py-6">{data.challenge.description}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <Link
        to={`/challenges/edit/${data.challenge.id}`}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
      >
        Edit
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Challenge not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
