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
  handleSuccess,
}: {
  body?: string;
  commentId?: string;
  parentId?: string;
  handleSuccess?: () => void;
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

        if (handleSuccess) handleSuccess();

        utils.comment.getAll.setData({ permalink }, (oldData) => {
          if (typeof oldData === "undefined") return oldData;
          const newCommentCache = [...oldData, newComment];
          console.log(newComment);
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

        if (handleSuccess) handleSuccess();

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
          rows={8}
          {...register("body")}
        />

        <input {...register("permalink")} type="hidden" value={permalink} />

        <div className="flex justify-end gap-2">
          {handleSuccess && (
            <Button variant="secondary" onClick={handleSuccess}>
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
