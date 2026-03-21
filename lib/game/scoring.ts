export function calculateBlockScore(blocksDestroyed: number, level: number): number {
  return blocksDestroyed * 100 * level;
}

export function calculateBonusScore(projectilesLeft: number): number {
  return projectilesLeft * 200;
}

export function calculateLevelScore(
  blocksDestroyed: number,
  level: number,
  projectilesLeft: number,
  allBlocksDestroyed: boolean,
): number {
  let score = calculateBlockScore(blocksDestroyed, level);
  if (allBlocksDestroyed) {
    score += calculateBonusScore(projectilesLeft);
    score += 500; // level clear bonus
  }
  return score;
}
