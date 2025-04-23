import { useState } from "react";
import { useStore } from "@/stores/dataStores";
import { useLogStore } from "@/stores/logStores";

export default function Beginning() {
  const [error, setError] = useState<string | null>(null);
  const setData = useStore((s) => s.setData);
  const { addLog } = useLogStore();

  const handleFile = async (file: File) => {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      setData(json); // 存入全局状态
      addLog(`File loaded: ${file.name}`);
      setError(null); // 清除错误
    } catch (err) {
      console.error("Invalid JSON file", err);
      addLog(`Invalid JSON file: ${err}`);
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
    <div className="h-full w-full flex flex-col items-center justify-center bg-black/50">
      <div className="w-1/2 flex flex-col items-center justify-center">
        {/* Big Title */}
        <h1 className="text-5xl font-bold mb-8">{("Welcome to SatSim").toUpperCase()}</h1>

        {/* Drag-and-Drop Container */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-45 border-4 border-dashed border-[#00ffff] rounded-lg flex items-center justify-center text-center p-4 hover:bg-[#00ffff]/10 transition"
        >
          {error && <div className="text-red-500">{error}</div>}
          {!error && (
            <div className="text-gray-400">
              Drag and drop a JSON file here to get started.
            </div>
          )}
        </div>
        {/* File Input */}
        <div className="w-full mt-4">
          <label
            htmlFor="file-upload"
            className="flex w-full items-center justify-center cursor-pointer px-4 py-2 bg-[#00ffff] text-black rounded-lg hover:bg-[#00cccc] transition"
          >
            Select a File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="flex w-full hidden"
            onChange={handleFileInputChange}
          />
        </div>
      </div>
    </div>
  );
}
