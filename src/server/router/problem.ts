import { createRouter } from "./context";
import { z } from "zod";
import {
  createProblemValidator,
  editProblemValidator,
} from "~/shared/problem-validator";
import { submitSolutionValidator } from "~/shared/solution-validator";
import * as trpc from "@trpc/server";
import { Submission } from "@prisma/client";

export const problemRouter = createRouter()
  .query("getById", {
    input: z
      .object({
        id: z.string(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
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
    },
  })
  .query("getAllByUserId", {
    input: z.object({
      id: z.string().nullable(),
    }),
    async resolve({ ctx, input }) {
      let submissions: any = [];
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
      submissions.forEach((submission: Submission) => {
        submissionsSet.add(submission.problemId);
      });

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
    },
  })
  .mutation("validateSolution", {
    input: submitSolutionValidator,
    async resolve({ ctx, input }) {
      const problem = await ctx.prisma.problem.findUnique({
        where: {
          id: input.problemId,
        },
      });

      if (!problem) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "Problem with the given id not found!",
        });
      }

      const verdict = input.solution !== problem.solution ? "FAILED" : "PASSED";

      if (verdict === "FAILED") {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect solution!",
        });
      }

      if (!ctx.session?.user.id) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.prisma.submission.create({
        data: {
          verdict,
          problemId: input.problemId,
          userId: ctx.session?.user.id,
        },
      });

      return {
        message: "OK! Passed",
      };
    },
  })
  .mutation("create", {
    input: createProblemValidator,
    async resolve({ input, ctx }) {
      if (ctx.session?.user.role !== "ADMIN") {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
        });
      }

      return await ctx.prisma.problem.create({
        data: {
          title: input.title,
          statement: input.statement,
          solution: input.solution,
        },
      });
    },
  })
  .mutation("edit", {
    input: editProblemValidator,
    async resolve({ ctx, input }) {
      if (ctx.session?.user.role !== "ADMIN") {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
        });
      }

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
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.role !== "ADMIN") {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
        });
      }

      return await ctx.prisma.problem.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
