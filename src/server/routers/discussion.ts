import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc/trpc";
import crypto from "crypto";

const getPermaLink = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const discussionRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.discussion.findMany({
      select: {
        id: true,
        title: true,
        body: true,
        permalink: true,
        author: true,
      },
    });
  }),
  getByPermalink: publicProcedure
    .input(
      z.object({
        permalink: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { permalink } = input;

      return await ctx.prisma.discussion.findUnique({
        where: {
          permalink,
        },
        select: {
          id: true,
          title: true,
          body: true,
          permalink: true,
          author: {
            select: {
              name: true,
            },
          },
          createdAt: true,
        },
      });
    }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, body } = input;

      const permalink = `${getPermaLink(title)}-${crypto
        .randomBytes(2)
        .toString("hex")}`;

      const user = ctx.session?.user;

      return ctx.prisma.discussion.create({
        data: {
          title,
          body,
          permalink,
          author: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
    }),
});
