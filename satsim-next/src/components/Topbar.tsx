import { useCameraStore } from "@/stores/cameraStores";
import { usePreferenceStore } from "@/stores/preferenceStores";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Topbar() {
  const currentPostion = useCameraStore((state) => state.currentPosition);
  const scale = usePreferenceStore((state) => state.scale);
  return (
    <div className="px-4 py-2 flex justify-between items-center h-full space-x-4">
      <div className="flex items-center justify-center space-x-2">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="font-bold text-xl">{"O.r.b.i.t".toUpperCase()}</span>
      </div>
      <div className="flex items-center space-x-3 text-xs px-2 py-1 bg-white/10 rounded-md">
        <span>X: {(currentPostion.x / scale).toFixed(2)},</span>
        <span>Y: {(currentPostion.z / scale).toFixed(2)},</span>
        <span>Z: {(currentPostion.y / scale).toFixed(2)}</span>
        <span>(KM)</span>
      </div>
    </div>
  );
}
