import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import DiscussionForm from "~/components/discussion-form";
import Layout from "~/components/layout";
import { SITE_NAME } from "~/utils/constants";
import { trpc } from "~/utils/trpc";

function CreateDiscussionPage() {
  const router = useRouter();
  const createDiscussionMutation = trpc.discussion.create.useMutation({
    onError: (error) => {
      alert(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <div>
      <Head>
        <title>Create a Discussion - {SITE_NAME}</title>
      </Head>

      <div className="col-span-8">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 px-4 sm:px-0 ">
          Create a Discussion
        </h3>
        <div className="mt-6">
          <DiscussionForm
            isSubmitting={createDiscussionMutation.isLoading}
            defaultValues={{
              title: "",
              body: "",
            }}
            backTo="/"
            onSubmit={(values) => {
              createDiscussionMutation.mutate(
                {
                  title: values.title,
                  body: values.body,
                },
                {
                  onSuccess: (data) =>
                    router.push(`/discussions/${data.permalink}`),
                }
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateDiscussionPage;

CreateDiscussionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
