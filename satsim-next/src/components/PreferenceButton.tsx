import { usePreferenceStore } from "@/stores/preferenceStores";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function PreferenceButton() {
  const [open, setOpen] = useState(false);
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
    <>
      <button
        className="flex items-center justify-center hover:text-[#00ffff] hover:cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {/* <Cog6ToothIcon className="h-6 w-6" /> */}
        Preference
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-black text-white border border-gray-500 p-6 rounded-2xl w-[320px] shadow-xl">
            <h3 className="font-semibold mb-4 text-center text-lg">Display Preference</h3>

            <div className="space-y-3 text-sm">
              <Toggle label="Lights On" checked={lightOn} onChange={setLightOn} />
              <Toggle label="Show Labels" checked={showLabels} onChange={setShowLabels} />
              <Toggle label="Show Orbits" checked={showOrbits} onChange={setShowOrbits} />
              <Toggle label="Show Textures" checked={showTexture} onChange={setShowTexture} />
              <Toggle label="Show Wireframes" checked={showWareframe} onChange={setShowWareframe} />
              <Toggle label="Show Axises" checked={showaxis} onChange={setShowaxis} />
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <label>{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox accent-cyan-500"
      />
    </div>
  );
}
