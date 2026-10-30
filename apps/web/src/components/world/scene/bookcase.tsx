import { OfficeAsset } from "./office-asset";
import { AboutBook } from "./about-book";

export function Bookcase() {
  return (
    <group>
      <OfficeAsset
        asset="bookshelf"
        position={[8.75, 0, -5.7]}
        scale={[3, 2.2, 3]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <AboutBook />
    </group>
  );
}
