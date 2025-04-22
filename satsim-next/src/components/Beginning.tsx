import { useState } from "react";
import { useStore } from "@/stores/dataStores";

export default function Beginning() {
  const [error, setError] = useState<string | null>(null);
  const setData = useStore((s) => s.setData);

  const handleFile = async (file: File) => {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      setData(json); // 存入全局状态
      setError(null); // 清除错误
    } catch (err) {
      setError("Invalid JSON file");
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {/* Big Title */}
      <h1 className="text-5xl font-bold mb-8">Welcome to O.R.B.I.T</h1>

      {/* Drag-and-Drop Container */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-96 h-48 border-4 border-dashed border-[#00ffff] rounded-lg flex items-center justify-center text-center p-4 hover:bg-[#00ffff] transition"
      >
        {error && <div className="text-red-500">{error}</div>}
        {!error && (
          <div className="text-gray-500">
            Drag and drop a JSON file here to get started.
          </div>
        )}
      </div>

      {/* File Input */}
      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-[#00ffff] text-black rounded-lg hover:bg-[#00cccc] transition"
        >
          Select a File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
}
