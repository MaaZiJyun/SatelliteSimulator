import { Vector3 } from "@react-three/fiber";
import { create } from "zustand";

type PreferenceState = {
  showOrbits: boolean
  showTexture: boolean
  showWareframe: boolean
  darkmode: boolean
  speed: number
  setShowOrbits: () => void
  setShowTexture: () => void
  setShowWareframe: () => void
  setDarkmode: (enable?: boolean) => void
  setSpeed: (val: number) => void
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  showOrbits: false,
  showTexture: true,
  showWareframe: false,
  darkmode: false,
  speed: 1,
  setShowOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  setShowTexture: () => set((state) => ({ showTexture: !state.showTexture })),
  setShowWareframe: () => set((state) => ({ showWareframe: !state.showWareframe })),
  setDarkmode: () => set((state) => ({ darkmode: !state.darkmode })),
  setSpeed: (val) => set({ speed: val }),
}))

