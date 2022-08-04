import { z } from "zod";
import { json } from "@remix-run/node";

// This type infer errors from a ZodType, as produced by `flatten()` of a parsed schema.
type inferSafeParseErrors<T extends z.ZodType<any, any, any>, U = string> = {
  formErrors: U[];
  fieldErrors: {
    [P in keyof z.infer<T>]?: U[];
  };
};

export const ChallengeFields = z.object({
  description: z.string().min(1, { message: "Description can't be empty." }),
  title: z.string().min(1, { message: "Give us a title, would ya?" }),
});
export type ChallengeFieldsType = z.infer<typeof ChallengeFields> & {
  intent: "create" | "update";
};
export type ChallengeFieldsErrors = inferSafeParseErrors<
  typeof ChallengeFields
>;

export type ChallengeActionData = {
  fields: ChallengeFieldsType;
  errors?: ChallengeFieldsErrors;
};

export const badRequest = (data: ChallengeActionData) =>
  json(data, { status: 400 });
