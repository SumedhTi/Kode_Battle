import { Trophy, Medal, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/api";

const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual layout

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard()
      .then((data) => {
        if (!cancelled) {
          setLeaderboard(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load leaderboard", err);
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // data transformation: compute avatar and win rate
  const enriched = leaderboard.map((u) => ({
    ...u,
    avatar: u.name.charAt(0).toUpperCase(),
    winRate: u.matchesPlayed > 0 ? Math.round((u.wins / u.matchesPlayed) * 100) : 0,
    branch: "N/A",
    year: "N/A",
    language: "JS",
  }));

  const top3 = enriched.slice(0, 3);
  const rest = enriched.slice(3);

  return (
    <div className="animate-slide-up space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">Top competitive programmers this season</p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <p className="text-sm text-muted-foreground animate-pulse">Loading rankings...</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 py-12 text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load leaderboard</p>
          <p className="text-sm text-destructive/80">Please check your connection and try again.</p>
        </div>
      )}
      {!loading && !error && leaderboard.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center">
          <Trophy className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-bold text-foreground">No Players Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">The leaderboard is currently empty. Start battling to claim the top spot!</p>
        </div>
      )}

      {/* Podium */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {podiumOrder.map((idx) => {
            const player = top3[idx];
            if (!player) return null; // Prevent crash when < 3 players exist

            const isFirst = player.rank === 1;
            const isSecond = player.rank === 2;
            const heights = { 1: "h-40", 2: "h-32", 3: "h-24" };
            const badgeColors = {
              1: "bg-neon-amber/20 text-neon-amber border-neon-amber/40",
              2: "bg-muted text-muted-foreground border-border",
              3: "bg-neon-amber/10 text-neon-amber/70 border-neon-amber/20",
            };

            return (
              <div key={player.rank} className="flex flex-col items-center gap-2">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                  isFirst ? "border-neon-amber glow-green" : "border-border"
                } bg-card text-lg font-bold text-foreground`}>
                  {player.avatar}
                  {isFirst && <Crown className="absolute -top-5 h-6 w-6 text-neon-amber" />}
                </div>
                <p className="text-sm font-semibold text-foreground">{player.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{player.eloRating} Elo</p>
                <div
                  className={`${heights[player.rank]} w-28 rounded-t-xl border ${badgeColors[player.rank]} flex items-center justify-center`}
                >
                  <span className="font-display text-2xl font-bold">#{player.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      {!loading && !error && leaderboard.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Branch</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Elo</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Language</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((player) => (
                <tr key={player.rank} className="border-b border-border transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-sm font-bold text-muted-foreground">#{player.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {player.avatar}
                      </div>
                      <span className="text-sm font-medium text-foreground">{player.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{player.branch}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{player.year}</td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-primary">{player.elo}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">{player.language}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${player.winRate}%` }} />
                      </div>
                      <span className="text-sm font-medium text-accent">{player.winRate}%</span>
                    </div>
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
