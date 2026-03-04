import { mockLeaderboard } from "@/data/mockData";
import { Trophy, Medal, Crown } from "lucide-react";

const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual layout

export default function Leaderboard() {
  const top3 = mockLeaderboard.slice(0, 3);
  const rest = mockLeaderboard.slice(3);

  return (
    <div className="animate-slide-up space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">Top competitive programmers this season</p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 py-4">
        {podiumOrder.map((idx) => {
          const player = top3[idx];
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
              <p className="font-mono text-xs text-muted-foreground">{player.elo} Elo</p>
              <div
                className={`${heights[player.rank]} w-28 rounded-t-xl border ${badgeColors[player.rank]} flex items-center justify-center`}
              >
                <span className="font-display text-2xl font-bold">#{player.rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
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
    </div>
  );
}
