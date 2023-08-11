import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc/trpc";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

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
        views: true,
        createdAt: true,
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

      await ctx.prisma.discussion.update({
        where: {
          permalink,
        },
        data: {
          views: { increment: 1 },
        },
      });

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
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
      });
    }),
  create: protectedProcedure
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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        await ctx.prisma.discussion.delete({
          where: {
            id,
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
