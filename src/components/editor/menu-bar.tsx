import { Icon } from "@iconify/react";
import textHeader124Regular from "@iconify/icons-fluent/text-header-1-24-regular";
import textHeader224Regular from "@iconify/icons-fluent/text-header-2-24-regular";
import textHeader324Regular from "@iconify/icons-fluent/text-header-3-24-regular";
import textBulletListLtr24Regular from "@iconify/icons-fluent/text-bullet-list-ltr-24-regular";
import textNumberListLtr20Regular from "@iconify/icons-fluent/text-number-list-ltr-20-regular";
import codeText20Regular from "@iconify/icons-fluent/code-text-20-regular";
import code24Regular from "@iconify/icons-fluent/code-24-regular";
import textQuote24Regular from "@iconify/icons-fluent/text-quote-24-regular";
import textBold24Regular from "@iconify/icons-fluent/text-bold-24-regular";
import textItalic24Regular from "@iconify/icons-fluent/text-italic-24-regular";
import textUnderline24Regular from "@iconify/icons-fluent/text-underline-24-regular";
import textT24Regular from "@iconify/icons-fluent/text-t-24-regular";
import textStrikethrough24Regular from "@iconify/icons-fluent/text-strikethrough-24-regular";
import arrowUndo24Regular from "@iconify/icons-fluent/arrow-undo-24-regular";
import arrowRedo24Regular from "@iconify/icons-fluent/arrow-redo-24-regular";
import lineHorizontal120Regular from "@iconify/icons-fluent/line-horizontal-1-20-regular";
import textWrap20Regular from "@iconify/icons-fluent/text-wrap-20-regular";
import textClearFormatting20Regular from "@iconify/icons-fluent/text-clear-formatting-20-regular";
import mathFormula20Regular from "@iconify/icons-fluent/math-formula-20-regular";
import mathFormatProfessional20Regular from '@iconify/icons-fluent/math-format-professional-20-regular';
import { classNames } from "~/utils/classnames";

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center divide-x ">
        <div className="flex items-center space-x-1 pr-2 ">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center rounded-lg",
              editor.can().chain().focus().undo().run() && "hover:bg-slate-50"
            )}
            aria-label="Undo"
            title="Undo"
          >
            <Icon
              icon={arrowUndo24Regular}
              className={classNames(
                "h-5 w-5 text-slate-900",
                !editor.can().chain().focus().undo().run() && "text-slate-300"
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center rounded-lg",
              editor.can().chain().focus().redo().run() && "hover:bg-slate-50"
            )}
            aria-label="Redo"
            title="Redo"
          >
            <Icon
              icon={arrowRedo24Regular}
              className={classNames(
                "h-5 w-5 text-slate-900",
                !editor.can().chain().focus().redo().run() && "text-slate-300"
              )}
            />
          </button>
        </div>
        <div className="flex items-center space-x-1 px-2 ">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("bold") && "border shadow-sm "
            )}
            aria-label="Format Bold"
            title="Bold"
          >
            <Icon
              icon={textBold24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("italic") && "border shadow-sm "
            )}
            aria-label="Format Italics"
            title="Italics"
          >
            <Icon
              icon={textItalic24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("underline") && "border shadow-sm "
            )}
            aria-label="Format underline"
            title="Underline"
          >
            <Icon
              icon={textUnderline24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("strike") && "border shadow-sm "
            )}
            aria-label="Format Strike"
            title="Strikethrough"
          >
            <Icon
              icon={textStrikethrough24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("code") && "border shadow-sm "
            )}
            aria-label="Insert Code"
            title="Inline code"
          >
            <Icon
              icon={code24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>
        <div className="flex items-center space-x-1 px-2 ">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("heading", { level: 1 }) && "border shadow-sm "
            )}
            aria-label="Heading 1"
            title="Heading 1"
          >
            <Icon
              icon={textHeader124Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("heading", { level: 2 }) && "border shadow-sm "
            )}
            aria-label="Heading 2"
            title="Heading 2"
          >
            <Icon
              icon={textHeader224Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("heading", { level: 3 }) && "border shadow-sm "
            )}
            aria-label="Heading 3"
            title="Heading 3"
          >
            <Icon
              icon={textHeader324Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("paragraph") && "border shadow-sm "
            )}
            aria-label="Format paragraph"
            title="Paragraph"
          >
            <Icon
              icon={textT24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>
        <div className="flex items-center space-x-1 px-2 ">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("bulletList") && "border shadow-sm "
            )}
            aria-label="Format bullet list"
            title="Bullet list"
          >
            <Icon
              icon={textBulletListLtr24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("orderedList") && "border shadow-sm "
            )}
            aria-label="Format ordered list"
            title="Ordered list"
          >
            <Icon
              icon={textNumberListLtr20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>

        <div className="flex items-center space-x-1 px-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("codeBlock") && "border shadow-sm "
            )}
            aria-label="Insert code block"
            title="Code block"
          >
            <Icon
              icon={codeText20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("blockquote") && "border shadow-sm "
            )}
            aria-label="Format blockquote"
            title="Blockquote"
          >
            <Icon
              icon={textQuote24Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            )}
            aria-label="Insert horizontal line"
            title="Horizontal line"
          >
            <Icon
              icon={lineHorizontal120Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>

        <div className="flex items-center space-x-1 px-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().addKatex().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("formulaComponent") && "border shadow-sm "
            )}
            aria-label="Insert block Latex"
            title="Block latex"
          >
            <Icon
              icon={mathFormula20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleFormulaMark().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg",
              editor.isActive("formulaMark") && "border shadow-sm "
            )}
            aria-label="Insert inline latex"
            title="Inline latex"
          >
            <Icon
              icon={mathFormatProfessional20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>
        <div className="flex items-center space-x-1 pl-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            )}
            aria-label="Clear formatting"
            title="Clear formatting"
          >
            <Icon
              icon={textClearFormatting20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className={classNames(
              "h-10 w-10 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            )}
            aria-label="Break line"
            title="Break line"
          >
            <Icon
              icon={textWrap20Regular}
              className={classNames("h-5 w-5 text-slate-900")}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
