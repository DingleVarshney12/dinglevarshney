import type { Stop } from "../types/world.type";

export const cameraLimits = {
  minPitch: 0.12,
  maxPitch: 0.32,
  ceilingY: 3.72,
  orbitRadius: 9.2,
};

export const workerConversationPosition = [-0.85, 0, -2.27] as const;
export const playerConversationPosition = [0.8, 0, -0.55] as const;

export const stops: Stop[] = [
  { id: "certificates", name: "Wall certificates", position: [2.6, 0, -8.4] },
  { id: "projects", name: "Projects on the desk", position: [-2, 0, -3.2] },
  { id: "book", name: "About me book", position: [7.3, 0, -4.8] },
  { id: "mascot", name: "Talk to the mascot", position: [0.8, 0, -4.4] },
  { id: "exit", name: "Exit to home", position: [0, 0, 5.3] },
  { id: "temple", name: "Jai Jagannath 🙏", position: [8.1, 0, 0.15] },
];

export const emptyBookPages = [
  {
    title: "A little more about me",
    content: "My story is still being written. Check back soon to learn more about my journey.",
  },
];

export const plantPositions: [number, number, number][] = [
  [-8.65, 0, -9.55],
  [8.65, 0, -9.55],
  [-8.65, 0, 5.15],
  [8.65, 0, 5.15],
];

export const solidObjects = [
  { minX: -2.75, maxX: 2.75, minZ: -6.3, maxZ: -4.3 },
  { minX: -0.95, maxX: 0.95, minZ: -4.3, maxZ: -3.15 },
  { minX: 8.3, maxX: 9.25, minZ: -7.3, maxZ: -4.1 },
  { minX: 8.45, maxX: 9.8, minZ: -1.15, maxZ: 1.45 },
  ...plantPositions.map(([x, , z]) => ({
    minX: x - 0.52,
    maxX: x + 0.52,
    minZ: z - 0.52,
    maxZ: z + 0.52,
  })),
];
