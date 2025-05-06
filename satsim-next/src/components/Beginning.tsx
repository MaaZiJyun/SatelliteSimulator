import { useState, useCallback, useEffect, useRef } from "react";
import { useStore } from "@/stores/dataStores";
import { useLogStore } from "@/stores/logStores";
import { useClockStore } from "@/stores/timeStores";
import { useAnimationFrameStores } from "@/stores/animationFrameStores";
import { computeController } from "@/controllers/animationController";

export default function Beginning() {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<number>(0);
  const [estLoaded, setEstLoaded] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const estimatingRef = useRef<NodeJS.Timeout | null>(null);

  const { setData, update, isDataEmpty } = useStore();
  const { addLog } = useLogStore();
  const { duration } = useClockStore();
  const { setFrames } = useAnimationFrameStores();

  const TIME_SLOT = 10000;
  const TIME_SLOT_DURATION = duration;

  // 加载帧数据
  const loadFrames = async (structuredData: any) => {
    if (isDataEmpty()) {
      addLog("Request failed: No data available.");
      return;
    }

    setEstLoaded(0);
    estimatingRef.current = setInterval(() => {
      setEstLoaded((prev) =>
        prev < TIME_SLOT * 0.99 ? prev + TIME_SLOT * 0.001 : prev
      );
    }, 1);

    try {
      setIsLoading(true);

      const res = await computeController({
        structuredData: structuredData,
        time_slot: TIME_SLOT,
        slot_duration: TIME_SLOT_DURATION,
      });

      if (res.length != 0) {
        setFrames(res);
        setLoaded(res.length);
        update(res[0]); 
      }
    } catch (err) {
      console.error("请求失败：", err);
    } finally {
      setIsLoading(false);
      if (estimatingRef.current) {
        clearInterval(estimatingRef.current);
        estimatingRef.current = null;
      }
    }
  };

  // 通用文件处理
  const handleFiles = async (files: FileList | null) => {
    setIsLoading(true);
    const file = files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      addLog("Only .json files are accepted");
      setError("Please upload a JSON file (.json)");
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const structuredData = setData(json);
      addLog(`File uploaded: ${file.name}`);

      await loadFrames(structuredData);
      addLog(`File calculated: ${file.name}`);

      setError(null);
    } catch (err) {
      addLog(`Invalid JSON file: ${err}`);
      setError("Invalid JSON file");
    } finally {
      setIsLoading(false);
    }
  };

  // 拖拽
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    await handleFiles(event.dataTransfer.files);
  };

  // 文件上传 input
  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    await handleFiles(event.target.files);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black/50">
      <div className="w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-8">
          {"Welcome to SatSim".toUpperCase()}
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center w-full px-4 space-x-4">
            <div className="relative w-3/4 h-1 bg-gray-400 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#00ffff] transition-all duration-300 ease-out"
                style={{ width: `${(estLoaded / TIME_SLOT) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#00ffff]">
              Loading... {Math.round((estLoaded / TIME_SLOT) * 100)}%
            </p>
          </div>
        ) : (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-full h-45 border-4 border-dashed border-[#00ffff] rounded-lg flex items-center justify-center text-center p-4 hover:bg-[#00ffff]/10 transition"
            >
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="text-gray-400">
                  Drag and drop a JSON file here to get started.
                </div>
              )}
            </div>

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
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
