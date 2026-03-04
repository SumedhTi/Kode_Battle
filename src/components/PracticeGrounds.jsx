import { useState } from "react";
import { mockProblems } from "@/data/mockData";
import { Search, Filter, CheckCircle2, XCircle, Circle, BookOpen } from "lucide-react";

const difficulties = ["All", "Easy", "Medium", "Hard"];
const topics = ["All", "Arrays", "DP", "Graphs"];
const statuses = ["All", "Solved", "Unsolved", "Failed"];

const difficultyColor = {
  Easy: "text-accent bg-accent/10 border-accent/30",
  Medium: "text-neon-amber bg-neon-amber/10 border-neon-amber/30",
  Hard: "text-destructive bg-destructive/10 border-destructive/30",
};

const statusIcon = {
  solved: <CheckCircle2 className="h-4 w-4 text-accent" />,
  unsolved: <Circle className="h-4 w-4 text-muted-foreground" />,
  failed: <XCircle className="h-4 w-4 text-destructive" />,
};

export default function PracticeGrounds() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = mockProblems.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty !== "All" && p.difficulty !== difficulty) return false;
    if (topic !== "All" && p.topic !== topic) return false;
    if (status !== "All" && p.status !== status.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practice Grounds</h1>
        <p className="mt-1 text-muted-foreground">Sharpen your skills and upsolve past battles</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <FilterGroup label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
        <FilterGroup label="Topic" options={topics} value={topic} onChange={setTopic} />
        <FilterGroup label="Status" options={statuses} value={status} onChange={setStatus} />
      </div>

      {/* Problems Grid */}
      <div className="grid gap-3">
        {filtered.map((problem) => (
          <div
            key={problem.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80"
          >
            <div className="flex items-center gap-4">
              {statusIcon[problem.status]}
              <div>
                <h3 className="text-sm font-semibold text-foreground">{problem.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">{problem.topic}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{problem.acceptance}% acceptance</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-neon-amber">{problem.points} pts</span>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20">
                <BookOpen className="h-4 w-4" />
                Solve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {label}: {o}
        </option>
      ))}
    </select>
  );
}
