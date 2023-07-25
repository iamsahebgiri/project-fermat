import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import githubLightTheme from "~/styles/monaco/github";

export default function MonacoEditor() {
  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: Monaco) {
    // @ts-ignore
    monaco.editor.defineTheme("github", githubLightTheme);
  }

  function handleEditorDidMount(editor: any, monaco: Monaco) {}
  return (
    <Editor
      options={{
        fontFamily: "Roboto mono",
        cursorBlinking: "expand",
        cursorSmoothCaretAnimation: "on",
        wordWrap: "on",
        wordWrapColumn: 80,
        minimap: {
          enabled: false,
        },
        selectionHighlight: false,
        lineNumbersMinChars: 3,
        autoSurround: "never",
        lineNumbers: "on",
        theme: "github",
        overviewRulerLanes: 0,
        scrollbar: {
          vertical: "auto",
          horizontal: "hidden",
          handleMouseWheel: true,
        },
        "semanticHighlighting.enabled": true,
      }}
      theme="github"
      className="no-user-select"
      defaultLanguage="cpp"
      defaultValue={`class Solution {
public:
    bool increasingTriplet(vector<int>& nums) {
        int n = nums.size();
        vector<int> v(n);
        for (int i = 0; i < n; i++) {

        }
        return false;
    }
};`}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
    />
  );
}
