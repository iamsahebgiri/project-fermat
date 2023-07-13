import React, { useState } from "react";
import { CommentWithChildren, trpc } from "~/utils/trpc";
import { Button } from "~/components/button";
import CommentForm from "./comment-form";
import dayjs from "~/lib/dayjs";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { generateAvatar } from "~/utils/strings";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function DeleteComment({ commentId }: { commentId: string }) {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.comment.delete.useMutation({
    onSuccess: (type) => {
      utils.comment.getAll.setData({ permalink }, (oldData) => {
        if (typeof oldData === "undefined") return oldData;
        if (type == "updated") {
          const updatedComments = oldData?.map((comment) => {
            if (comment.id == commentId) {
              return {
                ...comment,
                deletedAt: new Date(),
              };
            }
            return comment;
          });

          return updatedComments;
        } else if (type === "deleted") {
          const newCommentCache = oldData.filter(
            (comment) => comment.id !== commentId
          );
          return newCommentCache;
        }
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Button
      variant="danger"
      isLoading={isLoading}
      onClick={() => mutate({ id: commentId })}
    >
      Delete
    </Button>
  );
}

function CommentActions({
  commentId,
  comment,
}: {
  commentId: string;
  comment: CommentWithChildren;
}) {
  const { data } = useSession();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="my-2 space-x-2">
        <Button
          variant="secondary"
          onClick={() => {
            setEditing(false);
            setReplying(!replying);
          }}
        >
          Reply
        </Button>
        {data?.user.id === comment.authorId && (
          <>
            {!comment.deletedAt && (
              <Button
                variant="secondary"
                onClick={() => {
                  setReplying(false);
                  setEditing(!editing);
                }}
              >
                Edit
              </Button>
            )}

            <DeleteComment commentId={comment.id} />
          </>
        )}
      </div>

      {replying && (
        <CommentForm
          handleSuccess={() => setReplying(false)}
          parentId={commentId}
        />
      )}
      {editing && (
        <CommentForm
          handleSuccess={() => setEditing(false)}
          body={comment.body}
          commentId={comment.id}
        />
      )}
    </>
  );
}

type CommentProps = {
  comment: CommentWithChildren;
  hideDivider: boolean;
};

function Comment({ comment, hideDivider }: CommentProps) {
  return (
    <>
      <li className="relative flex gap-6 pb-2 items-start gap-x-2">
        <span className="absolute left-[15px] inset-y-0 my-auto h-full w-[2px] bg-slate-200" />
        <div className="flex-none relative">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={comment.author.image ?? ""}
              alt={comment.author.name ?? "Anonymous"}
            />
            <AvatarFallback>
              {generateAvatar(comment.author.name ?? "NA")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-x-3 pt-1">
            <span className="block text-base font-semibold">
              {comment.author.name}
            </span>
            <span className="text-sm text-slate-500">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>

          {comment.deletedAt ? (
            <p className="text-slate-500 italic ">Comment deleted by user</p>
          ) : (
            <p className="whitespace-pre-wrap">{comment.body}</p>
          )}

          <div className="mt-3">
            <CommentActions commentId={comment.id} comment={comment} />
            {comment.children && comment.children.length > 0 && (
              <ListComments comments={comment.children} />
            )}
          </div>
          {/* {comment.children && comment.children.length === 0 && <hr />} */}
        </div>
        {/* <div className="relative">:</div> */}
      </li>
    </>
  );
}

export default function ListComments({
  comments,
}: {
  comments: Array<CommentWithChildren>;
}) {
  return (
    <div className="mt-4">
      <ul>
        {comments.map((comment: any, i: any) => {
          return (
            <Comment
              key={comment.id}
              hideDivider={comments.length - 1 === i}
              comment={comment}
            />
          );
        })}
      </ul>
    </div>
  );
}
