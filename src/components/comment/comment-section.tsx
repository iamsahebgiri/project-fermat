import { useRouter } from "next/router";
import CommentForm from "./comment-form";
import { trpc } from "~/utils/trpc";
import ListComments from "./list-comments";
import formComments from "~/utils/comments";

function CommentSection() {
  const router = useRouter();

  const permalink = router.query.permalink as string;
  const { data: comments, isLoading: isCommentLoading } =
    trpc.comment.getAll.useQuery({ permalink });

  if (isCommentLoading) {
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
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!comments) {
    return <div>Comment not found</div>;
  }

  return (
    <div>
      <CommentForm />
      {comments && <ListComments comments={formComments(comments || [])} />}
    </div>
  );
}

export default CommentSection;
