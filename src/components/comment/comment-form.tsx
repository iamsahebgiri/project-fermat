import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function CommentForm({
  body,
  parentId,
  commentId,
  onClose,
}: {
  body?: string;
  commentId?: string;
  parentId?: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      body,
    },
  });

  const utils = trpc.useContext();

  const { mutate: createComment, isLoading: isCreating } =
    trpc.comment.create.useMutation({
      onSuccess: (newComment) => {
        reset();
        utils.comment.getAll.setData({ permalink }, (oldData) => {
          if (typeof oldData === "undefined") return;
          const newCommentCache = [newComment, ...oldData];
          return newCommentCache;
        });
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  const { mutate: editComment, isLoading: isUpdating } =
    trpc.comment.edit.useMutation({
      onSuccess: (updatedComment) => {
        reset();

        if (onClose) onClose();

        utils.comment.getAll.setData({ permalink }, (oldData) => {
          if (typeof oldData === "undefined") return;

          const updatedComments = oldData?.map((comment) => {
            if (comment.id == updatedComment.id) {
              return updatedComment;
            }
            return comment;
          });

          return updatedComments;
        });
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          if (body) {
            editComment({
              body: data.body,
              id: commentId as string,
            });
          } else {
            createComment({ ...data, parentId });
          }
        })}
        className="space-y-2"
      >
        <Textarea
          required
          placeholder="What are your thoughts?"
          label="Comment"
          rows={8}
          {...register("body")}
        />

        <input {...register("permalink")} type="hidden" value={permalink} />

        <div className="flex justify-end gap-2">
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button isLoading={isCreating || isUpdating} type="submit">
            {body ? "Edit" : parentId ? "Post reply" : "Post comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
