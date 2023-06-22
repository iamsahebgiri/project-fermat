import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc/trpc";

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
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
        },
      });
    }),
  getLeaderboard: publicProcedure.query(async ({ ctx, input }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
      },
      orderBy: {
        points: "desc",
      },
    });
    return users;
  }),
  getAllBookmarks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const bookmarks = await ctx.prisma.bookmark.findMany({
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
      });
      return bookmarks;
    }),
});
