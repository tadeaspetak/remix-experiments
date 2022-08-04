import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createChallenge, updateChallenge } from "~/models/challenge.server";

import { requireUserId } from "~/session.server";
import type { Challenge } from "~/models/challenge.server";
import { ChallengeFields, badRequest } from "./utils";
import type { ChallengeFieldsType } from "./utils";

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries()) as ChallengeFieldsType;
  const result = ChallengeFields.safeParse(fields);

  if (!result.success) {
    return badRequest({ fields, errors: result.error.flatten() });
  }

  const { description, title } = result.data;
  if (fields.intent === "create") {
    const challenge = await createChallenge({ description, title, userId });
    return redirect(`/challenges/${challenge.id}`);
  } else {
    if (!params.challengeId) throw new Response("Not Found", { status: 404 });
    const challenge = await updateChallenge({
      id: params.challengeId,
      description,
      title,
      userId,
    });
    return redirect(`/challenges/${challenge.id}`);
  }
}

const ErrorMessage = ({ value }: { value: string[] | undefined }) => {
  return value ? (
    <div className="pt-1 text-red-700" id="title-error">
      {value[0]}
    </div>
  ) : null;
};

export function ChallengeForm({
  loaderData,
}: {
  loaderData?: Pick<Challenge, "id" | "title" | "description">;
}) {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const isExisting = !!loaderData;
  const data = actionData?.fields ?? loaderData;
  const errors = actionData?.errors?.fieldErrors;

  React.useEffect(() => {
    if (errors?.title) {
      titleRef.current?.focus();
    } else if (errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [errors]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex flex-col w-full gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 px-3 text-lg leading-loose border-2 border-blue-500 rounded-md"
            defaultValue={data?.title}
            aria-invalid={errors?.title ? true : undefined}
            aria-errormessage={errors?.title ? "title-error" : undefined}
          />
        </label>
        <ErrorMessage value={errors?.title} />
      </div>

      <div>
        <label className="flex flex-col w-full gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={8}
            defaultValue={data?.description}
            className="flex-1 w-full px-3 py-2 text-lg leading-6 border-2 border-blue-500 rounded-md"
            aria-invalid={errors?.description ? true : undefined}
            aria-errormessage={errors?.description ? "body-error" : undefined}
          />
        </label>
        <ErrorMessage value={errors?.description} />
      </div>

      <div className="text-right">
        <button
          name="intent"
          value={isExisting ? "update" : "create"}
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
        >
          {isExisting ? "Update" : "Save"}
        </button>
      </div>
    </Form>
  );
}
