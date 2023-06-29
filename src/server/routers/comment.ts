import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        permalink: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { permalink } = input;
      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            discussion: {
              permalink,
            },
          },
          include: {
            author: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return comments;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  create: privateProcedure
    .input(
      z.object({
        permalink: z.string(),
        body: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { body, permalink, parentId } = input;
      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body,
            discussion: {
              connect: {
                permalink,
              },
            },
            author: {
              connect: {
                id: user?.id,
              },
            },
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });
        return comment;
      } catch (e) {
        console.log(e);

        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
