import { router } from "~/server/trpc/trpc";
import { problemRouter } from "./problem";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  problem: problemRouter,
});

export type AppRouter = typeof appRouter;
