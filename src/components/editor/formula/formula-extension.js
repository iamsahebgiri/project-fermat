import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FormulaComponent } from "./formula-component";

export default Node.create({
  name: "formulaComponent",
  group: "block",
  selectable: false,
  addAttributes() {
    return {
      content: {
        default: "",
        renderHTML: (attributes) => ({ content: attributes.content }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "katex",
      },
      {
        tag: "dl",
        getAttrs: (element) => {
          if (typeof element == "string") return null;

          let match = element.querySelector("math");
          if (!match) return false;
          return {
            content: match.getAttribute("alttext"),
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["katex", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FormulaComponent);
  },
  addCommands() {
    return {
      addKatex:
        (attrs) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const position = selection.$cursor
            ? selection.$cursor.pos
            : selection.$to.pos;
          const node = this.type.create(attrs);
          const transaction = state.tr.insert(position, node);
          dispatch(transaction);
        },
    };
  },
});
