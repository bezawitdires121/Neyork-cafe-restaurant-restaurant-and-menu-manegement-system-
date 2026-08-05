"use client";

import { useState, useRef, DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";

export default function FileUpload({ name, required = false }: { name: string; required?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Sync to the actual file input so the surrounding <form> still submits it normally
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        required={required && !preview}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
            dragging ? "border-nyc-gold bg-nyc-gold/5" : "border-nyc-gold/20 hover:border-nyc-gold/40"
          }`}
        >
          <UploadCloud size={28} className="text-nyc-gold-light" strokeWidth={1.5} />
          <p className="text-sm text-nyc-cream">Drag & drop an image, or click to browse</p>
          <p className="text-xs text-nyc-taupe">PNG, JPG up to 5MB</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-nyc-gold/20">
          <img src={preview} alt={fileName ?? "Preview"} className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-nyc-base/80 flex items-center justify-center text-nyc-cream hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
          <p className="absolute bottom-0 left-0 right-0 bg-nyc-base/70 backdrop-blur-sm text-nyc-cream text-xs p-2 truncate">
            {fileName}
          </p>
        </div>
      )}
    </div>
  );
}