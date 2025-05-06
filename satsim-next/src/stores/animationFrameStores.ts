// stores/useClockStore.ts
import { create } from "zustand";

interface AnimationFrameState {
    frames: any[];            // 时间
    currentFrame: number;
    setFrames: (fs: any[]) => void;
    setCurrentFrame: (i: number) => void;
    amountOfFrame: () => number;
    isFrameEmpty: () => boolean;
    reset: () => void;       // 重置时间
}

export const useAnimationFrameStores = create<AnimationFrameState>((set, get) => ({
    frames: [],
    currentFrame: 0,
    setFrames: (fs) => set({ frames: fs }),
    setCurrentFrame: (i) => set({ currentFrame: i }),
    amountOfFrame: () => { return frames.length },
    isFrameEmpty: () => {
        const { frames } = get();
        return (frames.length === 0);
    },
    reset: () => set({ frames: [] }),
}));
