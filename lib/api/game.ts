import { authFetch } from "@/lib/auth/api";

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

function validateSessionId(sessionId: string): string {
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    throw new Error("Invalid session ID format");
  }
  return encodeURIComponent(sessionId);
}

export interface GameSessionResponse {
  id: string;
  user_id: string;
  score: number;
  levels_completed: number;
  status: "active" | "completed" | "abandoned";
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const gameApi = {
  createSession(): Promise<{ session: GameSessionResponse }> {
    return authFetch("/game/sessions", { method: "POST" });
  },

  updateScore(
    sessionId: string,
    score: number,
    levelsCompleted?: number,
  ): Promise<{ session: GameSessionResponse }> {
    const id = validateSessionId(sessionId);
    return authFetch(`/game/sessions/${id}/score`, {
      method: "PATCH",
      body: JSON.stringify({ score, levelsCompleted }),
    });
  },

  completeSession(
    sessionId: string,
  ): Promise<{ session: GameSessionResponse }> {
    const id = validateSessionId(sessionId);
    return authFetch(`/game/sessions/${id}/complete`, {
      method: "POST",
    });
  },

  getHistory(): Promise<{ sessions: GameSessionResponse[] }> {
    return authFetch("/game/sessions/me");
  },
};
