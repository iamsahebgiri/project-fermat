import Head from "next/head";
import Link from "next/link";
import { trpc } from "~/utils/trpc";
import { NextPageWithAuthAndLayout } from "~/utils/types";
import Layout from "~/components/layout";

const Home: NextPageWithAuthAndLayout = () => {
  // const problems = trpc.useQuery(["problem.getAllByUserId", { id: null }]);
  const problems = trpc.problem.getAllByUserId.useQuery({ id: null });

  if (!problems.data) {
    return (
      <div
        role="status"
        className="p-4 space-y-4 max-w-full rounded-lg border bg-white border-slate-200 divide-y divide-slate-200 shadow animate-pulse dark:divide-slate-700 md:p-6 dark:border-slate-700"
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full dark:bg-slate-700"></div>
          </div>
          <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-700 w-12"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full dark:bg-slate-700"></div>
          </div>
          <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-700 w-12"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full dark:bg-slate-700"></div>
          </div>
          <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-700 w-12"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full dark:bg-slate-700"></div>
          </div>
          <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-700 w-12"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-slate-200 rounded-full dark:bg-slate-700"></div>
          </div>
          <div className="h-2.5 bg-slate-300 rounded-full dark:bg-slate-700 w-12"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Fermat</title>
        <meta
          name="description"
          content="Computational problems intended to be solved with computer programs."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Description / Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {problems.data.map((problem) => (
                    <tr key={problem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <Link href={`/problem/${problem.id}`}>
                          <a>{problem.title}</a>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {problem.isSolved && "✔"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
