import { z } from "zod";

export const createProblemValidator = z.object({
  title: z.string(),
  statement: z.string().min(5),
  solution: z.string(),
});

export const editProblemValidator = z.object({
  id: z.string(),
  title: z.string(),
  statement: z.string().min(5),
  solution: z.string(),
});

export type CreateQuestionInputType = z.infer<typeof createProblemValidator>;
