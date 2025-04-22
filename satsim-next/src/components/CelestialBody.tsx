"use client";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useStore } from "@/stores/dataStores";
import { useCameraStore } from "@/stores/cameraStores";
import { useRef, useState } from "react";

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
}: CelestialBodyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { setCameraPosition, setOrbitTarget } = useCameraStore();

  // Load texture with error handling
  const textureMap = texture ? useLoader(TextureLoader, texture) : null;

  // Scale factor
  const scale = 1 / 100;
  const scaledRadius = radius * scale > 1 ? radius * scale : 1;

  // Convert angles to radians
  const obliquityRad = THREE.MathUtils.degToRad(obliquity);
  const initialRotationAngleRad = THREE.MathUtils.degToRad(rotationAngle);

  // Handle tag click to teleport camera
  const handleTagClick = () => {
    if (groupRef.current) {
      const targetPosition = groupRef.current.position.clone();
      const offset = scaledRadius * 2; // Increased offset for better view
      targetPosition.z += offset;
      setCameraPosition([targetPosition.x, targetPosition.y, targetPosition.z]);
      setOrbitTarget(groupRef.current.position);
      console.log("Teleported to:", targetPosition);
    }
  };

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
        <Html>
          <div
            className="text-white text-sm bg-black/20 px-1 py-0.5 rounded cursor-pointer"
            onClick={handleTagClick}
          >
            {name || "Unnamed"}
          </div>
        </Html>
      </group>
    );
  } else {
    return (
      <group
        ref={groupRef}
        position={new THREE.Vector3(...initialPosition).multiplyScalar(scale)}
      >
        <mesh
          ref={meshRef}
          rotation={[obliquityRad, initialRotationAngleRad, 0]}
          receiveShadow
        >
          <sphereGeometry args={[scaledRadius, 64, 64]} />
          <meshStandardMaterial
            map={textureMap}
            color={textureMap ? undefined : color || "#ffffff"}
            wireframe={wireframe}
          />
        </mesh>
        <Html>
          <div
            className="text-white text-sm bg-black bg-opacity-50 px-1 py-0.5 rounded cursor-pointer"
            onClick={handleTagClick}
          >
            {name || "Unnamed"}
          </div>
        </Html>
      </group>
    );
  }
};

export default CelestialBody;
