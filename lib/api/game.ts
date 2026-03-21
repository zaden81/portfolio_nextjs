import { authFetch } from "@/lib/auth/api";

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
    return authFetch(`/game/sessions/${sessionId}/score`, {
      method: "PATCH",
      body: JSON.stringify({ score, levelsCompleted }),
    });
  },

  completeSession(
    sessionId: string,
  ): Promise<{ session: GameSessionResponse }> {
    return authFetch(`/game/sessions/${sessionId}/complete`, {
      method: "POST",
    });
  },

  getHistory(): Promise<{ sessions: GameSessionResponse[] }> {
    return authFetch("/game/sessions/me");
  },
};
