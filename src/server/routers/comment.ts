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

        return comments.map((comment) => {
          if (comment.deletedAt) {
            return {
              ...comment,
              body: "[redacted]",
            };
          }
          return comment;
        });
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
          include: {
            author: {
              select: {
                name: true,
                id: true,
                image: true,
              },
            },
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
  edit: privateProcedure
    .input(
      z.object({
        id: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { body, id } = input;

      try {
        const updatedComment = await ctx.prisma.comment.update({
          where: {
            id,
          },
          data: {
            body,
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
        });
        return updatedComment;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const comment = await ctx.prisma.comment.findUniqueOrThrow({
          where: {
            id,
          },
        });

        // See if it has any childrens
        const childrens = await ctx.prisma.comment.count({
          where: {
            parentId: comment.id,
          },
        });

        // if it has children then soft delete the comment
        if (childrens > 0) {
          await ctx.prisma.comment.update({
            where: { id },
            data: {
              deletedAt: new Date(),
            },
          });
          return "updated";
        } else {
          await ctx.prisma.comment.delete({
            where: {
              id,
            },
          });
          return "deleted";
        }
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
