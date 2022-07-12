import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import { getGradient } from "~/utils/gradient";
import { trpc } from "~/utils/trpc";

const ProblemsSolved: React.FC<{ id: string }> = ({ id }) => {
  const { data: problems, isLoading } = trpc.useQuery([
    "problem.getAllByUserId",
    { id },
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!problems) {
    return <div>No problems found!</div>;
  }

  let total = problems.length,
    solved = 0;
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i];
    if (problem?.isSolved) ++solved;
  }

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold">Problems Solved</h2>
      <div className="text-center text-slate-400">
        {solved} out of {total}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mx-auto mt-8">
        {Array.from({ length: solved }, (_, i) => (
          <div key={i} className="h-10 w-10 rounded-md bg-green-600"></div>
        ))}
        {Array.from({ length: total - solved }, (_, i) => (
          <div key={i} className="h-10 w-10 rounded-md bg-slate-600"></div>
        ))}
      </div>
    </div>
  );
};
const ProfilePageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data: user, isLoading } = trpc.useQuery(["user.getById", { id }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div> User does&apos;t exists!</div>;
  }

  return (
    <div>
      <Head>
        <title>{user.name} - Garbaze</title>
      </Head>
      <div className={`h-32 w-full lg:h-48 ${getGradient(user?.email)}`}>
        {/* <img
          className="h-32 w-full object-cover lg:h-48"
          src={profile.coverImageUrl}
          alt=""
        /> */}
      </div>
      <div>
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex justify-center  w-full">
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
            <div className="mt-2 text-center text-slate-400">{user.bio}</div>
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
          <div className="mt-6 pt-6">
            <ProblemsSolved id={id} />
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
