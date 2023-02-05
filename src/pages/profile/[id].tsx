import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import ProfileTabs from "~/components/profile-tabs";
import { classNames } from "~/utils/classnames";
import { getGradient } from "~/utils/gradient";
import { trpc } from "~/utils/trpc";

const ProblemsSolvedGraph: React.FC<{ id: string }> = ({ id }) => {
  const { data: problems, isLoading } = trpc.problem.getAllByUserId.useQuery({
    id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!problems) {
    return <div>No problems found!</div>;
  }

  console.log(problems);

  let total = problems.length;
  let solved = 0;
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i];
    if (problem?.isSolved) ++solved;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Problems Solved</h2>
      <div className="text-slate-400">
        {solved} out of {total}
      </div>
      <div className="flex flex-wrap gap-4 mx-auto mt-4">
        {Array.from({ length: solved }, (_, i) => (
          <div key={i} className="h-6 w-6 rounded bg-green-600"></div>
        ))}
        {Array.from({ length: total - solved }, (_, i) => (
          <div key={i} className="h-6 w-6 rounded bg-slate-500"></div>
        ))}
      </div>
    </div>
  );
};

const tabs = [
  { name: "Submissions", href: "#", current: true },
  { name: "Bookmarks", href: "#", current: false },
];

const ProblemsSubmissions = () => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={classNames(
                tab.current
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "px-3 py-2 font-medium text-sm rounded-md"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const ProfilePageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data: user, isLoading } = trpc.user.getById.useQuery({ id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div> User does&apos;t exists!</div>;
  }

  return (
    <div>
      <Head>
        <title>{user.name} - Fermat</title>
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 px-4 lg:p-0 gap-y-2.5">
        <div>
          <div className="bg-white pb-6 rounded-lg shadow-sm">
            <div
              className={`h-32 w-full lg:h-36 rounded-t-lg ${getGradient(
                user?.email
              )}`}
            />
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex justify-center w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  src={user?.image ?? ""}
                  alt={user?.name ?? "Some Image"}
                />
              </div>
            </div>

            <div className="flex flex-col items-center w-full mt-6 divide-y ">
              <div>
                <h1 className="text-2xl text-center font-bold text-gray-900 truncate">
                  {user.name}
                </h1>
                <div className="mt-2 text-center text-slate-400">
                  {user.bio}
                </div>
                <div className="mt-2 text-center text-sky-600">
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.githubUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <ProblemsSolvedGraph id={id} />
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <ProfileTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <ProfilePageContent id={id} />;
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
