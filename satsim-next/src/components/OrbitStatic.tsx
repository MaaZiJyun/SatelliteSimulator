"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePreferenceStore } from "@/stores/preferenceStores";

type OrbitProps = {
  centerPosition: [number, number, number]; // 中心天体（焦点）F
  semiMajorAxis: number; // a 半长轴
  eccentricity?: number; // e 离心率
  inclination?: number; // i 倾角（单位°）
  ascendingNode?: number; // Ω 升交点经度（单位°）
  argOfPeriapsis?: number; // ω 近地点辐角（单位°）
  segments?: number;
  color?: string;
};

export default function OrbitStatic({
  centerPosition,
  semiMajorAxis,
  eccentricity = 0,
  inclination = 0,
  ascendingNode = 0,
  argOfPeriapsis = 0,
  segments = 256,
  color = "gray",
}: OrbitProps) {
  const scale = usePreferenceStore((state) => state.scale);
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    if (eccentricity >= 1) {
      console.warn(
        "Only elliptical orbits are supported. Eccentricity must be < 1."
      );
      return [];
    }

    const a = semiMajorAxis;
    const e = eccentricity;
    const result: THREE.Vector3[] = [];

    const iRad = THREE.MathUtils.degToRad(inclination);
    const ΩRad = THREE.MathUtils.degToRad(ascendingNode);
    const ωRad = THREE.MathUtils.degToRad(argOfPeriapsis);

    // Rotation quaternions
    const qΩ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      ΩRad
    ); // z-axis
    const qi = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      iRad
    ); // x-axis
    const qω = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      ωRad
    ); // z-axis

    const totalQuat = qΩ.multiply(qi).multiply(qω); // 顺序重要！

    for (let j = 0; j <= segments; j++) {
      const θ = (j / segments) * Math.PI * 2;
      const r = (a * (1 - e ** 2)) / (1 + e * Math.cos(θ));

      if (!isFinite(r)) {
        console.error("Invalid radius r at θ =", θ, "with e =", e);
        continue;
      }

      const xOrb = r * Math.cos(θ);
      const yOrb = r * Math.sin(θ);

      const pos = new THREE.Vector3(xOrb, yOrb, 0).applyQuaternion(totalQuat);
      //   pos.add(new THREE.Vector3(...centerPosition)).multiplyScalar(scale);

      const finalPos = new THREE.Vector3(pos.x, pos.z, pos.y);

      finalPos.add(new THREE.Vector3(...centerPosition)).multiplyScalar(scale);

      if (Number.isNaN(pos.x) || Number.isNaN(pos.y) || Number.isNaN(pos.z)) {
        console.error("NaN in orbit point at θ =", θ, {
          xOrb,
          yOrb,
          r,
          quaternion: totalQuat,
        });
        continue;
      }

      //   result.push(pos);
      result.push(finalPos);
    }

    return result;
  }, [
    centerPosition,
    semiMajorAxis,
    eccentricity,
    inclination,
    ascendingNode,
    argOfPeriapsis,
    segments,
    scale,
  ]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={1} dashed={false} />
    </group>
  );
}
