import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import ProblemForm from "~/components/problem-form";
import { SITE_NAME } from "~/utils/constants";
import { trpc } from "~/utils/trpc";

export default function CreateProblemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const addProblemMutation = trpc.problem.create.useMutation({
    onError: (error) => {
      alert(`Something went wrong: ${error.message}`);
    },
  });

  if (session?.user.role !== "ADMIN") {
    router.replace("/");
    return;
  }

  return (
    <div>
      <Head>
        <title>Create a problem - {SITE_NAME}</title>
      </Head>

      <div className="col-span-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 px-4 sm:px-0 ">
          Create a problem
        </h3>
        <div className="mt-6">
          <ProblemForm
            isSubmitting={addProblemMutation.isLoading}
            defaultValues={{
              title: "",
              statement: "",
              solution: "",
            }}
            backTo="/"
            onSubmit={(values) => {
              addProblemMutation.mutate(
                {
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
      </div>
    </div>
  );
}

CreateProblemPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

CreateProblemPage.auth = true;
