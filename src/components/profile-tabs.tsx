import { useState } from "react";
import { Tab } from "@headlessui/react";
import { classNames } from "~/utils/classnames";
import { trpc } from "~/utils/trpc";
import Link from "next/link";
import dayjs from "~/lib/dayjs";
import { Button } from "./button";

const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="text-center py-6">
      <h2 className="font-semibold leading-8 tracking-tight text-sky-600">
        {title}
      </h2>
      <p className="leading-8 text-gray-600">{subtitle}</p>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div
      role="status"
      className="p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse dark:divide-gray-700 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const ProblemsSubmissions = ({ userId }: { userId: string }) => {
  const { data, isLoading } = trpc.submission.getAllByUserId.useQuery({
    userId,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <div className="p-4 text-red-600">Error fetching submissions</div>;
  }

  if (data.length == 0) {
    return (
      <EmptyState
        title="No submissions found"
        subtitle="Try out solving some problems and come back here."
      />
    );
  }

  return (
    <ul>
      {data.map((submission) => (
        <li
          key={submission.id}
          className="relative rounded-md p-3 hover:bg-gray-100"
        >
          <h3 className="text-sm font-medium leading-5">
            {submission.problem.title}
          </h3>

          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>{submission.verdict}</li>
            <li>&middot;</li>
            <li>{dayjs(submission.submittedAt).fromNow()} </li>
          </ul>

          <Link href={`/problem/${submission.problem.id}`}>
            <a
              className={classNames(
                "absolute inset-0 rounded-md",
                "ring-sky-400 focus:z-10 focus:outline-none focus:ring-2"
              )}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};
const BookmarkProblems = ({ userId }: { userId: string }) => {
  const { data, isLoading } = trpc.user.getAllBookmarks.useQuery({
    userId,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <div className="p-4 text-red-600">Error fetching bookmarks</div>;
  }

  if (data.length == 0) {
    return (
      <EmptyState
        title="No bookmark found"
        subtitle="Visit a problem to bookmark and come back here."
      />
    );
  }

  return (
    <ul>
      {data.map((bookmark) => (
        <li
          key={bookmark.id}
          className="relative rounded-md p-3 hover:bg-gray-100"
        >
          <h3 className="text-sm font-medium leading-5">
            {bookmark.problem.title}
          </h3>

          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>added {dayjs(bookmark.createdAt).fromNow()} </li>
          </ul>

          <Link href={`/problem/${bookmark.problem.id}`}>
            <a
              className={classNames(
                "absolute inset-0 rounded-md",
                "ring-sky-400 focus:z-10 focus:outline-none focus:ring-2"
              )}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default function ProfileTabs({ userId }: { userId: string }) {
  const [tabs] = useState([
    {
      id: 1,
      title: "Submissions",
    },
    {
      id: 2,
      title: "Bookmarks",
    },
  ]);

  return (
    <div className="px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                classNames(
                  selected
                    ? "bg-gray-100 text-gray-700"
                    : "text-gray-500 hover:text-gray-700",
                  "px-3 py-2 font-medium text-sm rounded-md outline-none"
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel key={1} className={classNames("rounded-xl bg-white")}>
            <ProblemsSubmissions userId={userId} />
          </Tab.Panel>
          <Tab.Panel key={2} className={classNames("rounded-xl bg-white")}>
            <BookmarkProblems userId={userId} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
