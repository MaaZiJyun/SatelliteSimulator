"use client";

import { useAnimationFrameStores } from "@/stores/animationFrameStores";
import { useStore } from "@/stores/dataStores";
import { useLogStore } from "@/stores/logStores";
import { useClockStore } from "@/stores/timeStores";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import { useState, useRef } from "react";

export default function ComputationButton() {
  const { data, isDataEmpty, update } = useStore();
  const { duration, speed, setTime } = useClockStore();
  const addLog = useLogStore((state) => state.addLog);
  const [loaded, setLoaded] = useState<number>(0);
  const [estLoaded, setEstLoaded] = useState<number>(0);
  const [isloading, setIsloading] = useState<boolean>(false);
  const { frames, setFrames, isFrameEmpty } = useAnimationFrameStores();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const estimatingRef = useRef<NodeJS.Timeout | null>(null);

  const TIME_SLOT = 1000; // 请求 t = 10000，生成 10000 帧数据
  const TIME_SLOT_DURATION = duration; // 间隔 1 秒

  const playSpeed = 1000 / speed > 1 ? 1000 / speed : 1; // 播放速度，至少 1 毫秒 (控制播放帧的频率)

  const handlePlay = async () => {
    if (!isPlaying) {
      update(frames[0]);
      setTime(0);
      setIsPlaying(true);
      startPlayback(frames);
    } else {
      stopPlayback();
      setIsPlaying(false);
    }
  };

  const startPlayback = (frameData: any[]) => {
    let currentIndex = 1;

    timerRef.current = setInterval(() => {
      if (currentIndex >= frameData.length) {
        stopPlayback();
        setIsPlaying(false);
        return;
      }
      update(frameData[currentIndex]);
      setTime(currentIndex);
      currentIndex += 1;
    }, playSpeed); // 每秒播放一帧
  };

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      {isloading ? (
        <div className="flex items-center justify-center w-full px-4 space-x-4">
          <div className="relative w-32 h-1 bg-gray-400 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#00ffff] transition-all duration-300 ease-out"
              style={{ width: `${(estLoaded / TIME_SLOT) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">
            Loading... {Math.round((estLoaded / TIME_SLOT) * 100)}%
          </p>
        </div>
      ) : (
        <>
          <button
            className="hover:text-[#00ffff] hover:cursor-pointer"
            onClick={handlePlay}
          >
            {isPlaying ? (
              <StopIcon className="h-5 w-5 text-red-400" />
            ) : (
              <PlayIcon
                className={`h-5 w-5 ${frames.length > 0 && "text-green-400"}`}
              />
            )}
          </button>
          {/* <button
            className="hover:text-[#00ffff] hover:cursor-pointer"
            onClick={() => setFrames([])}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button> */}
        </>
      )}
    </>
  );
}
