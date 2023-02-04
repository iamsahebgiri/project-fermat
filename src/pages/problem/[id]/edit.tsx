import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import ProblemForm from "~/components/problem-form";
import { trpc } from "~/utils/trpc";

const EditProblem: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  // const problemQuery = trpc.useQuery(["problem.getById", { id }]);
  const problemQuery = trpc.problem.getById.useQuery({ id });
  const editProblemMutation = trpc.problem.edit.useMutation({
    onError: (error) => {
      alert(`Something went wrong: ${error.message}`);
    },
  });

  if (problemQuery.data) {
    return (
      <>
        <Head>
          <title>Edit {problemQuery.data.title} - Fermat</title>
        </Head>

        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl px-4 sm:px-0">
          Edit &quot;{problemQuery.data.title}&quot;
        </h1>

        <div className="mt-6">
          <ProblemForm
            isSubmitting={editProblemMutation.isLoading}
            defaultValues={{
              title: problemQuery.data.title,
              statement: problemQuery.data.statement,
              solution: problemQuery.data.solution,
            }}
            backTo="/"
            onSubmit={(values) => {
              editProblemMutation.mutate(
                {
                  id: id,
                  title: values.title,
                  statement: values.statement,
                  solution: values.solution,
                },
                {
                  onSuccess: (data) => router.push(`/problem/${data.id}`),
                }
              );
            }}
          />
        </div>
      </>
    );
  }

  if (problemQuery.isError) {
    return <div>Error: {problemQuery.error.message}</div>;
  }

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="mt-7">
        <div>
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="border rounded h-[42px] border-secondary mt-2" />
        </div>
        <div className="mt-6">
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="mt-2 border rounded h-9 border-secondary" />
          <div className="mt-2 border rounded h-[378px] border-secondary" />
        </div>
      </div>
      <div className="flex gap-4 mt-9">
        <div className="w-[92px] bg-gray-200 rounded-full h-button dark:bg-gray-700" />
        <div className="w-20 border rounded-full h-button border-secondary" />
      </div>
    </div>
  );
};

export default function EditProblemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  if (session?.user.role !== "ADMIN") {
    router.replace("/");
    return;
  }

  return <EditProblem id={id} />;
}

EditProblemPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
EditProblemPage.auth = true;
