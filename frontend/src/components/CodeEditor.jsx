import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

export default function CodeEditor({ onChange }) {
  const editorRef = useRef(null);
  const allowedClipboard = useRef("");

  const [code, setCode] = useState("");

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    editor.onKeyDown((e) => {
      if (e.ctrlKey && e.code === "KeyC") {
        const selection = editor
          .getModel()
          .getValueInRange(editor.getSelection());

        allowedClipboard.current = selection;
      }
    });

    editor.onKeyDown((e) => {
      if (e.ctrlKey && e.code === "KeyV") {
        const editor = editorRef.current;

        editor.executeEdits("", [
          {
            range: editor.getSelection(),
            text: allowedClipboard.current,
          },
        ]);
      }
    });
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (onChange) onChange(value);
  };

  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={handleCodeChange}
      onMount={handleEditorMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
      }}
    />
  );
}
