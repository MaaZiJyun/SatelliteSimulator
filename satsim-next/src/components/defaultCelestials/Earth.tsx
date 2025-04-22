import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function Earth() {
  const colorMap = useLoader(TextureLoader, '/textures/earth_daymap.jpg');

  return (
    <mesh receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}
