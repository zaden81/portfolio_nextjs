import { getApiUrl } from "@/lib/auth/api";

export interface LeaderboardEntry {
  rank: number;
  player_name: string;
  best_score: number;
  levels_completed: number;
  completed_at: string;
}

export const leaderboardApi = {
  async getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
    const res = await fetch(`${getApiUrl()}/leaderboard`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
