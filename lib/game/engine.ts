import Matter from "matter-js";
import type { GameState, Level } from "./types";
import {
  createGround,
  createWalls,
  createBlock,
  createProjectile,
  createSlingshotConstraint,
  clampToSlingshotRange,
  isBodySleeping,
  isOffScreen,
  SLINGSHOT_X,
  SLINGSHOT_Y,
  PROJECTILE_RADIUS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./physics";
import { calculateLevelScore } from "./scoring";

const { Engine, World, Mouse, Events, Body, Vector } = Matter;

export interface GameEngine {
  start: () => void;
  stop: () => void;
  loadLevel: (level: Level) => void;
  retryLevel: () => void;
  getState: () => GameState;
  getEngine: () => Matter.Engine;
  onStateChange: (cb: (state: GameState) => void) => void;
}

export function createGameEngine(canvas: HTMLCanvasElement): GameEngine {
  const engine = Engine.create({
    gravity: { x: 0, y: 1.5, scale: 0.001 },
  });

  let currentLevel: Level | null = null;
  let animFrameId: number | null = null;
  let blocks: Matter.Body[] = [];
  let projectile: Matter.Body | null = null;
  let slingConstraint: Matter.Constraint | null = null;
  let isDragging = false;
  let settleTimer: number | null = null;
  let stateChangeCallback: ((state: GameState) => void) | null = null;

  const state: GameState = {
    currentLevel: 0,
    score: 0,
    projectilesLeft: 0,
    totalProjectiles: 0,
    phase: "aiming",
    blocksRemaining: 0,
    levelComplete: false,
    gameOver: false,
    sessionId: null,
  };

  function notifyStateChange() {
    stateChangeCallback?.({ ...state });
  }

  function countRemainingBlocks(): number {
    return blocks.filter((b) => {
      const inBounds = b.position.y < CANVAS_HEIGHT + 20;
      const exists = Matter.Composite.allBodies(engine.world).includes(b);
      return exists && inBounds;
    }).length;
  }

  function setupProjectile() {
    if (projectile) {
      World.remove(engine.world, projectile);
    }
    if (slingConstraint) {
      World.remove(engine.world, slingConstraint);
    }
    projectile = createProjectile();
    slingConstraint = createSlingshotConstraint(projectile);
    World.add(engine.world, [projectile, slingConstraint]);
    state.phase = "aiming";
    notifyStateChange();
  }

  function checkSettled() {
    if (state.phase !== "settling") return;

    const allBodies = Matter.Composite.allBodies(engine.world);
    const dynamicBodies = allBodies.filter((b) => !b.isStatic);
    const allSlow = dynamicBodies.every((b) => isBodySleeping(b) || isOffScreen(b));

    if (allSlow) {
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
      settleTimer = window.setTimeout(() => {
        finishSettling();
      }, 500);
    }
  }

  function finishSettling() {
    // Remove off-screen blocks
    blocks = blocks.filter((b) => {
      if (isOffScreen(b)) {
        World.remove(engine.world, b);
        return false;
      }
      return true;
    });

    // Remove projectile if off-screen
    if (projectile && isOffScreen(projectile)) {
      World.remove(engine.world, projectile);
      projectile = null;
    }

    state.blocksRemaining = countRemainingBlocks();
    const allDestroyed = state.blocksRemaining === 0;

    if (allDestroyed) {
      // Level complete
      const blocksDestroyed = currentLevel!.blocks.length;
      const levelScore = calculateLevelScore(
        blocksDestroyed,
        state.currentLevel,
        state.projectilesLeft,
        true,
      );
      state.score += levelScore;
      state.levelComplete = true;
      state.phase = "result";
      notifyStateChange();
    } else if (state.projectilesLeft > 0) {
      // More projectiles
      setupProjectile();
    } else {
      // No more projectiles, level failed — still give partial score
      const blocksDestroyed = currentLevel!.blocks.length - state.blocksRemaining;
      const levelScore = calculateLevelScore(
        blocksDestroyed,
        state.currentLevel,
        0,
        false,
      );
      state.score += levelScore;
      state.phase = "result";
      state.levelComplete = state.blocksRemaining === 0;
      notifyStateChange();
    }
  }

  function launchProjectile() {
    if (!projectile || !slingConstraint) return;

    // Remove constraint to launch
    World.remove(engine.world, slingConstraint);
    slingConstraint = null;

    state.projectilesLeft--;
    state.phase = "flying";
    notifyStateChange();

    // Watch for projectile to slow down or go off-screen
    const checkFlying = () => {
      if (state.phase !== "flying") return;
      if (!projectile) return;

      if (isOffScreen(projectile) || isBodySleeping(projectile)) {
        state.phase = "settling";
        notifyStateChange();
        // Give time for physics to settle
        setTimeout(() => checkSettled(), 1000);
        return;
      }
      requestAnimationFrame(checkFlying);
    };
    setTimeout(() => checkFlying(), 300);
  }

  // Mouse/touch handling
  function setupInput() {
    const rect = canvas.getBoundingClientRect();

    function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    }

    function onDown(e: MouseEvent | TouchEvent) {
      if (state.phase !== "aiming" || !projectile) return;
      const pos = getPos(e);
      const dx = pos.x - projectile.position.x;
      const dy = pos.y - projectile.position.y;
      if (Math.sqrt(dx * dx + dy * dy) < PROJECTILE_RADIUS * 3) {
        isDragging = true;
        e.preventDefault();
      }
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!isDragging || !projectile) return;
      e.preventDefault();
      const pos = getPos(e);
      const clamped = clampToSlingshotRange(Vector.create(pos.x, pos.y));
      Body.setPosition(projectile, clamped);
      Body.setVelocity(projectile, { x: 0, y: 0 });
    }

    function onUp() {
      if (!isDragging || !projectile) return;
      isDragging = false;
      const dx = projectile.position.x - SLINGSHOT_X;
      const dy = projectile.position.y - SLINGSHOT_Y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        // Didn't drag far enough, reset
        Body.setPosition(projectile, { x: SLINGSHOT_X, y: SLINGSHOT_Y });
        return;
      }
      launchProjectile();
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }

  let cleanupInput: (() => void) | null = null;

  function loadLevel(level: Level) {
    currentLevel = level;
    state.currentLevel = level.id;
    state.projectilesLeft = level.projectileCount;
    state.totalProjectiles = level.projectileCount;
    state.blocksRemaining = level.blocks.length;
    state.levelComplete = false;
    state.gameOver = false;
    state.phase = "aiming";

    // Clear world
    World.clear(engine.world, false);

    // Add static bodies
    const ground = createGround();
    const walls = createWalls();
    World.add(engine.world, [ground, ...walls]);

    // Add blocks
    blocks = level.blocks.map((b) => createBlock(b.x, b.y, b.width, b.height));
    World.add(engine.world, blocks);

    // Setup projectile
    setupProjectile();

    // Setup input
    if (cleanupInput) cleanupInput();
    cleanupInput = setupInput();

    notifyStateChange();
  }

  function render() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGrad.addColorStop(0, "#1a3a0a");
    skyGrad.addColorStop(1, "#2D5016");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const allBodies = Matter.Composite.allBodies(engine.world);

    for (const body of allBodies) {
      const vertices = body.vertices;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j++) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.closePath();

      if (body.label === "ground") {
        ctx.fillStyle = "#5a8e3a";
      } else if (body.label === "block") {
        ctx.fillStyle = "#CC2936";
        ctx.strokeStyle = "#a82030";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (body.label === "projectile") {
        ctx.fillStyle = "#f0f4e8";
      } else if (body.label === "wall") {
        continue; // Don't render walls
      } else {
        ctx.fillStyle = "#888";
      }
      ctx.fill();
    }

    // Draw slingshot
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 4;

    // Slingshot base (Y shape)
    ctx.beginPath();
    ctx.moveTo(SLINGSHOT_X - 15, SLINGSHOT_Y + 50);
    ctx.lineTo(SLINGSHOT_X, SLINGSHOT_Y + 20);
    ctx.lineTo(SLINGSHOT_X - 12, SLINGSHOT_Y - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(SLINGSHOT_X, SLINGSHOT_Y + 20);
    ctx.lineTo(SLINGSHOT_X + 12, SLINGSHOT_Y - 10);
    ctx.stroke();

    // Slingshot band
    if (projectile && (state.phase === "aiming")) {
      ctx.strokeStyle = "#654321";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(SLINGSHOT_X - 12, SLINGSHOT_Y - 10);
      ctx.lineTo(projectile.position.x, projectile.position.y);
      ctx.lineTo(SLINGSHOT_X + 12, SLINGSHOT_Y - 10);
      ctx.stroke();
    }

    // Projectile indicators at bottom
    const indicatorY = CANVAS_HEIGHT - 25;
    for (let i = 0; i < state.totalProjectiles; i++) {
      ctx.beginPath();
      ctx.arc(30 + i * 25, indicatorY, 8, 0, Math.PI * 2);
      if (i < state.projectilesLeft) {
        ctx.fillStyle = "#f0f4e8";
      } else {
        ctx.fillStyle = "#3a5e24";
      }
      ctx.fill();
      ctx.strokeStyle = "#5a8e3a";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function gameLoop() {
    Engine.update(engine, 1000 / 60);

    if (state.phase === "settling") {
      checkSettled();
    }

    render();
    animFrameId = requestAnimationFrame(gameLoop);
  }

  return {
    start() {
      if (animFrameId !== null) return;
      gameLoop();
    },
    stop() {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (cleanupInput) {
        cleanupInput();
        cleanupInput = null;
      }
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
      }
    },
    loadLevel,
    retryLevel() {
      if (currentLevel) loadLevel(currentLevel);
    },
    getState: () => ({ ...state }),
    getEngine: () => engine,
    onStateChange(cb: (state: GameState) => void) {
      stateChangeCallback = cb;
    },
  };
}
