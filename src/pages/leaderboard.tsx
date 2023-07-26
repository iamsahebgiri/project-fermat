import Image from "next/image";
import Link from "next/link";
import React from "react";
import Layout from "~/components/layout";
import { classNames } from "~/utils/classnames";
import { trpc } from "~/utils/trpc";

export default function LeaderboardPage() {
  const {
    data: users,
    isLoading,
    isError,
  } = trpc.user.getLeaderboard.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching leaderboard</div>;
  }
  return (
    <div className="px-4 lg:p-0 ">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 truncate">
          Leaderboard
        </h2>
        <p className="text-gray-500 text-sm">
          Check your rank from the list of all users
        </p>
      </div>

      <div className="bg-white px-6 shadow rounded-lg">
        <li className="flex justify-between gap-x-6 py-5 font-semibold border-b">
          <div className="flex gap-x-4 items-center">
            <div>Rank</div>
          </div>
          <div>Points</div>
        </li>
        <ul role="list" className="divide-y divide-gray-200 ">
          {users.map((user, index) => (
            <li key={user.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex gap-x-4 items-center">
                <div>
                  <div
                    className={classNames(
                      index + 1 === 1 && "bg-amber-500/20",
                      index + 1 === 2 && "bg-slate-500/20",
                      index + 1 === 3 && "bg-purple-500/20",
                      "flex-none rounded-full p-1"
                    )}
                  >
                    <div
                      className={classNames(
                        index + 1 === 1 && "bg-amber-500 text-white",
                        index + 1 === 2 && "bg-slate-500 text-white",
                        index + 1 === 3 && "bg-purple-500 text-white",
                        ![1, 2, 3].includes(index + 1) && "text-gray-900",
                        "h-7 w-7 font-semibold flex items-center justify-center rounded-full"
                      )}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
                <Image
                  height={40}
                  width={40}
                  className="h-10 w-10 flex-none rounded-full bg-gray-50"
                  src={user.image ?? ""}
                  alt={user.name ?? "Avatar"}
                />
                <Link href={`/profile/${user.id}`}>
                  <a className="text-sm font-semibold leading-6 text-gray-900">
                    {user.name}
                  </a>
                </Link>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {user.points} XP
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

LeaderboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
