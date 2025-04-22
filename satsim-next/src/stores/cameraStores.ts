import { Vector3 } from "@react-three/fiber";
import * as THREE from "three";
import { create } from "zustand";

type CameraStore = {
    cameraPosition: THREE.Vector3;
    finalPosition: THREE.Vector3;
    orbitTarget: THREE.Vector3;
    setCameraPosition: (pos: THREE.Vector3) => void;
    setFinalPosition: (pos: THREE.Vector3) => void;
    setOrbitTarget: (target: THREE.Vector3) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({

    cameraPosition: new THREE.Vector3(0, 0, 20000), // 初始摄像机位置
    finalPosition: new THREE.Vector3(0, 0, 20000), // 初始摄像机位置
    orbitTarget: new THREE.Vector3(0, 0, 0),     // 聚焦点

    setCameraPosition: (pos) => set({ cameraPosition: pos }),
    setFinalPosition: (pos) => set({ finalPosition: pos }),
    setOrbitTarget: (target) => set({ orbitTarget: target }),

}));