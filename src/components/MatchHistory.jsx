import { useState } from "react";
import { mockMatchHistory } from "@/data/mockData";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  AlertTriangle,
} from "lucide-react";

export default function MatchHistory() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Match History</h1>
        <p className="mt-1 text-muted-foreground">Review and analyze your past battles</p>
      </div>

      <div className="space-y-3">
        {mockMatchHistory.map((match) => {
          const isOpen = expanded === match.id;
          return (
            <div key={match.id} className="overflow-hidden rounded-xl border border-border bg-card transition-all">
              {/* Summary row */}
              <button
                onClick={() => setExpanded(isOpen ? null : match.id)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    match.result === "win" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                  }`}>
                    {match.opponentAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">vs {match.opponent}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                        match.result === "win" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                      }`}>
                        {match.result}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{match.problem}</span>
                      <span>·</span>
                      <span className={`font-bold ${
                        match.difficulty === "Easy" ? "text-accent" : match.difficulty === "Medium" ? "text-neon-amber" : "text-destructive"
                      }`}>{match.difficulty}</span>
                      <span>·</span>
                      <span>{match.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-0.5 font-mono text-sm font-bold ${
                    match.eloChange > 0 ? "text-accent" : "text-destructive"
                  }`}>
                    {match.eloChange > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {match.eloChange > 0 ? "+" : ""}{match.eloChange}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="animate-slide-up border-t border-border bg-secondary/20 p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Time</p>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-lg font-bold text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        {match.yourTime}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Opponent Time</p>
                      <p className="mt-1 font-mono text-lg font-bold text-muted-foreground">{match.opponentTime}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Test Cases</p>
                      <p className="mt-1 font-mono text-lg font-bold">
                        <span className="text-accent">{match.testCasesPassed}</span>
                        <span className="text-muted-foreground">/{match.totalTestCases}</span>
                      </p>
                    </div>
                  </div>

                  {/* Hidden test case failures */}
                  {match.hiddenFailed.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Failed Hidden Test Cases
                      </p>
                      {match.hiddenFailed.map((tc) => (
                        <div key={tc.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 font-mono text-xs">
                          <p className="text-muted-foreground">Test #{tc.id}: {tc.input}</p>
                          <p className="mt-1">
                            Expected: <span className="text-accent">{tc.expected}</span> · Got: <span className="text-destructive">{tc.got}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20">
                    <Eye className="h-4 w-4" />
                    View Official Solution
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
