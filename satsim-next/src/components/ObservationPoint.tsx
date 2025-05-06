// components/ObserverPoint.tsx
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Html } from "@react-three/drei";

type ObserverPointProps = {
  lat: number;
  lon: number;
  radius: number;
  showLabel: boolean;
};

const ObserverPoint = ({ lat, lon, radius, showLabel }: ObserverPointProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    const textureOffset = 127; // 试试 0、-90、180 看贴图正面对齐哪个角度
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + textureOffset);

    // const phi = THREE.MathUtils.degToRad(90 - lat);
    // const theta = THREE.MathUtils.degToRad(lon);

    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [lat, lon, radius]);

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.002, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      {showLabel && (
        <Html>
          <div className="w-20 text-[#00ffff] text-sm bg-black/40 px-1 py-0.5 rounded">
            {`lat: ${lat}, lon: ${lon}`}
          </div>
        </Html>
      )}
    </group>
  );
};

export default ObserverPoint;
