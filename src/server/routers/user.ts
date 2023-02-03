import { z } from "zod";
import { publicProcedure, router } from "../trpc/trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
