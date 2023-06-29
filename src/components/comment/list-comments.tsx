import React, { useState } from "react";
import { CommentWithChildren } from "~/utils/trpc";
import { Button } from "../button";
import CommentForm from "./comment-form";
import dayjs from "~/lib/dayjs";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function getReplyCountText(count: number) {
  if (count === 0) {
    return "No replies";
  }

  if (count === 1) {
    return "1 reply";
  }

  return `${count} replies`;
}

function CommentActions({
  commentId,
  replyCount,
}: {
  commentId: string;
  replyCount: number;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <>
      <div className="mt-2">
        <p>{getReplyCountText(replyCount)}</p>
        <Button onClick={() => setReplying(!replying)}>Reply</Button>
      </div>

      {replying && <CommentForm parentId={commentId} />}
    </>
  );
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  return (
    <div className="p-2 bg-green-300 m-2">
      <div>
        <div className="">
          <div className="">
            <span>{comment.author.name}</span>
            <span>{dayjs(comment.createdAt).fromNow()}</span>
          </div>

          {comment.body}
        </div>
      </div>

      <CommentActions
        commentId={comment.id}
        replyCount={comment.children.length}
      />

      {comment.children && comment.children.length > 0 && (
        <ListComments comments={comment.children} />
      )}
    </div>
  );
}

export default function ListComments({
  comments,
}: {
  comments: Array<CommentWithChildren>;
}) {
  return (
    <div className="mt-4 bg-red-500">
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
}
