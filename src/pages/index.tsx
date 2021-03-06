import Head from "next/head";
import Link from "next/link";
import { trpc } from "~/utils/trpc";
import { NextPageWithAuthAndLayout } from "~/utils/types";
import Layout from "~/components/layout";

const Home: NextPageWithAuthAndLayout = () => {
  const problems = trpc.useQuery(["problem.getAllByUserId", { id: null }]);

  if (!problems.data) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Garbaze</title>
        <meta name="description" content="Coding challenges for entry into codex coding club" />
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
                        {problem.isSolved && "???"}
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
