"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { usePreferenceStore } from "@/stores/preferenceStores";

type ObservationFrameProps = {
  satellitePosition: [number, number, number];
  observationBodyPosition: [number, number, number];
  altitude: number; // in meters
  gsd: number; // ground sampling distance (meters/pixel)
  h: number; // image height (pixels)
  w: number; // image width (pixels)
  color?: string;
};

const ObservationFrame = ({
  satellitePosition,
  observationBodyPosition,
  altitude,
  gsd,
  h,
  w,
  color = "yellow",
}: ObservationFrameProps) => {
  const scale = usePreferenceStore((state) => state.scale);

  const { planeCenter, width, height, quaternion } = useMemo(() => {
    const satVec = new THREE.Vector3(...satellitePosition);
    const obsVec = new THREE.Vector3(...observationBodyPosition);

    // Direction from observation body to satellite
    const dir = obsVec.clone().sub(satVec).normalize();

    // Scaled center position: obsPos + dir * altitude (scaled)
    const center = obsVec
      .clone()
      .add(dir.clone().multiplyScalar(altitude))
      .multiplyScalar(scale);

    // Compute real size and apply scaling
    const physicalWidth = gsd * w * scale;
    const physicalHeight = gsd * h * scale;

    // -------- Stable orientation calculation --------
    const z = dir.clone().normalize(); // forward (from satellite to observation body)

    // Align h edge with the y-axis, so up direction is y-axis
    const up = new THREE.Vector3(0, 1, 0); // y-axis

    // Avoid near-parallel up vector (to prevent instability)
    if (Math.abs(z.dot(up)) > 0.99) {
      // If z and up are almost parallel, choose a different axis
      up.set(1, 0, 0); // x-axis
    }

    // Compute right and true up vectors based on the selected up vector
    const x = new THREE.Vector3().crossVectors(up, z).normalize(); // right
    const y = new THREE.Vector3().crossVectors(z, x).normalize(); // corrected up (align with y-axis)

    // Rotation matrix to quaternion to align h direction with y-axis
    const rotMatrix = new THREE.Matrix4().makeBasis(x, y, z);
    const quat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix);

    return {
      planeCenter: center,
      width: physicalWidth,
      height: physicalHeight,
      quaternion: quat,
    };
  }, [satellitePosition, observationBodyPosition, altitude, gsd, h, w, scale]);

  return (
    <group position={planeCenter} quaternion={quaternion}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* <Html>
        <div className="text-black text-xs bg-white/50 px-1 py-0.5 rounded">
          {(width / scale).toFixed(1)}m × {(height / scale).toFixed(1)}m
        </div>
      </Html> */}
    </group>
  );
};

export default ObservationFrame;
