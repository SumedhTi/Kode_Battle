import { mockUser, mockRecentMatches } from "@/data/mockData";
import { Zap, Coins, TrendingUp, Flame, Swords, Trophy, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DashboardProps {
  onEnterArena: () => void;
}

const leagueBadge: Record<string, { color: string; glow: string }> = {
  Bronze: { color: "text-neon-amber", glow: "" },
  Silver: { color: "text-muted-foreground", glow: "" },
  Gold: { color: "text-neon-amber", glow: "text-glow-green" },
  Diamond: { color: "text-neon-blue", glow: "text-glow-blue" },
};

export default function Dashboard({ onEnterArena }: DashboardProps) {
  const badge = leagueBadge[mockUser.league] || leagueBadge.Gold;

  return (
    <div className="animate-slide-up space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-accent">{mockUser.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {mockUser.universityId} · {mockUser.university}
          </p>
        </div>
        <div className={`flex items-center gap-2 rounded-full border border-neon-amber/30 bg-neon-amber/10 px-4 py-2 ${badge.color}`}>
          <Trophy className="h-5 w-5" />
          <span className="font-display text-sm font-bold tracking-wider">{mockUser.league.toUpperCase()} TIER</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Zap} label="Elo Rating" value={mockUser.elo.toString()} accent="text-primary" bgAccent="bg-primary/10" />
        <StatCard icon={Coins} label="Battle Coins" value={mockUser.battleCoins.toLocaleString()} accent="text-neon-amber" bgAccent="bg-neon-amber/10" />
        <StatCard icon={TrendingUp} label="Win/Loss" value={`${mockUser.wins}W / ${mockUser.losses}L`} accent="text-accent" bgAccent="bg-accent/10" />
        <StatCard icon={Flame} label="Win Streak" value={`${mockUser.winStreak} 🔥`} accent="text-neon-rose" bgAccent="bg-neon-rose/10" />
      </div>

      {/* Recent Matches */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Matches</h2>
        <div className="space-y-3">
          {mockRecentMatches.map((match, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  {match.opponentAvatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{match.opponent}</p>
                  <p className="text-xs text-muted-foreground">{match.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    match.result === "win"
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {match.result}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-sm font-mono font-semibold ${
                    match.eloChange > 0 ? "text-accent" : "text-destructive"
                  }`}
                >
                  {match.eloChange > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {match.eloChange > 0 ? "+" : ""}
                  {match.eloChange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onEnterArena}
        className="group relative w-full overflow-hidden rounded-xl border border-primary/30 bg-primary/10 p-6 text-center transition-all duration-300 hover:border-primary/60 hover:bg-primary/20 glow-blue"
      >
        <div className="flex items-center justify-center gap-3">
          <Swords className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-2xl font-bold tracking-wider text-primary">
            ENTER BATTLE ARENA
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Find an opponent and prove your skills</p>
      </button>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  bgAccent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  bgAccent: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgAccent}`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={`text-xl font-bold ${accent}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
