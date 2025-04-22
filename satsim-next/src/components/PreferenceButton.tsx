import { useStore } from "@/stores/dataStores";
import { usePreferenceStore } from "@/stores/preferenceStores";
// import { usePositionStore } from "@/stores/positionStore";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function PreferenceButton() {
  const [open, setOpen] = useState(false);
  const {
    showLabels,
    showOrbits,
    showTexture,
    showWareframe,
    showaxis,
    setShowLabels,
    setShowOrbits,
    setShowTexture,
    setShowWareframe,
    setShowaxis,
  } = usePreferenceStore();

  return (
    <div className="relative">
      <button
        className="relative px-2 py-2 hover:text-[#00ffff] hover:cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-black text-white border border-gray-500 z-50 p-4 space-y-2">
          <h3 className="font-semibold mb-2 text-center">Display Preference</h3>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="labels">Show Labels</label>
            <input
              type="checkbox"
              id="labels"
              checked={showLabels}
              onChange={(e) => setShowLabels()}
              className="form-checkbox accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="orbits">Show Orbits</label>
            <input
              type="checkbox"
              id="orbits"
              checked={showOrbits}
              onChange={(e) => setShowOrbits()}
              className="form-checkbox accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="texture">Show Textures</label>
            <input
              type="checkbox"
              id="texture"
              checked={showTexture}
              onChange={(e) => setShowTexture()}
              className="form-checkbox accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="wireframe">Show Wireframes</label>
            <input
              type="checkbox"
              id="wireframe"
              checked={showWareframe}
              onChange={(e) => setShowWareframe()}
              className="form-checkbox accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="axis">Show Axises</label>
            <input
              type="checkbox"
              id="axis"
              checked={showaxis}
              onChange={(e) => setShowaxis()}
              className="form-checkbox accent-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
