import { useState } from "react";
import { useLogStore } from "@/stores/logStores";
import ComputationButton from "./ComputationButton";
import { usePreferenceStore } from "@/stores/preferenceStores";
import {
  GlobeAltIcon,
  GlobeAsiaAustraliaIcon,
  LightBulbIcon,
  StopCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export default function Terminal() {
  const logs = useLogStore((s) => s.logs);
  const [activeTab, setActiveTab] = useState("CONSOLE");
  const {
    lightOn,
    showLabels,
    showOrbits,
    showTexture,
    showWareframe,
    showaxis,
    setLightOn,
    setShowLabels,
    setShowOrbits,
    setShowTexture,
    setShowWareframe,
    setShowaxis,
  } = usePreferenceStore();

  return (
    <div className="h-full w-full flex flex-col bg-black/30">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center px-4">
        <div className="flex text-sm">
          {["CONSOLE", "FUNCTIONS"].map((tab) => (
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
        <div className="flex space-x-3">
          <ComputationButton />
          <button
            className={`hover:text-[#00ffff] hover:cursor-pointer ${
              showWareframe && "text-[#00ffff]"
            }`}
            onClick={setShowWareframe}
          >
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <button
            className={`hover:text-[#00ffff] hover:cursor-pointer ${
              showTexture && "text-[#00ffff]"
            }`}
            onClick={setShowTexture}
          >
            <GlobeAsiaAustraliaIcon className="w-5 h-5" />
          </button>
          <button
            className={`hover:text-[#00ffff] hover:cursor-pointer ${
              showOrbits && "text-[#00ffff]"
            }`}
            onClick={setShowOrbits}
          >
            <StopCircleIcon className="w-5 h-5" />
          </button>
          <button
            className={`hover:text-[#00ffff] hover:cursor-pointer ${
              showLabels && "text-[#00ffff]"
            }`}
            onClick={setShowLabels}
          >
            <TagIcon className="w-5 h-5" />
          </button>
          <button
            className={`hover:text-[#00ffff] hover:cursor-pointer ${
              lightOn && "text-yellow-400"
            }`}
            onClick={setLightOn}
          >
            <LightBulbIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="font-mono p-4 h-full w-full overflow-y-auto text-white bg-black/70">
        {activeTab === "CONSOLE" && (
          <div>
            {logs
              .slice()
              .reverse()
              .map((l, i) => (
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
        {activeTab === "FUNCTIONS" && (
          <div>
            <p className="text-xs">Mission details will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
