import { useState } from "react";
import { useLogStore } from "@/stores/logStores";
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  PlayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useCameraStore } from "@/stores/cameraStores";
import ComputationButton from "./ComputationButton";
import PreferenceButton from "./PreferenceButton";

export default function Terminal() {
  const logs = useLogStore((s) => s.logs);
  // const { controller, setController } = useCameraStore();
  const [activeTab, setActiveTab] = useState("Output");

  return (
    <div className="h-full w-full flex flex-col bg-black/30">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center px-2">
        <div className="flex text-sm">
          {["Output", "Mission"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 hover:cursor-pointer ${
                activeTab === tab
                  ? "border-b-3  border-[#00ffff]"
                  : "hover:border-b-3  border-[#00ffff]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex">
          <ComputationButton />
          {/* <button className="px-1 py-1 hover:text-[#00ffff] hover:cursor-pointer">
            <div className="relative px-1 py-1">
              <GlobeAltIcon className="h-5 w-5" />
              <div className="absolute bottom-0 right-0">
                <PlayIcon className="h-3 w-3" />
              </div>
            </div>
          </button> */}
          <PreferenceButton />
        </div>
      </div>

      {/* Tab Content */}
      <div className="font-mono p-4 h-full w-full overflow-y-auto text-white bg-black/70">
        {activeTab === "Output" && (
          <div>
            {logs.slice().reverse().map((l, i) => (
              <p
                key={i}
                className={`text-xs ${i === 0 ? "text-[#00ffff]" : ""}`}
              >
                {l}
              </p>
            ))}
            <p className="text-xs text-yellow-400">Welcome to O.R.B.I.T</p>
          </div>
        )}
        {activeTab === "Mission" && (
          <div>
            <p className="text-xs">Mission details will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
