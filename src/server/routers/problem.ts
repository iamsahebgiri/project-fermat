import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createProblemValidator,
  editProblemValidator,
} from "~/shared/problem-validator";
import { submitSolutionValidator } from "~/shared/solution-validator";
import {
  privateProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc/trpc";

export const problemRouter = router({
  getById: publicProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      const problem = await ctx.prisma.problem.findUnique({
        where: {
          id: input?.id,
        },
        select: {
          id: true,
          title: true,
          statement: true,
          solution: ctx.session?.user.role === "ADMIN",
          createdAt: true,
        },
      });
      return problem;
    }),
  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const limit = input.limit ?? 30;

      let submissions = null;

      if (ctx.session?.user.id) {
        submissions = await ctx.prisma.submission.findMany({
          where: {
            verdict: "PASSED",
            userId: ctx.session?.user.id,
          },
          distinct: ["problemId"],
          select: {
            problemId: true,
          },
        });
      }

      const submissionsSet = new Set();
      if (submissions !== null) {
        submissions.forEach((submission) => {
          submissionsSet.add(submission.problemId);
        });
      }

      const problems = await ctx.prisma.problem.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          title: true,
          statement: true,
          createdAt: true,
          difficulty: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      const problemsWithMeta = problems.map((problem) => ({
        ...problem,
        isSolved: submissionsSet.has(problem.id),
      }));

      let nextCursor: typeof cursor | undefined = undefined;

      if (problems.length > limit) {
        const nextItem = problems.pop();
        nextCursor = nextItem!.id;
      }

      return {
        problems: problemsWithMeta,
        nextCursor,
      };
    }),
  getAllByUserId: publicProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      let submissions = null;
      if (input.id !== null) {
        submissions = await ctx.prisma.submission.findMany({
          where: {
            verdict: "PASSED",
            userId: input.id,
          },
          distinct: ["problemId"],
          select: {
            problemId: true,
          },
        });
      } else if (ctx.session?.user.id) {
        submissions = await ctx.prisma.submission.findMany({
          where: {
            verdict: "PASSED",
            userId: ctx.session?.user.id,
          },
          distinct: ["problemId"],
          select: {
            problemId: true,
          },
        });
      }

      const submissionsSet = new Set();
      if (submissions !== null) {
        submissions.forEach((submission) => {
          submissionsSet.add(submission.problemId);
        });
      }

      const problems = await ctx.prisma.problem.findMany({
        select: {
          id: true,
          title: true,
          statement: true,
          createdAt: true,
          difficulty: true,
        },
        orderBy: {
          difficulty: "asc",
        },
      });

      const problemsWithMeta = problems.map((problem) => ({
        ...problem,
        isSolved: submissionsSet.has(problem.id),
      }));

      return problemsWithMeta;
    }),
  validateSolution: protectedProcedure
    .input(submitSolutionValidator)
    .mutation(async ({ ctx, input }) => {
      const problem = await ctx.prisma.problem.findUnique({
        where: {
          id: input.problemId,
        },
      });

      if (!problem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Problem with the given id not found!",
        });
      }

      const verdict = input.solution !== problem.solution ? "FAILED" : "PASSED";

      await ctx.prisma.submission.create({
        data: {
          verdict,
          problemId: input.problemId,
          userId: ctx.session?.user.id,
        },
      });

      if (verdict === "FAILED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect solution!",
        });
      }

      // Update points
      const correctSolutions = await ctx.prisma.submission.findMany({
        where: {
          AND: {
            userId: ctx.session.user.id,
            verdict: "PASSED",
          },
        },
        include: {
          problem: true,
        },
        distinct: ["problemId"],
      });

      let points = 0;
      for (let solution of correctSolutions) {
        points += solution.problem.difficulty * 2;
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          points: points,
        },
      });

      // add badge
      // let badges = "";
      // if (correctSolutions.length === 1) {
      //   badges.push("level-1");
      // } else if (correctSolutions.length === 5) {

      // }
      let badge = null;
      switch (correctSolutions.length) {
        case 1:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Intern",
            },
          });
          break;
        case 5:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Master",
            },
          });
          break;
        case 10:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Ninja",
            },
          });
          break;
        case 20:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Guru",
            },
          });
          break;
        case 30:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Unstoppable",
            },
          });
          break;
        case 50:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Unbeatable",
            },
          });
          break;
        case 100:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Epic",
            },
          });
          break;
        case 120:
          badge = await ctx.prisma.badge.findFirstOrThrow({
            where: {
              name: "Respect",
            },
          });
          break;

        default:
          break;
      }

      if (badge !== null) {
        await ctx.prisma.badgesOnUser.create({
          data: {
            badgeId: badge.id,
            userId: ctx.session.user.id,
          },
        });
      }

      return {
        message: "OK! Passed",
      };
    }),
  create: privateProcedure
    .input(createProblemValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.problem.create({
        data: {
          title: input.title,
          statement: input.statement,
          solution: input.solution,
          difficulty: 5,
        },
      });
    }),
  edit: privateProcedure
    .input(editProblemValidator)
    .mutation(async ({ ctx, input }) => {
      const { id, title, statement, solution } = input;

      return await ctx.prisma.problem.update({
        where: {
          id,
        },
        data: {
          title,
          statement,
          solution,
        },
        select: {
          id: true,
          statement: true,
          title: true,
        },
      });
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.problem.delete({
        where: {
          id: input.id,
        },
      });
    }),
  isBookmarked: protectedProcedure
    .input(
      z.object({
        problemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: {
          AND: {
            problemId: input.problemId,
            userId,
          },
        },
      });

      if (bookmarks.length > 0) {
        const bookmark = bookmarks[0];
        return { isBookmarked: true, ...bookmark };
      }

      return { isBookmarked: false };
    }),
  addToBookmark: protectedProcedure
    .input(
      z.object({
        problemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const bookmarks = await ctx.prisma.bookmark.findMany({
        where: {
          AND: {
            problemId: input.problemId,
            userId,
          },
        },
      });

      if (bookmarks.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bookmark already exists!",
        });
      }

      return await ctx.prisma.bookmark.create({
        data: {
          problemId: input.problemId,
          userId,
        },
      });
    }),
  removeFromBookmark: protectedProcedure
    .input(
      z.object({
        bookmarkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bookmark.delete({
        where: {
          id: input.bookmarkId,
        },
      });
    }),
});
