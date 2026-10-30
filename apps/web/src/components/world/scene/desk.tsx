import { OfficeAsset } from "./office-asset";
import { WorkerMascot } from "./worker-mascot";
import { MonitorCode } from "./monitor-code";

export function Desk({ isTalking = false }: { isTalking?: boolean }) {
  return (
    <group>
      <OfficeAsset asset="office_desk" position={[0, 0, -5.3]} scale={[3.25, 2, 2.4]} />
      <OfficeAsset
        asset="office_chair"
        position={[0, 0, -3.9]}
        scale={[2.2, 1.4, 2.2]}
        rotation={[0, Math.PI, 0]}
      />
      <WorkerMascot isTalking={isTalking} />

      <OfficeAsset asset="monitor" position={[0, 1.5, -5.35]} scale={2} />
      <MonitorCode />
      <OfficeAsset asset="desktop_tower" position={[2, 1.5, -5.3]} scale={2.2} />
      <OfficeAsset asset="keyboard" position={[0, 1.5, -4.78]} scale={2.5} />
      <OfficeAsset asset="computer_mouse" position={[0.88, 1.5, -4.78]} scale={2.3} />
      <OfficeAsset asset="desk_lamp" position={[-1.95, 1.5, -5.08]} scale={2.4} />
      <OfficeAsset asset="coffee_mug" position={[-1.55, 1.5, -4.78]} scale={2.4} />
      <OfficeAsset asset="paper_stack" position={[1.45, 1.5, -4.8]} scale={2.3} />
    </group>
  );
}
