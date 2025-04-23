// stores/useClockStore.ts
import { create } from "zustand";

interface ClockState {
  time: number;            // 加速时间
  setTime: (t: number) => void;
  speed: number;       // 倍速
  setSpeed: (v: number) => void;
  reset: () => void;       // 重置时间
}

export const useClockStore = create<ClockState>((set) => ({
  time: 0,
  speed: 10,
  setTime: (t) => set({ time: t }),
  setSpeed: (v) => set({ speed: v }),
  reset: () => set({ time: 0 }),
}));
