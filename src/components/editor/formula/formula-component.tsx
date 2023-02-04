import React, { useEffect, useState } from "react";
import katex from "katex";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Icon } from "@iconify/react";
import delete20Regular from "@iconify/icons-fluent/delete-20-regular";
import { classNames } from "~/utils/classnames";

export const FormulaComponent = (props: NodeViewProps) => {
  const [rawFormula, setRawFormula] = useState(props.node.attrs.content);
  const [renderedFormula, setRendedredFormula] = useState("");

  useEffect(() => {
    if (!rawFormula) {
      setRendedredFormula("");
      return;
    }
    const formulaToHTML = katex.renderToString(rawFormula, {
      throwOnError: false,
      strict: false,
      displayMode: true,
      maxSize: 300,
    });
    console.log(formulaToHTML);

    setRendedredFormula(formulaToHTML);
    // return () => props.deleteNode();
  }, [rawFormula]);

  const onChangeRawFormula = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === rawFormula) return;
    setRawFormula(e.target.value);
    props.updateAttributes({
      content: e.target.value,
    });
  };

  return (
    <NodeViewWrapper>
      <div
        className={classNames(
          "rounded-lg flex flex-col bg-slate-50 p-4",
          props.selected && "border-emerald-400 bg-red-200"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="m-0">Math Input</h3>
          <button
            onClick={props.deleteNode}
            className="h-10 w-10 flex items-center justify-center hover:bg-red-200 rounded-lg"
          >
            <Icon
              icon={delete20Regular}
              className={classNames("h-5 w-5 text-slate-900 ")}
            />
          </button>
        </div>
        <textarea
          className="p-4 my-2 focus:ring-sky-500 shadow-sm focus:border-sky-500 block w-full sm:text-sm border-gray-200 rounded-md"
          rows={3}
          value={rawFormula}
          onChange={onChangeRawFormula}
        />
        <div
          className="rounded-lg flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: renderedFormula }}
        />
      </div>
    </NodeViewWrapper>
  );
};
