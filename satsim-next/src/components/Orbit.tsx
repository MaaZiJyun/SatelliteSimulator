"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { usePreferenceStore } from "@/stores/preferenceStores";

type OrbitProps = {
  center: [number, number, number]; // 焦点 F
  position: [number, number, number]; // 轨道上某点 P
  semiMajorAxis: number; // 半长轴 a
  eccentricity?: number; // 离心率 e
  segments?: number;
  inclination?: number;
  color?: string;
  // scale?: number;
};

export default function Orbit({
  center,
  position,
  semiMajorAxis,
  eccentricity = 0,
  segments = 128,
  inclination = 0,
  color = "gray",
}: // scale = 1 / 100,
OrbitProps) {
  const scale = usePreferenceStore((state) => state.scale);
  const orbitPoints = useMemo(() => {
    const a = semiMajorAxis;
    const e = eccentricity;

    // 特殊处理：正圆轨道
    if (e === 0) {
      const centerVec = new THREE.Vector3(...center);
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = a * Math.cos(theta);
        const z = a * Math.sin(theta); // 圆轨道
        const point = new THREE.Vector3(x, 0, z)
          .add(centerVec)
          .multiplyScalar(scale);
        points.push(point);
      }

      // 加入倾角（绕 X 轴旋转）
      const inclinationRad = THREE.MathUtils.degToRad(inclination);
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(inclinationRad, 0, 0)
      );
      points.forEach((p) => p.applyQuaternion(quaternion));

      return points;
    }

    // 一般椭圆轨道处理（e ≠ 0）

    const b = a * Math.sqrt(1 - e ** 2); // 半短轴

    const F = new THREE.Vector3(...center); // 焦点 F
    const P = new THREE.Vector3(...position); // 椭圆上一点 P
    const FP = new THREE.Vector3().subVectors(P, F); // 向量 FP
    const d = FP.length(); // 距离 |FP|

    // 判断合法性：|FP| 必须小于 2a
    if (d > 2 * a) {
      console.warn("position 距离 center 太远，不符合椭圆要求");
      return [];
    }

    // 焦点 F′ 计算（反方向延长）
    const Fprime = new THREE.Vector3().copy(P).add(
      FP.clone()
        .normalize()
        .multiplyScalar(-(2 * a - d))
    );

    // 椭圆中心 O = (F + F′) / 2
    const O = new THREE.Vector3().addVectors(F, Fprime).multiplyScalar(0.5);

    // 长轴方向：从 O 指向 F，作为 x 轴
    const majorAxis = new THREE.Vector3().subVectors(F, O).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const minorAxis = new THREE.Vector3()
      .crossVectors(up, majorAxis)
      .normalize();

    // 如果方向几乎和 Y 轴平行，修正 minorAxis
    if (minorAxis.length() === 0) {
      minorAxis.set(1, 0, 0);
    }

    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = a * Math.cos(theta);
      const z = b * Math.sin(theta);

      const point = new THREE.Vector3()
        .addScaledVector(majorAxis, x)
        .addScaledVector(minorAxis, z)
        .add(O); // 平移到中心 O

      points.push(point.multiplyScalar(scale));
    }

    // 倾角（绕 X 轴）
    const inclinationRad = THREE.MathUtils.degToRad(inclination);
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(inclinationRad, 0, 0)
    );
    points.forEach((p) => p.applyQuaternion(q));

    return points;
  }, [center, position, semiMajorAxis, eccentricity, segments, inclination]);

  return (
    <Line points={orbitPoints} color={color} lineWidth={1} dashed={false} />
  );
}
