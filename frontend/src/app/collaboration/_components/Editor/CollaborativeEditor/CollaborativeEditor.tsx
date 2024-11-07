"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import cloudsMidnight from "monaco-themes/themes/Clouds Midnight.json";
import Editor, { Monaco } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";
import InjectableCursorStyles from "./InjectableCursorStyles";
import { UserProfile } from "@/types/User";
import { getRandomColor } from "@/lib/cursorColors";
import { useSessionContext } from "@/contexts/SessionContext";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface CollaborativeEditorProps {
  sessionId: string;
  currentUser: UserProfile;
  socketUrl?: string;
  language?: string;
  themeName?: string;
}

export default function CollaborativeEditor({
  sessionId,
  currentUser,
  socketUrl = "ws://localhost:4001",
  language = "python",
  themeName = "clouds-midnight",
}: CollaborativeEditorProps) {
  const { codeReview, submitCode, submitting } = useSessionContext();
  const { setCurrentClientCode } = codeReview;
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const [provider, setProvider] = useState<WebsocketProvider>();

  const colorRef = useRef<string>(getRandomColor());

  useEffect(() => {
    if (!editorRef) return;

    const yDoc = new Y.Doc();
    const yTextInstance = yDoc.getText("monaco");
    const yProvider = new WebsocketProvider(
      `${socketUrl}/yjs?sessionId=${sessionId}&userId=${currentUser.id}`,
      `c_${sessionId}`,
      yDoc
    );
    setProvider(yProvider);

    const binding = new MonacoBinding(
      yTextInstance,
      editorRef.getModel() as editor.ITextModel,
      new Set([editorRef]),
      yProvider.awareness
    );

    // Observe changes to the Y.Text document
    const updateCode = () => {
      setCurrentClientCode(yTextInstance.toString());
    };

    yTextInstance.observe(updateCode);
    updateCode();

    return () => {
      yTextInstance.unobserve(updateCode);
      yDoc.destroy();
      binding.destroy();
    };
  }, [sessionId, currentUser, socketUrl, editorRef, setCurrentClientCode]);

  const handleEditorOnMount = useCallback(
    (e: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // @ts-expect-error: we ignore since monaco-theme library is outdated with the latest
      // monaco expected theme types but it still works
      monaco.editor.defineTheme(themeName, cloudsMidnight);
      monaco.editor.setTheme(themeName);
      setEditorRef(e);
    },
    [themeName]
  );

  return (
    <div className="relative w-full h-full min-h-24 min-w-24">
      <Button
        className="absolute bottom-10 right-8 z-10"
        onClick={submitCode}
        disabled={submitting}
      >
        {submitting ? (
          <span className="flex flex-row items-center gap-2">
            <LoadingSpinner />
            <p>Submitting</p>
          </span>
        ) : (
          "Submit"
        )}
      </Button>
      {provider && (
        <InjectableCursorStyles
          yProvider={provider}
          cursorName={currentUser.username}
          cursorColor={colorRef.current}
        />
      )}
      <Editor
        onMount={handleEditorOnMount}
        className="w-full h-full"
        theme={themeName}
        language={language}
        options={{
          tabSize: 4,
          padding: { top: 20 },
        }}
      />
    </div>
  );
}
