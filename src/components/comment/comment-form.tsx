import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

function CommentForm({ parentId }: { parentId?: string }) {
  const router = useRouter();
  const permalink = router.query.permalink as string;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.comment.create.useMutation({
    onSuccess: () => {
      reset();
      utils.comment.getAll.invalidate({ permalink });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          mutate({ ...data, parentId });
        })}
      >
        <Textarea
          required
          placeholder="Your spicey comment"
          label="Comment"
          {...register("body")}
        />

        <input {...register("permalink")} type="hidden" value={permalink} />

        <div className="mt-2 float-right">
          <Button isLoading={isLoading} type="submit">
            {parentId ? "Post reply" : "Post comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
