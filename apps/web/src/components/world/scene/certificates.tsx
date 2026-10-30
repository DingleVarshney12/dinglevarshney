import { CertificateFrame } from "./certificate-frame";
import type { Vector3Tuple } from "three";

const CERTIFICATE_POSITIONS: Vector3Tuple[] = [
  [1.2, 1.48, -10.68],
  [4, 1.48, -10.68],
  [1.2, 3.04, -10.68],
  [4, 3.04, -10.68],
];

export function Certificates() {
  return (
    <group>
      {CERTIFICATE_POSITIONS.map((position, index) => (
        <CertificateFrame key={`certificate-${index + 1}`} position={position} index={index + 1} />
      ))}
    </group>
  );
}
