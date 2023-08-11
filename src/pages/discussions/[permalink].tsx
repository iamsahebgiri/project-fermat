import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import CommentSection from "~/components/comment/comment-section";
import Layout from "~/components/layout";
import Markdown from "~/components/markdown";
import { Button } from "~/components/button";
import { trpc } from "~/utils/trpc";
import { useSession } from "next-auth/react";

function DeleteDiscussion({ discussionId }: { discussionId: string }) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.discussion.delete.useMutation({
    onSuccess: () => {
      router.replace("/discussions");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Button
      variant="danger"
      isLoading={isLoading}
      onClick={() => mutate({ id: discussionId })}
    >
      Delete
    </Button>
  );
}

function SingleDiscussionPageContent({ permalink }: { permalink: string }) {
  const { data: session } = useSession();
  const { data: discussion, isLoading: isDiscussionLoading } =
    trpc.discussion.getByPermalink.useQuery({ permalink });

  if (isDiscussionLoading) {
    return (
      <div
        role="status"
        className="p-4 space-y-4 max-w-full rounded-lg border bg-white border-slate-200 divide-y divide-slate-200 shadow animate-pulse dark:divide-slate-700 md:p-6 dark:border-slate-700"
      >
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5" />
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5" />
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  return (
    <div className="space-y-8 px-4 md:p-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200">
          {discussion?.title}
        </h2>
        Posted by{" "}
        <Link href={`/profile/${discussion.author.id}`}>
          <a>{discussion?.author.name}</a>
        </Link>{" "}
        on{" "}
        {discussion?.createdAt.toLocaleDateString("en-US", {
          dateStyle: "long",
        })}
      </div>
      <div className="prose prose-slate max-w-3xl">
        <Markdown>{discussion?.body}</Markdown>
      </div>
      {session?.user.id === discussion.author.id && (
        <DeleteDiscussion discussionId={discussion.id} />
      )}

      <CommentSection />
    </div>
  );
}

function SingleDiscussionPage() {
  const { query } = useRouter();
  const { permalink } = query;

  if (!permalink || typeof permalink !== "string") {
    return <div>No permalink</div>;
  }

  return <SingleDiscussionPageContent permalink={permalink} />;
}

export default SingleDiscussionPage;

SingleDiscussionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
