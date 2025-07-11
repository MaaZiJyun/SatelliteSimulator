"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { useCameraStore } from "@/stores/cameraStores";
import { useStore } from "@/stores/dataStores";
import CelestialBody from "./CelestialBody";
import { usePreferenceStore } from "@/stores/preferenceStores";
import SmoothCameraPosition from "./SmoothCameraMover";
import CameraTracker from "./CameraTracker";
import OrbitStatic from "./OrbitStatic";
import Satellite from "./Satellite";

function Scene() {
  const { data, getXZY } = useStore();
  const { finalPosition, orbitTarget } = useCameraStore();
  const scale = usePreferenceStore((state) => state.scale);

  const {
    lightOn,
    showLabels,
    showOrbits,
    showTexture,
    showWareframe,
    showaxis,
  } = usePreferenceStore();

  const allBodies = [
    ...data.stars,
    ...data.planets,
    ...data.naturalSatellites,
    ...data.artificialSatellites,
  ];

  const otherBodies = [...data.stars, ...data.naturalSatellites];

  const observingBodies = [...data.planets];

  const allSatellites = [...data.artificialSatellites];

  return (
    <Canvas shadows>
      {/* Background Light */}
      <ambientLight intensity={lightOn ? 3 : 0.1} />
      <CameraTracker />
      <SmoothCameraPosition />
      {/* The camera */}
      <PerspectiveCamera
        makeDefault
        position={finalPosition}
        fov={30}
        near={0.1}
        far={100000000}
      />
      {/* The controller */}
      <OrbitControls
        target={orbitTarget}
        enablePan
        enableZoom
        enableRotate
        minDistance={10 * scale}
        maxDistance={8000000000 * scale}
      />
      {/* Background Stars */}
      <Stars
        radius={5000000000 * scale}
        depth={50}
        count={20000}
        factor={5}
        saturation={0}
        fade
      />
      {/* The central light */}
      {/* <pointLight
        position={[0, 0, 0]}
        intensity={3} // 尝试更高的强度
        distance={0} // 无限范围
        decay={0} // 不衰减
        color="#ffffff"
        castShadow
      /> */}

      {otherBodies.map((body) => (
        <CelestialBody
          key={body.id}
          id={body.id}
          position={getXZY(body.state.position)}
          velocity={body.state.velocity}
          obliquity={body.rotation.obliquity}
          rotationAngle={body.rotation.currentAngle}
          rotationPeriod={body.rotation.period}
          color={body.visual.color}
          texture={body.visual.texture ? body.visual.texture : undefined}
          emissive={body.visual.emissive}
          radius={body.physical.radius}
          name={body.name}
          wireframe={showWareframe}
          showAxis={showaxis}
          showLabel={showLabels}
          showOrbit={showOrbits}
          showTexture={showTexture}
        />
      ))}

      {observingBodies.map((body) => (
        <CelestialBody
          key={body.id}
          id={body.id}
          position={getXZY(body.state.position)}
          velocity={body.state.velocity}
          obliquity={body.rotation.obliquity}
          rotationAngle={body.rotation.currentAngle}
          rotationPeriod={body.rotation.period}
          color={body.visual.color}
          texture={body.visual.texture ? body.visual.texture : undefined}
          emissive={body.visual.emissive}
          radius={body.physical.radius}
          name={body.name}
          wireframe={showWareframe}
          showAxis={showaxis}
          showLabel={showLabels}
          showOrbit={showOrbits}
          showTexture={showTexture}
          observationPoints={body.observationPoints}
          groundStations={body.groundStations}
        />
      ))}

      {allSatellites.map((sat) => {
        const parent = allBodies.find((b) => b.id === sat.primary);
        return (
          <Satellite
            key={sat.id}
            id={sat.id}
            name={sat.name}
            position={getXZY(sat.state.position)}
            observationBodyPosition={getXZY(
              parent?.state.position ?? [0, 0, 0]
            )}
            radius={sat.physical.radius}
            observationBodyRadius={parent?.physical.radius ?? 0}
            color={sat.visual.color}
            emissive={sat.visual.emissive}
            wireframe={showWareframe}
            showAxis={showaxis}
            showLabel={showLabels}
            showOrbit={showOrbits}
            showTexture={showTexture}
          />
        );
      })}

      {showOrbits &&
        allBodies.map((body) => {
          const parent = allBodies.find((b) => b.id === body.primary);
          if (
            parent &&
            body.orbit.semiMajorAxis &&
            body.orbit.semiMajorAxis != 0
          ) {
            return (
              <OrbitStatic
                key={body.id}
                centerPosition={getXZY(parent.state.position)}
                semiMajorAxis={body.orbit.semiMajorAxis}
                eccentricity={body.orbit.eccentricity ?? 0}
                inclination={body.orbit.inclination}
                ascendingNode={body.orbit.longitudeOfAscendingNode}
                argOfPeriapsis={body.orbit.argumentOfPeriapsis}
                color={body.visual.color}
              />
            );
          }
        })}
    </Canvas>
  );
}

export default Scene;
