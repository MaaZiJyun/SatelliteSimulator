import { computeController } from "@/controllers/animationController";
import { useAnimationFrameStores } from "@/stores/animationFrameStores";
import { useStore } from "@/stores/dataStores";
import { useClockStore } from "@/stores/timeStores";
import {
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useRef } from "react";

export default function AnimationPanel() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const estimatingRef = useRef<NodeJS.Timeout | null>(null);

  const { data, update } = useStore();
  const { speed, duration, setTime } = useClockStore();
  const { frames, setFrames } = useAnimationFrameStores();

  const TIME_SLOT = 10000;
  const refreshFrequency = 1000 / speed > 1 ? 1000 / speed : 1;

  const reload = async () => {
    reset();

    try {
      setIsLoading(true);

      const res = await computeController({
        structuredData: data,
        time_slot: TIME_SLOT,
        slot_duration: duration,
      });

      if (res.length != 0) {
        setFrames(res);
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

  // 开始或恢复
  const start = () => {
    if (!isPlaying && frames.length > 0) {
      setIsPlaying(true);
      if (currentIndex === 0) {
        update(frames[0]);
        setTime(0);
      }
      startPlayback(currentIndex);
    }
  };

  const startPlayback = (startIdx: number) => {
    let idx = startIdx;
    timerRef.current = setInterval(() => {
      idx += 1;
      if (idx >= frames.length) {
        stopPlayback();
        setIsPlaying(false);
        setCurrentIndex(0);
        setProgress(1);
        return;
      }
      update(frames[idx]);
      setTime(idx);
      setCurrentIndex(idx);
      setProgress(idx / (frames.length - 1));
    }, refreshFrequency);
  };

  const pause = () => {
    setIsPlaying(false);
    stopPlayback();
  };

  const reset = () => {
    stopPlayback();
    setIsPlaying(false);
    setCurrentIndex(0);
    setProgress(0);
    if (frames.length > 0) {
      update(frames[0]);
      setTime(0);
    }
  };

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => stopPlayback();
  }, []);

  React.useEffect(() => {
    if (frames.length > 0) {
      setProgress(currentIndex / (frames.length - 1));
    } else {
      setProgress(0);
    }
  }, [currentIndex, frames.length]);

  return (
    <div className="w-full px-12 flex flex-col items-center gap-5">
      {/* 控制按钮 */}
      <div className="flex gap-6">
        <button
          className={`rounded-full bg-blue-500 shadow-lg p-2 transition-all duration-200
            hover:scale-110 hover:shadow-blue-400/60 hover:cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          onClick={reload}
          disabled={isLoading}
        >
          <ArrowPathIcon className="h-5 w-5 text-white drop-shadow" />
        </button>
        <button
          className={`rounded-full bg-green-600 shadow-lg p-2 transition-all duration-200
            hover:scale-110 hover:shadow-green-400/60 hover:cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          onClick={start}
          disabled={isPlaying || frames.length === 0}
        >
          <PlayIcon className="h-5 w-5 text-white drop-shadow" />
        </button>
        <button
          className={`rounded-full bg-yellow-400 shadow-lg p-2 transition-all duration-200
            hover:scale-110 hover:shadow-yellow-200/60 hover:cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          onClick={pause}
          disabled={!isPlaying}
        >
          <PauseIcon className="h-5 w-5 text-white drop-shadow" />
        </button>
        <button
          className={`rounded-full bg-red-500 shadow-lg p-2 transition-all duration-200
            hover:scale-110 hover:shadow-red-400/60 hover:cursor-pointer
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          onClick={reset}
          disabled={currentIndex === 0 && !isPlaying}
        >
          <StopIcon className="h-5 w-5 text-white drop-shadow" />
        </button>
      </div>
      {/* 进度条 */}
      <div className="flex w-full space-x-4 justify-between items-center">
        <div className="text-xs text-cyan-300 font-mono min-w-[2.5rem] text-center">
          {currentIndex}
        </div>
        <div className="relative w-full h-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute left-0 top-0 h-full transition-all duration-200"
            style={{
              width: `${progress * 100}%`,
              background:
                "linear-gradient(90deg, #22d3ee 0%, #67e8f9 50%, #38bdf8 100%)",
              boxShadow: progress > 0 ? "0 0 12px 2px #22d3ee88" : undefined,
              borderRadius: "9999px",
            }}
          ></div>
          {/* 百分比数字 */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-200 drop-shadow">
            {Math.round(progress * 100)}%
          </div>
        </div>
        <div className="text-xs text-cyan-300 font-mono min-w-[2.5rem] text-center">
          {frames.length > 0 ? frames.length - 1 : 0}
        </div>
      </div>
    </div>
  );
}
