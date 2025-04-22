// stores/useClockStore.ts
import { create } from "zustand";

interface ClockState {
  time: number;            // 加速时间
  setTime: (t: number) => void;
  globalVar: number;       // 倍速
  setGlobalVar: (v: number) => void;
  reset: () => void;       // 重置时间
}

export const useClockStore = create<ClockState>((set) => ({
  time: 0,
  globalVar: 1,
  setTime: (t) => set({ time: t }),
  setGlobalVar: (v) => set({ globalVar: v }),
  reset: () => set({ time: 0 }),
}));
