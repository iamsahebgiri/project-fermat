import { z } from "zod";

export const submitSolutionValidator = z.object({
  solution: z
    .string({ required_error: "Solution is required" })
    .min(1, { message: "Solution can't be empty!" }),
  problemId: z.string(),
});

export type SubmitSolutionType = z.infer<typeof submitSolutionValidator>;
