import { Vector3 } from "@react-three/fiber";
import { create } from "zustand";

type CameraStore = {
    cameraPosition: Vector3;
    orbitTarget: Vector3;
    setCameraPosition: (pos: Vector3) => void;
    setOrbitTarget: (target: Vector3) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
    
    cameraPosition: [0, 0, 20000], // 初始摄像机位置
    orbitTarget: [0, 0, 0],     // 聚焦点

    setCameraPosition: (pos) => set({ cameraPosition: pos }),
    setOrbitTarget: (target) => set({ orbitTarget: target }),

}));