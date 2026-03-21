"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createGameEngine, type GameEngine } from "@/lib/game/engine";
import { LEVELS } from "@/lib/game/levels";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/game/physics";
import type { GameState } from "@/lib/game/types";
import { gameApi } from "@/lib/api/game";

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

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createGameEngine(canvas);
    engineRef.current = engine;

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

    // Create session if authenticated
    if (isAuthenticated) {
      try {
        const { session } = await gameApi.createSession();
        setSessionId(session.id);
      } catch {
        // Continue without session
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
    const nextIndex = state.currentLevel; // currentLevel is 1-indexed, so it equals next array index

    // Save score to backend
    if (isAuthenticated && sessionId) {
      try {
        await gameApi.updateScore(sessionId, state.score, state.currentLevel);
      } catch {
        // Continue without saving
      }
    }

    if (nextIndex < LEVELS.length) {
      engine.loadLevel(LEVELS[nextIndex]);
    } else {
      // All levels complete
      setAllLevelsComplete(true);
      engine.stop();

      if (isAuthenticated && sessionId) {
        try {
          await gameApi.updateScore(sessionId, state.score, state.currentLevel);
          await gameApi.completeSession(sessionId);
        } catch {
          // Silent fail
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
    // When failing a level, complete the session with current score
    const engine = engineRef.current;
    if (!engine) return;

    const state = engine.getState();
    if (isAuthenticated && sessionId) {
      try {
        await gameApi.updateScore(sessionId, state.score, state.currentLevel - 1);
        await gameApi.completeSession(sessionId);
      } catch {
        // Silent fail
      }
    }

    setAllLevelsComplete(true);
    engine.stop();
  }, [isAuthenticated, sessionId]);

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
              Score: {gameState.score}
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

          {/* Start overlay */}
          {!started && !allLevelsComplete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/90">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Block Smasher
              </h1>
              <p className="text-text-secondary mb-6 text-center max-w-xs">
                Drag and release the slingshot to destroy all blocks!
              </p>
              <button
                onClick={startGame}
                className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-medium transition-colors text-lg"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Level result overlay */}
          {started && gameState.phase === "result" && !allLevelsComplete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/85">
              {gameState.levelComplete ? (
                <>
                  <h2 className="text-2xl font-bold text-status-success-text mb-2">
                    Level Complete!
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Score: {gameState.score}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleNextLevel}
                      className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                      {gameState.currentLevel < LEVELS.length
                        ? "Next Level"
                        : "Finish"}
                    </button>
                    <button
                      onClick={handleRetry}
                      className="border border-border hover:border-border-hover text-text-secondary hover:text-text-primary px-6 py-2 rounded-full font-medium transition-colors"
                    >
                      Retry
                    </button>
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
                  <div className="flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                      Retry Level
                    </button>
                    <button
                      onClick={handleLevelFail}
                      className="border border-border hover:border-border-hover text-text-secondary hover:text-text-primary px-6 py-2 rounded-full font-medium transition-colors"
                    >
                      End Game
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* All levels complete overlay */}
          {allLevelsComplete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/90">
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
                <p className="text-status-success-text text-sm mb-4">
                  Score saved!
                </p>
              )}
              <button
                onClick={handleRestart}
                className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-medium transition-colors text-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Game info */}
        {started && !allLevelsComplete && gameState.phase !== "result" && (
          <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
            <span>
              Projectiles:{" "}
              {Array.from({ length: gameState.totalProjectiles }, (_, i) => (
                <span key={i} className={i < gameState.projectilesLeft ? "text-text-primary" : "text-text-muted"}>
                  ●
                </span>
              ))}
            </span>
            <span>Blocks: {gameState.blocksRemaining}</span>
            <button
              onClick={handleRetry}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Retry Level
            </button>
          </div>
        )}

        {/* Instructions */}
        {!started && (
          <div className="mt-6 text-center text-text-muted text-sm">
            <p>Drag the ball on the slingshot backward, then release to launch.</p>
            <p>Destroy all red blocks to complete each level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
