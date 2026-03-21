import type { Level } from "./types";

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Simple Tower",
    projectileCount: 3,
    blocks: [
      { x: 550, y: 360, width: 40, height: 40 },
      { x: 550, y: 320, width: 40, height: 40 },
      { x: 550, y: 280, width: 40, height: 40 },
    ],
  },
  {
    id: 2,
    name: "Double Stack",
    projectileCount: 3,
    blocks: [
      { x: 500, y: 360, width: 40, height: 40 },
      { x: 500, y: 320, width: 40, height: 40 },
      { x: 580, y: 360, width: 40, height: 40 },
      { x: 580, y: 320, width: 40, height: 40 },
      { x: 540, y: 280, width: 40, height: 40 },
    ],
  },
  {
    id: 3,
    name: "Pyramid",
    projectileCount: 4,
    blocks: [
      { x: 480, y: 360, width: 40, height: 40 },
      { x: 520, y: 360, width: 40, height: 40 },
      { x: 560, y: 360, width: 40, height: 40 },
      { x: 600, y: 360, width: 40, height: 40 },
      { x: 500, y: 320, width: 40, height: 40 },
      { x: 540, y: 320, width: 40, height: 40 },
      { x: 580, y: 320, width: 40, height: 40 },
      { x: 540, y: 280, width: 40, height: 40 },
    ],
  },
];
