import { useStore } from "@/stores/dataStores";
// import { usePositionStore } from "@/stores/positionStore";
import { PlayIcon } from "@heroicons/react/24/outline";

export default function ComputationButton() {
  const { data, setData, isDataEmpty, updatePosition } = useStore();
  //   const setPositions = usePositionStore((state) => state.setPositions); // 提取 setter

  const handleCompute = async (mode: "heliocentric" | "geocentric") => {
    if (isDataEmpty()) {
      console.log("请求体不能为空");
      return;
    }

    try {
      const body = JSON.stringify({ data: data, mode: mode });
      console.log("请求体：", body);

      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const result = await res.json();

      if (res.ok) {
        if (result?.result) {
          const positions = result.result;

          console.log("计算成功，结果如下：", positions);
          console.debug("完整结果对象：", JSON.stringify(result, null, 2));

          updatePosition(positions); // 直接用就行
        } else {
          console.warn("接口响应成功，但结果为空：", result);
        }
      } else {
        console.error("接口请求失败：", result);
      }
    } catch (err) {
      console.error(err);
    }
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
