import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { useLeaveConfirm } from "~/utils/form";
import { ButtonLink } from "~/components/button-link";
import { TextField } from "~/components/textfield";
import Editor from "~/components/editor/index";

type FormData = {
  title: string;
  body: string;
};

type DiscussionFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  backTo: string;
  onSubmit: SubmitHandler<FormData>;
};

export default function DiscussionForm({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: DiscussionFormProps) {
  const { register, formState, getValues, control, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    });

  useLeaveConfirm({ formState });

  const { isSubmitSuccessful } = formState;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-full">
              <TextField
                {...register("title", { required: true })}
                label="Title"
                helperText="Name of the discussion. Keep it short and interesting."
                autoFocus
                required
              />
            </div>
          </div>

          <div>
            <Controller
              control={control}
              render={({ field }) => (
                <Editor
                  content={field.value}
                  onChange={field.onChange}
                  label="Discussion statement"
                  helperText="Markdown supported editor with latex enabled."
                />
              )}
              rules={{ required: true }}
              name="body"
              defaultValue=""
            />
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <div className="flex flex-row-reverse gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingChildren={`${defaultValues ? "Saving" : "Publishing"}`}
            >
              {defaultValues?.title ? "Save" : "Publish"}
            </Button>
            <ButtonLink href={backTo} variant="secondary">
              Cancel
            </ButtonLink>
          </div>
        </div>
      </div>
    </form>
  );
}
