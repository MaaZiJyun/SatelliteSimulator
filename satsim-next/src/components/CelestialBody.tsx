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

type CelestialBodyProps = {
  position: [number, number, number];
  velocity: [number, number, number];
  obliquity: number;
  rotationAngle: number;
  rotationPeriod: number;
  color: string;
  texture?: string;
  emissive?: boolean;
  radius: number;
  name: string;
  wireframe?: boolean;
  id?: string;
  showAxis?: boolean;
  showOrbit?: boolean;
  showLabel?: boolean;
  showTexture?: boolean;
};

const CelestialBody = ({
  position: initialPosition,
  velocity,
  obliquity,
  rotationAngle,
  rotationPeriod,
  color,
  texture,
  emissive = false,
  radius,
  name,
  wireframe = false,
  id,
  showAxis = false,
  showOrbit = false,
  showLabel = true,
  showTexture = false,
}: CelestialBodyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scale = usePreferenceStore((state) => state.scale);
  const { setCameraPosition, setOrbitTarget } = useCameraStore();
  const { addLog } = useLogStore();

  // Load texture with error handling
  const textureMap =
    showTexture && texture ? useLoader(TextureLoader, texture) : null;

  // Scale factor
  const scaledRadius = radius * scale > 1 ? radius * scale : 0.4;

  // Convert angles to radians
  const obliquityRad = THREE.MathUtils.degToRad(obliquity);
  const initialRotationAngleRad = THREE.MathUtils.degToRad(rotationAngle);

  // Handle tag click to teleport camera
  const handleTagClick = () => {
    if (groupRef.current) {
      const targetPosition = groupRef.current.position.clone();
      const offset = scaledRadius * 4; // Increased offset for better view
      targetPosition.z += offset;
      setCameraPosition(
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)
      );
      setOrbitTarget(groupRef.current.position.clone());
      addLog(`Teleported to ${name || "Unnamed"}`);
      addLog(
        `Position: ${targetPosition.x.toFixed(2)}, ${targetPosition.y.toFixed(
          2
        )}, ${targetPosition.z.toFixed(2)}`
      );
    }
  };

  const axisLine = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color: "white" });
    const points = [
      new THREE.Vector3(0, -scaledRadius * 2, 0),
      new THREE.Vector3(0, scaledRadius * 2, 0),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.rotation.x = obliquityRad;
    return line;
  }, [scaledRadius, obliquityRad]);

  if (emissive) {
    return (
      <group
        ref={groupRef}
        position={new THREE.Vector3(...initialPosition).multiplyScalar(scale)}
      >
        <mesh
          ref={meshRef}
          rotation={[obliquityRad, initialRotationAngleRad, 0]}
        >
          <sphereGeometry args={[scaledRadius, 64, 64]} />
          <meshStandardMaterial
            map={textureMap}
            color={color || "#ffffff"}
            emissive={color || "#ffffff"}
            emissiveIntensity={3}
            emissiveMap={textureMap}
            wireframe={wireframe}
            toneMapped={textureMap ? true : false}
          />
        </mesh>
        {showLabel && (
          <Html>
            <div
              className="text-white text-sm bg-black/30 px-1 py-0.5 rounded cursor-pointer"
              onClick={handleTagClick}
            >
              {(name || "Unnamed").toUpperCase()}
            </div>
          </Html>
        )}
      </group>
    );
  } else {
    return (
      <group
        ref={groupRef}
        position={new THREE.Vector3(...initialPosition).multiplyScalar(scale)}
      >
        {showAxis && <primitive object={axisLine} />}
        <mesh
          ref={meshRef}
          rotation={[obliquityRad, initialRotationAngleRad, 0]}
          receiveShadow
        >
          <sphereGeometry args={[scaledRadius, 64, 64]} />
          <meshStandardMaterial
            map={textureMap}
            color={(!textureMap && color) || "#ffffff"}
            wireframe={wireframe}
            toneMapped={textureMap ? true : false}
          />
        </mesh>
        {showLabel && (
          <Html>
            <div
              className="text-white text-sm bg-black/30 px-1 py-0.5 rounded cursor-pointer"
              onClick={handleTagClick}
            >
              {(name || "Unnamed").toUpperCase()}
            </div>
          </Html>
        )}
      </group>
    );
  }
};

export default CelestialBody;
