import Link from "next/link";
import React from "react";
import { Button } from "~/components/button";
import { ButtonLink } from "~/components/button-link";
import Layout from "~/components/layout";
import { trpc } from "~/utils/trpc";

function Discussion({ discussion }: { discussion: any }) {
  return <div>
    <Link href={`/discussions/${discussion.permalink}`}>{discussion.title}</Link>
  </div>;
}

function DiscussionPage() {
  const { data: discussions, isLoading: isDiscussionsLoading } =
    trpc.discussion.getAll.useQuery();

  if (isDiscussionsLoading) {
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

  if (!discussions) {
    return <div>No Discussions</div>;
  }
  return (
    <div>
      <ButtonLink href="/discussions/create">Create discussion</ButtonLink>
      {discussions.map((discussion) => (
        <Discussion key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}

export default DiscussionPage;

DiscussionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
