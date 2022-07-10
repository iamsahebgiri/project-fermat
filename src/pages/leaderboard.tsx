import React from 'react'
import Layout from '~/components/layout';

export default function LeaderboardPage() {
  return (
    <div>Leaderboard: WIP</div>
  )
}

LeaderboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
