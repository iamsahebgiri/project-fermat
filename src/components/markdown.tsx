import React, { useEffect } from "react";
import katex from "katex";

export default function Markdown(props: any) {
  useEffect(() => {
    document.querySelectorAll("katex").forEach((el) => {
      const content = el.getAttribute("content") ?? "";
      katex.render(content, el as HTMLElement, {
        throwOnError: false,
        strict: false,
        displayMode: true,
        maxSize: 300,
      });
    });

    document.querySelectorAll("span[data-inline-katex]").forEach((el) => {
      if (el.childElementCount > 0) {
        return false;
      }

      const element = el as HTMLElement;
      katex.render(element.innerText, element, {
        throwOnError: false,
        strict: false,
        displayMode: false,
        maxSize: 300,
      });
    });
  }, [props.children]);

  return <div dangerouslySetInnerHTML={{ __html: props.children }} />;
}
