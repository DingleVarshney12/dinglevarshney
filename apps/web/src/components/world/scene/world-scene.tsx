import { Room } from "./room";
import { Desk } from "./desk";
import { Bookcase } from "./bookcase";
import { Certificates } from "./certificates";
import { RoomDetails } from "./room-details";
import { Mascot } from "./player-mascot";
import { RoomShell } from "./room-shell";
import { WindowScenery } from "./window-scenery";
import { SocialWallSign } from "./social-wall-sign";
import { ExitPoint } from "./exit-point";
import { CeilingLedLights } from "./ceiling-led-lights";
import { TempleFlowerFall } from "./temple-flower-fall";
import type { InputState, StopId } from "../types/world.type";
import type { RefObject } from "react";
import type { SocialLink } from "@dinglevarshney/shared";

type Props = {
  input: RefObject<InputState>;
  jumpQueued: RefObject<boolean>;
  active: boolean;
  mascotTalking: boolean;
  cameraRotation: RefObject<{ yaw: number; pitch: number }>;
  onNearbyChange: (id: StopId | null) => void;
  socialLinks?: SocialLink[];
  templeFlowerTrigger: number;
};

export function WorldScene(props: Props) {
  return (
    <>
      <RoomShell />
      <WindowScenery />
      <Room />
      <Desk isTalking={props.mascotTalking} />
      <Bookcase />
      <Certificates />
      <RoomDetails />
      <SocialWallSign profileLinks={props.socialLinks} />
      <ExitPoint />
      <CeilingLedLights />
      <TempleFlowerFall trigger={props.templeFlowerTrigger} />
      <Mascot {...props} />
    </>
  );
}
