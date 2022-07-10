import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
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

  const { data: problem, isLoading: isProblemLoading } = trpc.useQuery([
    "problem.getById",
    { id },
  ]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitSolutionType>({
    resolver: zodResolver(submitSolutionValidator),
  });
  const { data: session } = useSession();

  const { mutate, isLoading, data } = trpc.useMutation(
    "problem.validateSolution",
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
      <div className="antialiased min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!problem) {
    return <div>problem not found</div>;
  }

  return (
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
          <div>
            {session?.user.role === "ADMIN" ? (
              <>
                <ButtonLink
                  variant="secondary"
                  href={`/problem/${problem.id}/edit`}
                  className="mr-2"
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

      <ConfirmDeleteDialog
        id={id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false);
        }}
      />
    </div>
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

ProblemPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
ProblemPage.auth = true;

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
  const deletePostMutation = trpc.useMutation("problem.delete", {
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
