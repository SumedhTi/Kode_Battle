import { useState, useEffect } from "react";
import { mockBattleProblem, mockCode } from "@/data/mockData";
import {
  Play,
  Send,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Lock,
  Wifi,
  Clock,
} from "lucide-react";

export default function BattleArena() {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [language, setLanguage] = useState("C++");
  const [activeTab, setActiveTab] = useState<"testcases" | "console">("testcases");
  const [opponentStatus, setOpponentStatus] = useState("Opponent is typing...");

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statuses = [
      "Opponent is typing...",
      "Opponent running tests...",
      "Opponent is thinking...",
      "Opponent is typing...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setOpponentStatus(statuses[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const problem = mockBattleProblem;

  return (
    <div className="animate-slide-up flex h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg font-bold ${
            timeLeft < 300 ? "animate-count-down border-destructive/50 bg-destructive/10 text-destructive" : "border-neon-amber/30 bg-neon-amber/10 text-neon-amber"
          }`}>
            <Clock className="h-4 w-4" />
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Wifi className="h-4 w-4 animate-pulse-glow text-accent" />
          <span className="text-muted-foreground">{opponentStatus}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
            PS
          </div>
          <span className="font-medium text-foreground">Priya Sharma</span>
        </div>
      </div>

      {/* Main IDE */}
      <div className="flex flex-1 overflow-hidden border-x border-border">
        {/* Left Pane - Problem */}
        <div className="w-full overflow-y-auto border-r border-border bg-card p-6 lg:w-[45%]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">{problem.title}</h2>
            <span className="rounded-full bg-neon-amber/15 px-3 py-0.5 text-xs font-bold text-neon-amber">
              {problem.difficulty}
            </span>
          </div>

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p className="whitespace-pre-line">{problem.description}</p>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Constraints</h3>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="font-mono text-xs text-muted-foreground">• {c}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sample Input</h3>
              <pre className="rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-accent">
                {problem.sampleInput}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sample Output</h3>
              <pre className="rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-accent">
                {problem.sampleOutput}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Explanation</h3>
              <p className="text-muted-foreground">{problem.explanation}</p>
            </div>
          </div>
        </div>

        {/* Right Pane - Editor */}
        <div className="flex flex-1 flex-col">
          {/* Language selector */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-card px-3 py-1.5 pr-8 text-sm text-foreground outline-none focus:border-primary"
              >
                <option>C++</option>
                <option>Python</option>
                <option>Java</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Code editor mock */}
          <div className="flex-1 overflow-auto bg-background p-4">
            <pre className="font-mono text-sm leading-6">
              {mockCode.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-8 text-right text-muted-foreground/50 select-none">
                    {i + 1}
                  </span>
                  <code className="text-foreground/90">
                    {colorize(line)}
                  </code>
                </div>
              ))}
            </pre>
          </div>

          {/* Test Cases / Console */}
          <div className="border-t border-border">
            <div className="flex items-center gap-1 border-b border-border bg-secondary/50 px-4">
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "testcases" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "console" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Console
              </button>
            </div>

            <div className="h-40 overflow-y-auto bg-card p-4">
              {activeTab === "testcases" ? (
                <div className="space-y-2">
                  {problem.testCases.map((tc) => (
                    <div
                      key={tc.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2 text-sm ${
                        tc.status === "passed"
                          ? "border-accent/30 bg-accent/5"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tc.status === "passed" ? (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-foreground">Test Case {tc.id}</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {tc.status === "passed" ? "Passed" : "Failed"}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>11 Hidden Test Cases</span>
                  </div>
                </div>
              ) : (
                <pre className="font-mono text-xs text-muted-foreground">
                  {`> Running test cases...\n> Test 1: Passed ✓\n> Test 2: Passed ✓\n> Test 3: Passed ✓\n> Test 4: Failed ✗ — Expected: 6, Got: 5\n> 3/4 public tests passed`}
                </pre>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-border bg-secondary/50 p-4">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary">
              <Play className="h-4 w-4 text-accent" />
              Run Code
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 glow-blue">
              <Send className="h-4 w-4" />
              Submit Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function colorize(line: string) {
  // Very simple syntax highlighting for the mock
  const keywords = ["#include", "using", "namespace", "int", "vector", "for", "if", "return", "auto", "void", "cin", "cout", "endl"];
  let result = line;
  // Return as-is for simplicity — the mono font + dark bg gives enough "editor" feel
  return <span>{result}</span>;
}
