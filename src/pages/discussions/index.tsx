import React from "react";
import Layout from "~/components/layout";

function DiscussionPage() {
  return <div>Work in progress</div>;
}

export default DiscussionPage;

DiscussionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
