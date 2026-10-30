import { OfficeAsset } from "./office-asset";
import { plantPositions } from "../constants/world.constants";
import { WallTemple } from "./wall-temple";

export function RoomDetails() {
  return (
    <group>
      {plantPositions.map((position, index) => (
        <OfficeAsset
          key={`corner-plant-${index}`}
          asset="office_plant"
          position={position}
          scale={3.5}
        />
      ))}
      <WallTemple />
    </group>
  );
}
