import { z } from "zod";
import { publicProcedure, router } from "../trpc/trpc";

export const submissionRouter = router({
  getAllByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.submission.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          problem: {
            select: {
              title: true,
              id: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
    }),
});
