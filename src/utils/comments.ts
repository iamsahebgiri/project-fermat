import { Comment, CommentWithChildren } from "~/utils/trpc";

function formatComments(comments: Array<Comment>) {
  const roots: Array<CommentWithChildren> = [];
  const commentMap: any = {};

  comments.forEach((comment) => {
    const { id, parentId } = comment;
    commentMap[id] = { ...comment, children: [] };
    if (parentId !== null) {
      if (!commentMap[parentId]) {
        commentMap[parentId] = { children: [] };
      }
      commentMap[parentId].children.push(commentMap[id]);
    } else {
      roots.push(commentMap[id]);
    }
  });

  // console.log({ roots, commentMap });

  return roots;
}

export default formatComments;
