"use client";

import { useStore } from "@/stores/dataStores";
import { PlayIcon } from "@heroicons/react/24/outline";

export default function ComputationButton() {
  const { data, isDataEmpty, updatePosition } = useStore();

  const handleCompute = async (mode: "heliocentric" | "geocentric") => {
    if (isDataEmpty()) {
      console.log("请求体不能为空");
      return;
    }

    let t = 0;

    const runStep = async (count: number) => {
      if (count >= 10) {
        console.log("已完成10次请求");
        return;
      }

      try {
        const body = JSON.stringify({ data, mode, t });
        const res = await fetch("/api/compute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        const result = await res.json();

        if (res.ok) {
          if (result?.result) {
            console.log(`第 ${count + 1} 次结果 (t=${t})：`, result.result);
            updatePosition(result.result);
          } else {
            console.warn(`第 ${count + 1} 次 (t=${t})：接口响应成功，但结果为空`);
          }
        } else {
          console.error(`第 ${count + 1} 次 (t=${t})：接口请求失败`, result);
        }
      } catch (err) {
        console.error(`第 ${count + 1} 次 (t=${t}) 请求出错：`, err);
      }

      // 下一轮：延时 0.1 秒
      setTimeout(() => runStep(count + 1), 50);
      t += 100000;
    };

    runStep(0);
  };

  return (
    <button
      className="px-2 py-2 hover:text-[#00ffff] hover:cursor-pointer"
      onClick={() => handleCompute("heliocentric")}
    >
      <PlayIcon className="h-5 w-5" />
    </button>
  );
}
