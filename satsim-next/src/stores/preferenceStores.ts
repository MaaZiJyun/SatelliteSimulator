import { Vector3 } from "@react-three/fiber";
import { create } from "zustand";

type PreferenceState = {
  showOrbits: boolean
  showaxis: boolean
  showLabels: boolean
  showTexture: boolean
  showWareframe: boolean
  scale: number
  speed: number
  setShowOrbits: () => void
  setShowaxis: () => void
  setShowLabels: () => void
  setShowTexture: () => void
  setShowWareframe: () => void
  setSpeed: (val: number) => void
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  showOrbits: true,
  showaxis: false,
  showLabels: true,
  showTexture: true,
  showWareframe: false,
  scale: 1 / 10000,
  speed: 1,
  setShowOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  setShowaxis: () => set((state) => ({ showaxis: !state.showaxis })),
  setShowLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  setShowTexture: () => set((state) => ({ showTexture: !state.showTexture })),
  setShowWareframe: () => set((state) => ({ showWareframe: !state.showWareframe })),
  setSpeed: (val) => set({ speed: val }),
}))

