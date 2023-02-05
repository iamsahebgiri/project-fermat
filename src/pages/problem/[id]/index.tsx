import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "~/components/button";
import { ButtonLink } from "~/components/button-link";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/dialog";
import Layout from "~/components/layout";
import Markdown from "~/components/markdown";
import {
  SubmitSolutionType,
  submitSolutionValidator,
} from "~/shared/solution-validator";
import { trpc } from "~/utils/trpc";

const ProblemPageContent: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();

  const { data: problem, isLoading: isProblemLoading } =
    trpc.problem.getById.useQuery({ id });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitSolutionType>({
    resolver: zodResolver(submitSolutionValidator),
  });
  const { data: session } = useSession();

  const { mutate, isLoading, data } = trpc.problem.validateSolution.useMutation(
    {
      onSuccess: () => {
        router.push(`/`);
      },
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true);
  }

  if (isProblemLoading) {
    return (
      <div
        role="status"
        className="p-4 space-y-4 max-w-full rounded-lg border bg-white border-slate-200 divide-y divide-slate-200 shadow animate-pulse dark:divide-slate-700 md:p-6 dark:border-slate-700"
      >
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!problem) {
    return <div>problem not found</div>;
  }

  return (
    <>
      <Head>
        <title>{problem.title} - Fermat</title>
      </Head>

      <div className="px-4 sm:px-0 space-y-6">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {problem.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Created on {problem.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2 flex">
              <Bookmark problemId={problem.id} />

              {session?.user.role === "ADMIN" ? (
                <>
                  <ButtonLink
                    variant="secondary"
                    href={`/problem/${problem.id}/edit`}
                  >
                    Edit
                  </ButtonLink>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6 prose prose-slate max-w-none">
            {/* eslint-disable-next-line react/no-children-prop */}
            <Markdown children={problem.statement} />
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form
              onSubmit={handleSubmit((data) => {
                mutate(data);
              })}
            >
              <div className="w-full sm:w-1/4">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Your solution
                  </span>
                </label>
                <input
                  {...register("solution")}
                  type="text"
                  className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md"
                  placeholder="Solution"
                />
                {errors.solution && (
                  <p className="text-red-400">{errors.solution.message}</p>
                )}
              </div>
              <input {...register("problemId")} type="hidden" value={id} />
              <div>
                <Button
                  className="w-full sm:w-auto text-center mt-2"
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmDeleteDialog
        id={id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false);
        }}
      />
    </>
  );
};

export default function ProblemPage() {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <ProblemPageContent id={id} />;
}

function ConfirmDeleteDialog({
  id,
  isOpen,
  onClose,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const deletePostMutation = trpc.problem.delete.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete problem</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this problem?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="danger"
          isLoading={deletePostMutation.isLoading}
          loadingChildren="Deleting problem"
          onClick={() => {
            deletePostMutation.mutate(
              { id },
              {
                onSuccess: () => router.push("/"),
              }
            );
          }}
        >
          Delete problem
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Bookmark = ({ problemId }: { problemId: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, isLoading } = trpc.problem.isBookmarked.useQuery(
    {
      problemId,
    },
    {
      onSuccess: (data) => {
        setIsBookmarked(data.isBookmarked);
      },
    }
  );

  // FIX: On succssive click on the button it errors out
  // Invalid `prisma.bookmark.delete()` invocation:
  const { mutate: removeBookmark, isLoading: isLoadingRemoveBookmark } =
    trpc.problem.removeFromBookmark.useMutation({
      onSuccess: () => {
        toast.success("Bookmark removed successfully!");
        setIsBookmarked(false);
      },
      onError(error) {
        toast.error(error.message);
        setIsBookmarked(true);
      },
    });

  const { mutate: addToBookmark, isLoading: isLoadingAddToBookmark } =
    trpc.problem.addToBookmark.useMutation({
      onSuccess: () => {
        toast.success("Bookmark added successfully!");
        setIsBookmarked(true);
      },
      onError(error) {
        toast.error(error.message);
        setIsBookmarked(false);
      },
    });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>
    );
  }
  if (!data)
    return <div className="text-red-600">Error in fetching bookmark</div>;

  if (isBookmarked) {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          removeBookmark({
            bookmarkId: data.id ?? "",
          });
        }}
        isLoading={isLoadingRemoveBookmark}
      >
        Remove from bookmark
      </Button>
    );
  } else {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          addToBookmark({
            problemId,
          });
        }}
        isLoading={isLoadingAddToBookmark}
      >
        Add to bookmark
      </Button>
    );
  }
};

ProblemPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
ProblemPage.auth = true;
