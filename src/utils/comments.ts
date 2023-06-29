import { Comment, CommentWithChildren } from "~/utils/trpc";

function formComments(comments: Array<Comment>) {
  const roots: Array<CommentWithChildren> = [];
  const commentMap: any = {};
  console.log(comments);

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

  console.log({ roots, commentMap });

  return roots;

  // for (let i = 0; i < comments.length; i++) {
  //   const commentId = comments[i]?.id;
  //   map.set(commentId, i);
  //   (comments[i] as CommentWithChildren).children = [];

  //   if (comments[i]?.parentId !== null) {
  //     const parentCommentIndex: number = map.get(comments[i]?.parentId);
  //     // console.log(comments[parentCommentIndex])
  //     (comments[parentCommentIndex] as CommentWithChildren).children.push(
  //       comments[i] as CommentWithChildren
  //     );
  //     continue;
  //   }

  //   roots.push(comments[i] as CommentWithChildren);
  // }

  // return roots;
}

function formatComment() {}

export default formComments;
