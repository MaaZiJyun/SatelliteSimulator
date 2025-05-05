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
import ObserverPoint from "./ObservationPoint";

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
  const observerRef = useRef<THREE.Mesh>(null); // Add a ref for the observer point
  const scale = usePreferenceStore((state) => state.scale);
  const { setCameraPosition, setOrbitTarget } = useCameraStore();
  const { addLog } = useLogStore();

  // Scale factor
  const scaledRadius = radius * scale > 0.01 ? radius * scale : 0.01;

  // Convert angles to radians
  const obliquityRad = THREE.MathUtils.degToRad(obliquity);
  const initialRotationAngleRad = THREE.MathUtils.degToRad(rotationAngle);

  // 观测点的初始经纬度
  const observationPoint = {
    id: "observer1",
    name: "Observer1",
    lat: 39.9, // 纬度
    lon: 116.4, // 经度
    alt: 0, // 海拔
  };

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

  // Safe Props
  function SafeMaterial({
    emissive,
    color,
    wireframe,
    texture,
    showTexture,
  }: {
    emissive: boolean;
    color: string;
    wireframe: boolean;
    texture?: string;
    showTexture: boolean;
  }) {
    const textureMap =
      showTexture && texture ? useLoader(TextureLoader, texture) : null;

    const materialProps = emissive
      ? {
          map: textureMap,
          color: color || "#ffffff",
          emissive: color || "#ffffff",
          emissiveIntensity: 3,
          emissiveMap: textureMap,
          wireframe,
          toneMapped: !!textureMap,
        }
      : {
          map: textureMap,
          color: (!textureMap && color) || "#ffffff",
          wireframe,
          toneMapped: !!textureMap,
        };

    return <meshStandardMaterial {...materialProps} />;
  }

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
    return emissive ? (
      <meshStandardMaterial
        {...baseProps}
        emissive={color || "#ffffff"}
        emissiveIntensity={3}
      />
    ) : (
      <meshStandardMaterial {...baseProps} />
    );
  }

  return (
    <group
      ref={groupRef}
      position={new THREE.Vector3(...initialPosition).multiplyScalar(scale)}
    >
      {/* 显示轴线，仅non-emissive时 */}
      {!emissive && showAxis && <primitive object={axisLine} />}
      {emissive && (
        <pointLight
          intensity={3}
          distance={0}
          decay={0}
          color="#ffffff"
          castShadow
        />
      )}
      <mesh
        ref={meshRef}
        rotation={[obliquityRad, initialRotationAngleRad, 0]}
        receiveShadow={!emissive}
      >
        <sphereGeometry args={[scaledRadius, 64, 64]} />
        <ErrorBoundary
          FallbackComponent={(props) => (
            <FallbackMaterial
              emissive={emissive}
              color={color}
              wireframe={wireframe}
              {...props}
            />
          )}
        >
          <SafeMaterial
            emissive={emissive}
            color={color}
            wireframe={wireframe}
            texture={texture}
            showTexture={showTexture}
          />
        </ErrorBoundary>
        {/* 观测点作为子对象 */}
        <ObserverPoint
          lat={observationPoint.lat}
          lon={observationPoint.lon}
          radius={scaledRadius}
          showLabel={showLabel}
        />
      </mesh>
      {showLabel && (
        <Html>
          <div
            className="text-white text-sm bg-black/40 px-1 py-0.5 rounded cursor-pointer"
            onClick={handleTagClick}
          >
            {(name || "Unnamed").toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
};

export default CelestialBody;
