export type Direction = "forward" | "backward" | "left" | "right" | "jump";
export type InputState = Record<Direction, boolean>;
export type StopId = "certificates" | "projects" | "book" | "mascot" | "temple" | "exit";
export type Stop = { id: StopId; name: string; position: [number, number, number] };
