import { router } from "~/server/trpc/trpc";
import { problemRouter } from "./problem";
import { submissionRouter } from "./submission";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  problem: problemRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
