import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { create } from "zustand";

type ControlsStore = {
  controls: OrbitControls | null;
  setControls: (controls: OrbitControls | null) => void;
  setTarget: (target: [number, number, number]) => void;
};

export const useControlsStore = create<ControlsStore>((set) => ({
  controls: null,
  setControls: (controls) => set({ controls }),
  setTarget: (target) =>
    set((state) => {
      if (state.controls) {
        state.controls.target.set(...target);
        state.controls.update();
      }
      return state;
    }),
}));