import { router } from "~/server/trpc/trpc";
import { problemRouter } from "./problem";
import { submissionRouter } from "./submission";
import { userRouter } from "./user";
import { discussionRouter } from "./discussion";
import { commentRouter } from "./comment";

export const appRouter = router({
  user: userRouter,
  problem: problemRouter,
  submission: submissionRouter,
  discussion: discussionRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
