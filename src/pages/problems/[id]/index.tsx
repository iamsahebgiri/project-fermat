import { zodResolver } from "@hookform/resolvers/zod";
import timerRegular from "@iconify/icons-fluent/timer-24-regular";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/dialog";
import MonacoEditor from "~/components/monaco";
import ProblemViewer from "~/components/problems/problem-viewer";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  SubmitSolutionType,
  submitSolutionValidator,
} from "~/shared/solution-validator";
import { SITE_NAME } from "~/utils/constants";
import { trpc } from "~/utils/trpc";

const ProblemPageContent: React.FC<{ id: string }> = ({ id }) => {
  const [isTestCaseOpen, setIsTestCaseOpen] = useState<boolean>(false);
  const router = useRouter();

  const { data: problem, isLoading: isProblemLoading } =
    trpc.problem.getById.useQuery({ id });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitSolutionType>({
    resolver: zodResolver(submitSolutionValidator),
  });

  const { data: session } = useSession();

  const { mutate, isLoading } = trpc.problem.validateSolution.useMutation({
    onSuccess: () => {
      router.push(`/`);
    },
    onError(error) {
      if (typeof error.shape === "undefined") {
        toast.error("You reuqest is rate limited, try after 10 seconds.");
      } else {
        toast.error(error.message);
      }
    },
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true);
  }

  if (isProblemLoading) {
    return (
      <div className="min-h-screen flex animate-pulse">
        <div className="flex-1 bg-slate-200 mr-2 m-4 rounded-lg" />
        <div className="flex-1 flex flex-col ml-2 m-4 gap-4">
          <div className="h-2/3 bg-slate-200 rounded-lg" />
          <div className="h-1/3 bg-slate-200 rounded-lg" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!problem) {
    return <div>problem not found</div>;
  }

  return (
    <>
      <Head>
        <title>
          {problem.title} - {SITE_NAME}
        </title>
      </Head>

      {/* <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex gap-6 items-center">
              <Button variant="ghost" className="p-0 h-10 w-10">
                <Icon
                  icon={arrowLeftRegular}
                  className="h-5 w-5 text-slate-600"
                />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="p-0 h-8 w-8">
                <Icon icon={timerRegular} className="h-5 w-5 text-slate-600" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user.image ?? ""}
                  alt={session?.user.name ?? "Anonymous"}
                />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header> */}
      <div className="min-h-screen flex flex-col h-screen bg-slate-50">
        <PanelGroup
          direction="horizontal"
          className="flex-1 flex flex-row overflow-y-hidden"
        >
          <Panel
            className="flex-1 overflow-y-auto"
            minSize={30}
            defaultSize={45}
            collapsible
            collapsedSize={0}
          >
            <main>
              <ProblemViewer problem={problem} />
            </main>
          </Panel>
          <PanelResizeHandle className="w-[1px] hover:after:bg-green-500 after:h-full after:-translate-x-1/2 after:absolute after:z-40 after:w-1 bg-slate-200" />
          <Panel className="flex-1 overflow-y-auto">
            <aside className="flex h-full flex-col">
              <div className="h-12 flex items-center justify-between px-4 border-b">
                <div className="flex items-center gap-2 bg-slate-200 px-2 py-1.5 rounded">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={session?.user.image ?? ""}
                      alt={session?.user.name ?? "Anonymous"}
                    />
                    <AvatarFallback>NA</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-900">
                    {session?.user.name}
                  </span>
                </div>
                <Button variant="ghost" className="p-0 h-8 w-8">
                  <Icon
                    icon={timerRegular}
                    className="h-5 w-5 text-slate-600"
                  />
                </Button>
              </div>
              <PanelGroup direction="vertical" className="flex-1 relative">
                <Panel id="top" order={1}>
                  <div className="h-full p-4">
                    <MonacoEditor />
                  </div>
                </Panel>
                {isTestCaseOpen ? (
                  <>
                    <PanelResizeHandle className="h-[1px] bg-slate-200 after:h-1 after:hover:bg-green-500 after:-translate-y-1/2 after:absolute after:w-full" />
                    <Panel
                      id="bottom"
                      order={2}
                      defaultSize={30}
                      collapsible
                      collapsedSize={0}
                    >
                      <div>
                        <Tabs defaultValue="testcase">
                          <div className="flex items-center justify-between">
                            <TabsList className="w-full h-12 justify-start rounded-none border-b bg-transparent p-0">
                              <TabsTrigger
                                value="testcase"
                                className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-6 pb-3 pt-4 font-semibold text-slate-500 shadow-none transition-none data-[state=active]:border-b-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
                              >
                                Testcase
                              </TabsTrigger>
                              <TabsTrigger
                                value="result"
                                className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-6 pb-3 pt-4 font-semibold text-slate-500 shadow-none transition-none data-[state=active]:border-b-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
                              >
                                Result
                              </TabsTrigger>
                            </TabsList>
                          </div>
                        </Tabs>
                      </div>
                    </Panel>
                  </>
                ) : null}
                <div className="h-16 flex items-center justify-between px-4 border-t">
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue
                          placeholder="Language"
                          defaultValue="cpp"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="py">Python</SelectItem>
                        <SelectItem value="js">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => setIsTestCaseOpen(!isTestCaseOpen)}
                    >
                      Testcase
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Run</Button>
                    <Button>Submit</Button>
                  </div>
                </div>
              </PanelGroup>
            </aside>
          </Panel>
        </PanelGroup>
      </div>

      <ConfirmDeleteDialog
        id={id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false);
        }}
      />
    </>
  );
};

export default function ProblemPage() {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <ProblemPageContent id={id} />;
}

function ConfirmDeleteDialog({
  id,
  isOpen,
  onClose,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const deletePostMutation = trpc.problem.delete.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete problem</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this problem?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="destructive"
          disabled={deletePostMutation.isLoading}
          // loadingChildren="Deleting problem"
          onClick={() => {
            deletePostMutation.mutate(
              { id },
              {
                onSuccess: () => router.push("/"),
              }
            );
          }}
        >
          Delete problem
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Bookmark = ({ problemId }: { problemId: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data, isLoading } = trpc.problem.isBookmarked.useQuery(
    {
      problemId,
    },
    {
      onSuccess: (data) => {
        setIsBookmarked(data.isBookmarked);
      },
    }
  );

  // FIX: On successive click on the button it errors out
  // Invalid `prisma.bookmark.delete()` invocation:
  const { mutate: removeBookmark, isLoading: isLoadingRemoveBookmark } =
    trpc.problem.removeFromBookmark.useMutation({
      onSuccess: () => {
        toast.success("Bookmark removed successfully!");
        setIsBookmarked(false);
      },
      onError(error) {
        toast.error(error.message);
        setIsBookmarked(true);
      },
    });

  const { mutate: addToBookmark, isLoading: isLoadingAddToBookmark } =
    trpc.problem.addToBookmark.useMutation({
      onSuccess: () => {
        toast.success("Bookmark added successfully!");
        setIsBookmarked(true);
      },
      onError(error) {
        toast.error(error.message);
        setIsBookmarked(false);
      },
    });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>
    );
  }
  if (!data)
    return <div className="text-red-600">Error in fetching bookmark</div>;

  return (
    <Button
      variant="secondary"
      onClick={() => {
        if (isBookmarked) {
          console.log("BookmarkId", data.id);
          removeBookmark({
            bookmarkId: data.id ?? "",
          });
        } else {
          addToBookmark({
            problemId,
          });
        }
      }}
      disabled={isBookmarked ? isLoadingRemoveBookmark : isLoadingAddToBookmark}
    >
      {isBookmarked ? "Remove from bookmark" : "Add to bookmark"}
    </Button>
  );
};

// ProblemPage.getLayout = function getLayout(page: React.ReactElement) {
//   return <Layout>{page}</Layout>;
// };
ProblemPage.auth = true;
