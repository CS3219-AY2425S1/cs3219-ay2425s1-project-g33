"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            ["link", "image", "clean"],
          ],
        },
      });

      quillInstance.current.root.innerHTML =
        value || "<p>Type your description here</p>";

      // Handle change events
      quillInstance.current.on("text-change", () => {
        const html = quillInstance.current?.root.innerHTML;
        onChange(html || "");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  // Update value when props change
  useEffect(() => {
    if (
      quillInstance.current &&
      value !== quillInstance.current.root.innerHTML
    ) {
      quillInstance.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={quillRef}
      style={{
        height: "300px",
        border: "1px solid #ccc",
        outline: "none",
      }}
    />
  );
};

export default QuillEditor;
