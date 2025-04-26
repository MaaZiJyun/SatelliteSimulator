// stores/useClockStore.ts
import { create } from "zustand";

interface ClockState {
  time: number;            // 时间
  duration: number;
  speed: number;       // 倍速
  setTime: (t: number) => void;
  setSpeed: (v: number) => void;
  setDuration: (d: number) => void;
  reset: () => void;       // 重置时间
}

export const useClockStore = create<ClockState>((set) => ({
  time: 0,
  duration: 60,
  speed: 10,
  setTime: (t) => set({ time: t }),
  setSpeed: (v) => set({ speed: v }),
  setDuration: (d) => set({ duration: d }),
  reset: () => set({ time: 0 }),
}));
