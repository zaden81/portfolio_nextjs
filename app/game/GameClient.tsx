"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { createGameEngine, type GameEngine } from "@/lib/game/engine";
import { LEVELS } from "@/lib/game/levels";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/game/physics";
import type { GameState } from "@/lib/game/types";
import { gameApi } from "@/lib/api/game";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import Leaderboard from "./Leaderboard";

const PARTICLE_COLORS = ["#CC2936", "#f0f4e8", "#C5D5A0", "#5a8e3a"];

function CelebrationParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        color: PARTICLE_COLORS[i % 4],
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0, rotate: p.rotate }}
          transition={{ duration: 1.5, ease: "easeOut" as const }}
        />
      ))}
    </>
  );
}

export default function GameClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const { isAuthenticated } = useAuth();

  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    projectilesLeft: 0,
    totalProjectiles: 0,
    phase: "aiming",
    blocksRemaining: 0,
    levelComplete: false,
    gameOver: false,
    sessionId: null,
  });
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createGameEngine(canvas);
    engineRef.current = engine;
    setCanvasReady(true);

    engine.onStateChange((newState) => {
      setGameState({ ...newState });
    });

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  const startGame = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isAuthenticated) {
      try {
        const { session } = await gameApi.createSession();
        setSessionId(session.id);
      } catch (err) {
        console.warn("[Game] Failed to create session:", err);
      }
    }

    setStarted(true);
    setAllLevelsComplete(false);
    engine.loadLevel(LEVELS[0]);
    engine.start();
  }, [isAuthenticated]);

  const handleNextLevel = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;

    const state = engine.getState();
    const nextIndex = state.currentLevel;

    if (isAuthenticated && sessionId) {
      try {
        await gameApi.updateScore(sessionId, state.score, state.currentLevel);
      } catch (err) {
        console.warn("[Game] Failed to update score:", err);
      }
    }

    if (nextIndex < LEVELS.length) {
      engine.loadLevel(LEVELS[nextIndex]);
    } else {
      setAllLevelsComplete(true);
      setLeaderboardRefresh((n) => n + 1);
      engine.stop();

      if (isAuthenticated && sessionId) {
        try {
          await gameApi.updateScore(sessionId, state.score, state.currentLevel);
          await gameApi.completeSession(sessionId);
        } catch (err) {
          console.warn("[Game] Failed to save final score:", err);
        }
      }
    }
  }, [isAuthenticated, sessionId]);

  const handleRetry = useCallback(() => {
    engineRef.current?.retryLevel();
  }, []);

  const handleRestart = useCallback(async () => {
    setStarted(false);
    setSessionId(null);
    setAllLevelsComplete(false);
    engineRef.current?.stop();
    setGameState((prev) => ({ ...prev, score: 0, currentLevel: 0 }));
  }, []);

  const handleLevelFail = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;

    const state = engine.getState();
    if (isAuthenticated && sessionId) {
      try {
        await gameApi.updateScore(sessionId, state.score, state.currentLevel - 1);
        await gameApi.completeSession(sessionId);
      } catch (err) {
        console.warn("[Game] Failed to save on level fail:", err);
      }
    }

    setAllLevelsComplete(true);
    setLeaderboardRefresh((n) => n + 1);
    engine.stop();
  }, [isAuthenticated, sessionId]);

  const showStartOverlay = !started && !allLevelsComplete;
  const showResultOverlay = started && gameState.phase === "result" && !allLevelsComplete;
  const showGameOverOverlay = allLevelsComplete;
  const showGameInfo = started && !allLevelsComplete && gameState.phase !== "result";

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            &larr; Back
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-text-primary font-medium">
              Score:{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={gameState.score}
                  initial={{ scale: 1.3, color: "var(--accent)" }}
                  animate={{ scale: 1, color: "var(--text-primary)" }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {gameState.score}
                </motion.span>
              </AnimatePresence>
            </span>
            {started && !allLevelsComplete && (
              <span className="text-text-secondary text-sm">
                Level {gameState.currentLevel} / {LEVELS.length}
              </span>
            )}
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Game area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!isAuthenticated && (
          <div className="mb-4 px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-secondary text-sm text-center">
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium">
              Login
            </Link>
            {" "}to save your score
          </div>
        )}

        <div className="relative bg-bg-secondary rounded-lg overflow-hidden border border-border">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
          />

          {/* Canvas loading */}
          {!canvasReady && (
            <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center animate-pulse">
              <span className="text-text-muted text-sm">Loading game...</span>
            </div>
          )}

          {/* Start overlay */}
          <AnimatePresence>
            {showStartOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-center"
                >
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-text-primary mb-2"
                  >
                    Block Smasher
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-text-secondary mb-6 max-w-xs mx-auto"
                  >
                    Drag and release the slingshot to destroy all blocks!
                  </motion.p>
                  <Button size="lg" onClick={startGame}>
                    Start Game
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level result overlay */}
          <AnimatePresence>
            {showResultOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/85 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-center relative"
                >
                  {gameState.levelComplete ? (
                    <>
                      <CelebrationParticles />
                      <h2 className="text-2xl font-bold text-status-success-text mb-2">
                        Level Complete!
                      </h2>
                      <p className="text-text-secondary mb-6">
                        Score: {gameState.score}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={handleNextLevel}>
                          {gameState.currentLevel < LEVELS.length ? "Next Level" : "Finish"}
                        </Button>
                        <Button variant="outline" onClick={handleRetry}>
                          Retry
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-status-error-text mb-2">
                        Level Failed
                      </h2>
                      <p className="text-text-secondary mb-1">
                        Blocks remaining: {gameState.blocksRemaining}
                      </p>
                      <p className="text-text-secondary mb-6">
                        Score: {gameState.score}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={handleRetry}>
                          Retry Level
                        </Button>
                        <Button variant="outline" onClick={handleLevelFail}>
                          End Game
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All levels complete overlay */}
          <AnimatePresence>
            {showGameOverOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-text-primary mb-2">
                    Game Over
                  </h2>
                  <p className="text-text-secondary text-lg mb-1">
                    Final Score: {gameState.score}
                  </p>
                  <p className="text-text-muted mb-6">
                    Levels completed: {gameState.currentLevel} / {LEVELS.length}
                  </p>
                  {isAuthenticated && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-status-success-text text-sm mb-4"
                    >
                      Score saved!
                    </motion.p>
                  )}
                  <Button size="lg" onClick={handleRestart}>
                    Play Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game info */}
        <AnimatePresence>
          {showGameInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center justify-between text-sm bg-bg-secondary rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary mr-1">Shots:</span>
                {Array.from({ length: gameState.totalProjectiles }, (_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full border-2",
                      i < gameState.projectilesLeft
                        ? "bg-accent border-accent"
                        : "bg-transparent border-text-muted"
                    )}
                    initial={false}
                    animate={
                      i >= gameState.projectilesLeft
                        ? { scale: [1, 0.7, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              <span className="text-text-secondary">
                Blocks: {gameState.blocksRemaining}
              </span>
              <Button variant="ghost" size="sm" onClick={handleRetry}>
                Retry Level
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-text-muted text-sm"
          >
            <p>Drag the ball on the slingshot backward, then release to launch.</p>
            <p>Destroy all red blocks to complete each level.</p>
          </motion.div>
        )}

        {/* Leaderboard */}
        <div className="mt-8">
          <Leaderboard refreshTrigger={leaderboardRefresh} />
        </div>
      </div>
    </div>
  );
}
