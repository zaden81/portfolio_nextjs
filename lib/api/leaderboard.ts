import { authFetch } from "@/lib/auth/api";

export interface LeaderboardEntry {
  rank: number;
  player_name: string;
  best_score: number;
  levels_completed: number;
  completed_at: string;
}

export const leaderboardApi = {
  async getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
    return authFetch("/leaderboard");
  },
};
