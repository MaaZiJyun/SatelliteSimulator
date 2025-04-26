import { useCameraStore } from "@/stores/cameraStores";
import { usePreferenceStore } from "@/stores/preferenceStores";
import { useClockStore } from "@/stores/timeStores";
import { ClockIcon, GlobeAltIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function ViewStateBar() {
  const currentPostion = useCameraStore((state) => state.currentPosition);
  const scale = usePreferenceStore((state) => state.scale);
  const { time, duration, speed } = useClockStore();
  return (
    <div className="px-4 py-2 flex justify-between items-center h-8 w-full space-x-4">
      <div className="flex items-center justify-center space-x-3">
        <MapIcon className="h-4 w-4" />
        <span className="text-sm">Inertial Frame (ECI/HCI/HCRF)</span>
      </div>
      <div className="flex items-center space-x-3 text-sm">
        <MapPinIcon className="h-4 w-4" />
        <span>X: {(currentPostion.x / scale).toFixed(2)},</span>
        <span>Y: {(currentPostion.z / scale).toFixed(2)},</span>
        <span>Z: {(currentPostion.y / scale).toFixed(2)}</span>
        <span>(KM)</span>
      </div>
      <div className="flex items-center space-x-3 text-sm">
        <ClockIcon className="h-4 w-4" />
        <span>Time Slot: {time}</span>
        <span>Speed: {speed}</span>
        <span>Duration: {duration} (s)</span>
      </div>
    </div>
  );
}
