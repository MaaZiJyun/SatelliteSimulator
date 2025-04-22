import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useCameraStore } from "@/stores/cameraStores";

export const CameraController = () => {
  const { camera, gl } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const speed = 1;
  const sensitivity = 0.002;
  const controlObject = useRef(new THREE.Object3D());

  useEffect(() => {
    controlObject.current.position.copy(camera.position);
    const euler = new THREE.Euler().copy(camera.rotation);
    euler.order = "YXZ";
    yaw.current = euler.y;
    pitch.current = euler.x;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        yaw.current -= e.movementX * sensitivity;
        pitch.current -= e.movementY * sensitivity;
        pitch.current = Math.max(
          -Math.PI / 2 + 0.01,
          Math.min(Math.PI / 2 - 0.01, pitch.current)
        );
      }
    };

    const onClick = () => {
      canvas.requestPointerLock();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key.toLowerCase() === "q" && e.ctrlKey)) {
        console.log("Exit pointer lock");
        if (document.pointerLockElement === canvas) {
          document.exitPointerLock();
        }
      }
    };

    const onPointerLockChange = () => {
      const isLocked = document.pointerLockElement === canvas;
      // setController(isLocked);
    };

    canvas.addEventListener("click", onClick);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    return () => {
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
    };
  }, [gl]);

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0); // 可选，允许升降
  const move = new THREE.Vector3();

  useFrame(() => {
    const obj = controlObject.current;

    // 设置正确的欧拉角顺序
    obj.rotation.order = "YXZ";
    obj.rotation.y = yaw.current; // yaw 左右
    obj.rotation.x = pitch.current; // pitch 上下

    forward.set(0, 0, -1).applyEuler(obj.rotation);
    right.set(1, 0, 0).applyEuler(obj.rotation);
    up.set(0, 1, 0); // 可选，允许升降
    move.set(0, 0, 0);
    if (keys.current["w"]) move.add(forward);
    if (keys.current["s"]) move.sub(forward);
    if (keys.current["a"]) move.sub(right);
    if (keys.current["d"]) move.add(right);
    if (keys.current["e"]) move.add(up);
    if (keys.current["q"]) move.sub(up);

    move.normalize().multiplyScalar(speed);
    obj.position.add(move);

    camera.position.copy(obj.position);
    camera.rotation.copy(obj.rotation);
  });

  return null;
};
