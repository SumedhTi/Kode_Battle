import { mockRecentMatches } from "../data/mockData";
import {
  Zap,
  Coins,
  TrendingUp,
  Flame,
  Swords,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useUser } from "../data/userContext";

const leagueBadge = {
  Bronze: "bg-gradient-to-br from-[#CD7F32] via-[#B08D57] to-[#804A00] text-[#FAF3E0] shadow-md border border-[#A0522D]/30 ring-2 ring-[#B08D57]/50 ring-offset-2 ring-offset-slate-900",
  Silver: "bg-gradient-to-br from-[#E2E2E2] via-[#C0C0C0] to-[#8E8E8E] text-[#333333] shadow-md border border-white/20 ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900",
  Gold: "bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#5C4033] shadow-lg border border-[#FBF5B7]/50 border-t-2 border-l-2 border-[#FCF6BA] border-b-2 border-r-2 border-[#8B4513] shadow-lg ring-2 ring-[#FBF5B7]/50 ring-offset-2 ring-offset-slate-900",
  Diamond: "bg-gradient-to-br from-[#E0F7FA] via-[#80DEEA] to-[#B2EBF2] text-[#006064] shadow-[0_0_15px_rgba(128,222,234,0.5)] border border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#00ACC1] shadow-[0_0_15px_rgba(128,222,234,0.3)] ring-2 ring-[#00ACC1]/50 ring-offset-2 ring-offset-slate-900",
};

export default function Dashboard({ onEnterArena }) {
  const { user: userData, isAuthenticated } = useUser();

  if (!isAuthenticated || !userData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg">Please log in to access the dashboard.</p>
      </div>
    );
  }

  const badge = leagueBadge[userData.league];

  return (
    <div className="animate-slide-up space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back,{" "}
            <span className="text-accent">{userData.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {userData.universityId} · {userData.university}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 ${badge} transition-all duration-300 hover:brightness-120 hover:scale-110`}
        >
          <Trophy className="h-5 w-5" />
          <span className="font-display text-sm font-bold tracking-wider">
            {userData.league.toUpperCase()} TIER
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          Icon={Zap}
          label="Elo Rating"
          value={userData.elo.toString()}
          accent="text-primary"
          bgAccent="bg-primary/10"
        />
        <StatCard
          Icon={Coins}
          label="Battle Coins"
          value={userData.battleCoins.toLocaleString()}
          accent="text-neon-amber"
          bgAccent="bg-neon-amber/10"
        />
        <StatCard
          Icon={TrendingUp}
          label="Win/Loss"
          value={`${userData.wins}W / ${userData.losses}L`}
          accent="text-accent"
          bgAccent="bg-accent/10"
        />
        <StatCard
          Icon={Flame}
          label="Win Streak"
          value={`${userData.winStreak} 🔥`}
          accent="text-neon-rose"
          bgAccent="bg-neon-rose/10"
        />
      </div>

      {/* Recent Matches */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Recent Matches
        </h2>
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
                  <p className="text-sm font-medium text-foreground">
                    {match.opponent}
                  </p>
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
        <p className="mt-2 text-sm text-muted-foreground">
          Find an opponent and prove your skills
        </p>
      </button>
    </div>
  );
}

function StatCard({ Icon, label, value, accent, bgAccent }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgAccent}`}
        >
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className={`text-xl font-bold ${accent}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
