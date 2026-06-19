import { useState, useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Image, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtons = [
  { icon: Bold, title: "Bold", command: "bold" },
  { icon: Italic, title: "Italic", command: "italic" },
  { type: "divider" },
  { icon: Heading1, title: "Heading 1", command: "formatBlock", value: "h1" },
  { icon: Heading2, title: "Heading 2", command: "formatBlock", value: "h2" },
  { icon: Heading3, title: "Heading 3", command: "formatBlock", value: "h3" },
  { type: "divider" },
  { icon: List, title: "Bullet List", command: "insertUnorderedList" },
  { icon: ListOrdered, title: "Numbered List", command: "insertOrderedList" },
  { type: "divider" },
  { icon: Image, title: "Insert Image", action: "insertImage" },
  { type: "divider" },
  { icon: Undo, title: "Undo", command: "undo" },
  { icon: Redo, title: "Redo", command: "redo" },
];

export function RichTextEditor({ value, onChange, placeholder = "" }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleToolbarClick = useCallback((button: typeof toolbarButtons[0]) => {
    if (button.type === "divider") return;
    if (button.action === "insertImage") {
      handleInsertImage();
      return;
    }
    executeCommand(button.command!, button.value);
  }, [executeCommand]);

  const handleInsertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const base64 = await fileToBase64(file);
        const img = document.createElement("img");
        img.src = base64;
        img.className = "max-w-full h-auto rounded-lg my-2";
        img.alt = "Uploaded image";

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editorRef.current?.appendChild(img);
        }

        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
          editorRef.current.focus();
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
      setIsUploading(false);
    };
    input.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }, []);

  return (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-800/80 border-b border-slate-600/50">
        {toolbarButtons.map((button, index) => {
          if (button.type === "divider") {
            return <div key={index} className="w-px h-6 bg-slate-600 mx-1" />;
          }
          const Icon = button.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolbarClick(button)}
              title={button.title}
              disabled={isUploading}
              className={`p-2 rounded-md transition-colors ${
                isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-600/50 text-slate-300 hover:text-white"
              }`}
            >
              {button.action === "insertImage" && isUploading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </button>
          );
        })}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="p-4 min-h-[200px] text-white focus:outline-none prose prose-invert max-w-none"
        data-placeholder={placeholder}
        style={{
          caretColor: "white",
        }}
        suppressContentEditableWarning
      />
    </div>
  );
}
