/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import ProfileTabs from "~/components/profile-tabs";
import { getGradient } from "~/utils/gradient";
import { trpc } from "~/utils/trpc";
import globe20Filled from "@iconify/icons-fluent/globe-20-filled";
import star20Filled from "@iconify/icons-fluent/star-20-filled";

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
      <div className="flex flex-wrap gap-1 items-center mx-auto mt-4">
        {Array.from({ length: solved }, (_, i) => (
          <div key={i} className="h-5 w-5 rounded bg-sky-600"></div>
        ))}
        {Array.from({ length: total - solved }, (_, i) => (
          <div key={i} className="h-5 w-5 rounded bg-slate-300"></div>
        ))}
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

          <div className="flex flex-col w-full justify-center mt-6 space-y-4 px-4">
            <div className="pb-4 space-y-1 flex flex-col  items-center">
              <h1 className="text-2xl text-center font-bold text-gray-900 truncate">
                {user.name}
              </h1>
              <div className="text-center text-slate-400">{user.bio}</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500 font-bold">
                <Icon
                  icon={star20Filled}
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-amber-500"
                  aria-hidden="true"
                />
                {user.points}XP
              </div>
              <div className="flex flex-col sm:space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Icon
                    icon={globe20Filled}
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
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
            <div className="py-3">
              <h3 className="text-lg font-semibold">Badges</h3>
              <div className="grid grid-cols-3 gap-2 justify-center items-center mt-4">
                {user.badges.map((data) => (
                  <img
                    src={`/badges/${data.badge.url}`}
                    key={data.badge.id}
                    className="h-24 w-h-24"
                    alt={data.badge.name}
                    title={data.badge.description}
                  />
                ))}
                {/* {Array.from({ length: 8 }, (_, i) => (
                    <img
                      src={`/badges/level-${i + 1}.svg`}
                      key={i}
                      className="h-24 w-h-24"
                      alt={""}
                    />
                  ))} */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <ProblemsSolvedGraph id={id} />
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <ProfileTabs userId={id} />
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
