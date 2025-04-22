"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraStore } from "@/stores/cameraStores";

export default function SmoothCameraPosition() {
  const { cameraPosition, orbitTarget, setFinalPosition } = useCameraStore(); // 状态中获取位置
  const { camera } = useThree(); // Three.js 的相机实例

  const targetPosition = useRef(new THREE.Vector3()); // 目标相机位置
  const [isMoving, setIsMoving] = useState(false); // 是否正在动画

  // 当 cameraPosition 更新时，触发平滑动画
  useEffect(() => {
    targetPosition.current.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    ); // 更新目标位置
    setIsMoving(true); // 启动动画
  }, [cameraPosition]);

  useFrame(() => {
    if (isMoving) {
      const distance = camera.position.distanceTo(targetPosition.current);

      // 相机平滑移动
      camera.position.lerp(targetPosition.current, 0.03);

      // 持续 lookAt 指定目标
      if (orbitTarget) {
        const lookAtTarget = Array.isArray(orbitTarget)
          ? new THREE.Vector3(...orbitTarget)
          : orbitTarget instanceof THREE.Vector3
          ? orbitTarget
          : new THREE.Vector3();

        camera.lookAt(lookAtTarget);
      }

      camera.updateMatrixWorld();

      // 判断是否到达目标位置
      if (distance < 0.1) {
        camera.position.copy(targetPosition.current); // 最后一帧对齐
        setFinalPosition(targetPosition.current); // 更新最终位置
        setIsMoving(false);
        console.log("Camera has reached the target position.");
      }
    }
  });

  return null;
}
