"use client";

import { useEffect, useState, useCallback } from "react";
import {
  leaderboardApi,
  type LeaderboardEntry,
} from "@/lib/api/leaderboard";

interface LeaderboardProps {
  refreshTrigger?: number;
}

export default function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { leaderboard } = await leaderboardApi.getLeaderboard();
      setEntries(leaderboard);
    } catch {
      setError("Could not load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, refreshTrigger]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-text-primary font-bold text-lg">Leaderboard</h3>
      </div>

      {loading && (
        <div className="px-4 py-8 text-center text-text-muted text-sm">
          Loading...
        </div>
      )}

      {error && (
        <div className="px-4 py-8 text-center">
          <p className="text-status-error-text text-sm mb-2">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="px-4 py-8 text-center text-text-muted text-sm">
          No scores yet. Be the first to play!
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Player</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2 text-right hidden sm:table-cell">
                  Levels
                </th>
                <th className="px-4 py-2 text-right hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-t border-border/50 hover:bg-bg-tertiary/50 transition-colors"
                >
                  <td
                    className={`px-4 py-2 font-bold ${
                      entry.rank <= 3 ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {entry.rank}
                  </td>
                  <td className="px-4 py-2 text-text-primary font-medium truncate max-w-[150px]">
                    {entry.player_name}
                  </td>
                  <td className="px-4 py-2 text-right text-text-primary font-medium">
                    {entry.best_score.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-text-secondary hidden sm:table-cell">
                    {entry.levels_completed}/3
                  </td>
                  <td className="px-4 py-2 text-right text-text-muted hidden sm:table-cell">
                    {formatDate(entry.completed_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
