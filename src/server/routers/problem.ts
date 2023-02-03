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
});
