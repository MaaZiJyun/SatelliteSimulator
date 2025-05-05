"use client";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useStore } from "@/stores/dataStores";
import { useCameraStore } from "@/stores/cameraStores";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLogStore } from "@/stores/logStores";
import { add } from "three/tsl";
import { usePreferenceStore } from "@/stores/preferenceStores";
import { ErrorBoundary } from "react-error-boundary";
import ObservationFrame from "./ObservationFrame";

type SatelliteProps = {
  position: [number, number, number];
  //   obliquity: number;
  color: string;
  emissive?: boolean;
  radius: number;
  observationBodyRadius: number;
  observationBodyPosition: [number, number, number];
  name: string;
  wireframe?: boolean;
  id?: string;
  showAxis?: boolean;
  showOrbit?: boolean;
  showLabel?: boolean;
  showTexture?: boolean;
};

const Satellite = ({
  position: position,
  observationBodyRadius: observationBodyRadius,
  observationBodyPosition: observationBodyPosition,
  //   obliquity,
  color,
  //   texture,
  emissive = false,
  radius,
  name,
  wireframe = false,
  id,
  showAxis = false,
  showOrbit = false,
  showLabel = true,
  showTexture = false,
}: SatelliteProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scale = usePreferenceStore((state) => state.scale);
  const { setCameraPosition, setOrbitTarget } = useCameraStore();
  const { addLog } = useLogStore();

  // Scale factor
  const scaledRadius = radius * scale > 0.01 ? radius * scale : 0.01;
  const scaledObservationBodyRadius =
    observationBodyRadius * scale > 0.01 ? observationBodyRadius * scale : 0.01;

  // Convert angles to radians
  //   const obliquityRad = THREE.MathUtils.degToRad(obliquity);

  // Fallback Props
  function FallbackMaterial({
    emissive,
    color,
    wireframe,
  }: {
    emissive: boolean;
    color: string;
    wireframe: boolean;
  }) {
    const baseProps = {
      color: color || "#ffffff",
      wireframe,
      toneMapped: false,
    };
    return (
      <meshStandardMaterial
        {...baseProps}
        emissive={color || "#ffffff"}
        emissiveIntensity={3}
      />
    );
  }

  return (
    <group
      ref={groupRef}
      position={new THREE.Vector3(...position).multiplyScalar(scale)}
    >
      <mesh
        ref={meshRef}
        // rotation={[obliquityRad, initialRotationAngleRad, 0]}
        receiveShadow={!emissive}
      >
        <sphereGeometry args={[scaledRadius, 64, 64]} />
        {/* <meshStandardMaterial {...materialProps} /> */}
        <FallbackMaterial
          emissive={emissive}
          color={color}
          wireframe={wireframe}
        />
      </mesh>
      <ObservationFrame
        satellitePosition={position}
        observationBodyPosition={observationBodyPosition}
        altitude={600} // 距离卫星 500m
        gsd={1} // 1 米每像素
        h={512}
        w={512}
      />

      {showLabel && (
        <Html>
          <div
            className={`text-sm bg-black/40 px-1 py-0.5 rounded`}
            style={{ color: color }}
          >
            {(name || "Unnamed").toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Satellite;
