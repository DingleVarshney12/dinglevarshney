import { Shape } from "three";
import { JagannathTrinity } from "./jagannath-trinity";
import { TempleDome } from "./temple-dome";

function ArchShape({ inset = false }: { inset?: boolean }) {
  const width = inset ? 0.88 : 1.03;
  const bottom = inset ? -1.02 : -1.2;
  const shoulder = inset ? 0.2 : 0.26;
  const top = inset ? 1.0 : 1.15;
  const shape = new Shape();
  shape.moveTo(-width, bottom);
  shape.lineTo(width, bottom);
  shape.lineTo(width, shoulder);
  shape.quadraticCurveTo(width, top, 0, top);
  shape.quadraticCurveTo(-width, top, -width, shoulder);
  shape.closePath();
  return <shapeGeometry args={[shape]} />;
}

export function WallTemple() {
  return (
    <group position={[9.48, 1.92, 0.15]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, -0.17]}>
        <boxGeometry args={[2.45, 2.8, 0.42]} />
        <meshStandardMaterial color="#9b7059" roughness={0.82} flatShading />
      </mesh>
      <TempleDome />
      <mesh position={[0, 0.04, 0.052]}>
        <ArchShape />
        <meshStandardMaterial color="#c39778" roughness={0.86} side={2} />
      </mesh>
      <mesh position={[0, 0.04, 0.061]}>
        <ArchShape inset />
        <meshStandardMaterial color="#291b18" roughness={0.92} side={2} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.96, 0.02, 0.25]}>
          <boxGeometry args={[0.12, 2.06, 0.42]} />
          <meshStandardMaterial color="#77513f" roughness={0.84} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, -0.66, 0.28]}>
        <boxGeometry args={[1.98, 0.16, 0.65]} />
        <meshStandardMaterial color="#c39468" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, -1.13, 0.08]}>
        <boxGeometry args={[2.3, 0.62, 0.38]} />
        <meshStandardMaterial color="#a87a5a" roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow position={[0, -1.47, 0.12]}>
        <boxGeometry args={[2.32, 0.1, 0.42]} />
        <meshStandardMaterial color="#c39468" roughness={0.78} />
      </mesh>
      <mesh position={[0, -1.12, 0.278]}>
        <boxGeometry args={[0.28, 0.18, 0.025]} />
        <meshStandardMaterial color="#805236" roughness={0.75} />
      </mesh>
      <JagannathTrinity />
      <pointLight position={[0, 0.35, 0.8]} color="#ffca78" intensity={1.1} distance={3.2} />
    </group>
  );
}
