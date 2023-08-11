import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Icon } from "@iconify/react";
import eye20Regular from "@iconify/icons-fluent/eye-20-regular";
import { Button } from "~/components/button";
import { ButtonLink } from "~/components/button-link";
import Layout from "~/components/layout";
import { SITE_NAME } from "~/utils/constants";
import { trpc } from "~/utils/trpc";
import dayjs from "~/lib/dayjs";
import { formatNumber } from "~/utils/numbers";
import EmptyState from "~/components/empty-state";
import emptyBox from "../../../public/empty-states/empty-box.png"

function DiscussionPage() {
  const { data: discussions, isLoading } = trpc.discussion.getAll.useQuery();

  if (isLoading) {
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
      <Head>
        <title>Discussions - {SITE_NAME}</title>
      </Head>
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              Discussion
            </h2>
            <p className="text-gray-500 text-sm">
              Start a discussion and write your thoughts
            </p>
          </div>
          <ButtonLink href="/discussions/create">Create discussion</ButtonLink>
        </div>
        {discussions.length === 0 ? (
          <div className="bg-white p-2 rounded-lg shadow text-center">
            <EmptyState
              title="No discussion yet"
              subtitle="There been no discussion made yet."
              url={emptyBox}
            />
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200 ">
            {discussions.map((discussion) => (
              <li
                key={discussion.id}
                className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-600 rounded"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/discussions/${discussion.permalink}`}
                      className="block focus:outline-none"
                    >
                      <a>
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {discussion.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {discussion.author.name}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <time
                    dateTime={discussion.createdAt.toString()}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                  >
                    {dayjs(discussion.createdAt).fromNow()}
                  </time>
                </div>
                <div className="mt-1 text-xs text-gray-500 space-x-2">
                  <span className="flex items-center gap-1">
                    {/* <Icon icon={eye20Regular} className="h-5 w-5" />{" "} */}
                    {formatNumber(discussion.views)} views
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DiscussionPage;

DiscussionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
