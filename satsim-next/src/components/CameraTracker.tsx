"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useCameraStore } from "@/stores/cameraStores"; // 可选，看你有没有共享 store

export default function CameraTracker() {
  const { camera } = useThree();
  const { setCurrentPosition } = useCameraStore();

  useFrame(() => {
    setCurrentPosition(camera.position.clone());
  });

  return null;
}
