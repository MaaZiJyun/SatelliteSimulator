"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { useCameraStore } from "@/stores/cameraStores";
import { useStore } from "@/stores/dataStores";
import * as THREE from "three";
import CelestialBody from "./CelestialBody";
import { usePreferenceStore } from "@/stores/preferenceStores";
import Orbit from "./Orbit";
import SmoothCameraPosition from "./SmoothCameraMover";
import CameraTracker from "./CameraTracker";

function Scene() {
  const { data } = useStore();
  const { finalPosition, orbitTarget } = useCameraStore();
  const scale = usePreferenceStore((state) => state.scale);

  const { showLabels, showOrbits, showTexture, showWareframe, showaxis } =
    usePreferenceStore();

  const allBodies = [
    ...data.stars,
    ...data.planets,
    ...data.naturalSatellites,
    ...data.artificialSatellites,
  ];

  return (
    <Canvas shadows>
      <ambientLight intensity={0} />
      <CameraTracker />
      <SmoothCameraPosition />
      <PerspectiveCamera
        makeDefault
        position={finalPosition}
        fov={30}
        near={0.1}
        far={10000000}
      />
      <OrbitControls
        target={orbitTarget}
        enablePan
        enableZoom
        enableRotate
        minDistance={10 * scale}
        maxDistance={10000000}
      />
      <Stars
        radius={1000000}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={6} // 尝试更高的强度
        distance={0} // 无限范围
        decay={0} // 不衰减
        color="#ffffff"
        castShadow
      />

      {/* <directionalLight
        position={[50, 0, 0]}
        intensity={10}
        color={"#ffffcc"}
        castShadow
      /> */}

      {allBodies.map((body) => (
        <CelestialBody
          key={body.id}
          id={body.id}
          position={body.initialState.position}
          velocity={body.initialState.velocity}
          obliquity={body.rotation.obliquity}
          rotationAngle={body.rotation.initialMeridianAngle}
          rotationPeriod={body.rotation.rotationPeriod}
          color={body.visual.color}
          texture={body.visual.texture ? body.visual.texture : undefined}
          emissive={body.visual.emissive}
          radius={body.radius}
          name={body.name}
          wireframe={showWareframe}
          showAxis={showaxis}
          showLabel={showLabels}
          showOrbit={showOrbits}
          showTexture={showTexture}
        />
      ))}
      {showOrbits &&
        allBodies.map((body) => {
          const parent = allBodies.find((b) => b.id === body.primary);
          if (parent && body.emiMajorAxis && body.emiMajorAxis != 0) {
            return (
              <Orbit
                key={body.id}
                center={parent.initialState.position}
                position={body.initialState.position}
                semiMajorAxis={body.emiMajorAxis}
                eccentricity={body.eccentricity ?? 0}
                inclination={body.rotation.inclination}
                color={body.visual.color}
              />
            );
          }
        })}
    </Canvas>
  );
}

export default Scene;
