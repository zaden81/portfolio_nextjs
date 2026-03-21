export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Level {
  id: number;
  name: string;
  projectileCount: number;
  blocks: Block[];
}

export type GamePhase = "aiming" | "flying" | "settling" | "result";

export interface GameState {
  currentLevel: number;
  score: number;
  projectilesLeft: number;
  totalProjectiles: number;
  phase: GamePhase;
  blocksRemaining: number;
  levelComplete: boolean;
  gameOver: boolean;
  sessionId: string | null;
}
