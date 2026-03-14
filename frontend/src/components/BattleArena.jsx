import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { socket, submitSolution } from "../services/api";
import { useUser } from "../data/userContext";
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
import { Editor } from "@monaco-editor/react";
import CompetitionGuard from "./CompetitionGuard";
import CodeEditor from "./CodeEditor";

export default function BattleArena() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [matchId, setMatchId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("testcases");
  const [opponentStatus, setOpponentStatus] = useState("Waiting for opponent...");
  const [problem, setProblem] = useState(null);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [isMatchReady, setIsMatchReady] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    // Socket event listeners
    socket.on('match_ready', (data) => {
      console.log('Match ready:', data);
      setIsMatchReady(true);
      setOpponentStatus('Opponent joined, match starting...');
    });

    socket.on('match_start', (data) => {
      console.log('Match started:', data);
      setIsMatchStarted(true);
      setTimeLeft(30 * 60); // Reset timer
      setOpponentStatus('Match in progress...');
    });

    socket.on('match_timer_update', (data) => {
      setTimeLeft(data.timeRemaining);
    });

    socket.on('match_problem', (data) => {
      console.log('Problem received:', data.problem);
      setProblem(data.problem);
    });

    socket.on('player_status', (data) => {
      if (data.playerId !== user._id) {
        setOpponentStatus(`Opponent: ${data.status}`);
      }
    });

    socket.on('match_end', (data) => {
      console.log('Match ended:', data);
      setIsMatchStarted(false);
      setOpponentStatus('Match finished');
      // Handle match end logic
    });

    return () => {
      socket.off('match_ready');
      socket.off('match_start');
      socket.off('match_timer_update');
      socket.off('match_problem');
      socket.off('player_status');
      socket.off('match_end');
    };
  }, [user]);

  useEffect(() => {
    const matchIdParam = searchParams.get('matchId');
    const isCreator = searchParams.get('isCreator') === 'true';

    if (!matchIdParam || !user) return;

    setMatchId(matchIdParam);
    // Join the socket room so we receive match events
    socket.emit('join_match_room', { matchId: matchIdParam });

    // Join the socket room so we receive match events from the server
    // (match creation / start is handled server-side when another player joins)
  }, [searchParams, user]);

  const handleTyping = (value) => {
    setCode(value || "");

    if (matchId) {
      socket.emit('player_status', {
        matchId,
        playerId: user._id,
        status: 'TYPING',
      });
    }
  };

  const handleRunTests = () => {
    if (matchId) {
      socket.emit('player_status', {
        matchId,
        playerId: user._id,
        status: 'RUNNING_TESTS',
      });
    }
  };

  const handleSubmit = async () => {
    if (matchId && code.trim()) {
      try {
        socket.emit('player_status', {
          matchId,
          playerId: user._id,
          status: 'SUBMITTED',
        });

        // Submit solution via API
        await submitSolution(matchId, language, code);
        console.log('Solution submitted successfully');
      } catch (error) {
        console.error('Failed to submit solution:', error);
      }
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const displayProblem = problem || {
    title: "Loading problem...",
    description: "Please wait while the problem loads.",
    constraints: [],
    visibleTestcases: [],
  };


  return (
    <>
    <CompetitionGuard />
    <div className="animate-slide-up flex h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-border bg-card px-5 py-3">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg font-bold ${
              timeLeft < 300
                ? "animate-count-down border-destructive/50 bg-destructive/10 text-destructive"
                : "border-neon-amber/30 bg-neon-amber/10 text-neon-amber"
            }`}
          >
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
            <h2 className="text-xl font-bold text-foreground">
              {problem.title}
            </h2>
            <span className="rounded-full bg-neon-amber/15 px-3 py-0.5 text-xs font-bold text-neon-amber">
              {problem.difficulty}
            </span>
          </div>

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p className="whitespace-pre-line">{problem.description}</p>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Constraints
              </h3>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    • {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sample Input
              </h3>
              <pre className="rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-accent">
                {problem.sampleInput}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sample Output
              </h3>
              <pre className="rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-accent">
                {problem.sampleOutput}
              </pre>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Explanation
              </h3>
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

          <CodeEditor onChange={handleTyping} />


          {/* Test Cases / Console */}
          <div className="border-t border-border">
            <div className="flex items-center gap-1 border-b border-border bg-secondary/50 px-4">
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "testcases"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab("console")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "console"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Console
              </button>
            </div>

            <div className="h-40 overflow-y-auto bg-card p-4">
              {activeTab === "testcases" ? (
                <div className="space-y-2">
              {displayProblem.visibleTestcases?.map((tc, i) => (
                <div
                  key={i}
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
                    <span className="text-foreground">
                      Test Case {i + 1}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {tc.status === "passed" ? "Passed" : "Failed"}
                  </span>
                </div>
              )) || []}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Hidden Test Cases</span>
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
            <button
              onClick={handleRunTests}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
            >
              <Play className="h-4 w-4 text-accent" />
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 glow-blue"
            >
              <Send className="h-4 w-4" />
              Submit Solution
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function colorize(line) {
  // Very simple syntax highlighting for the mock
  const keywords = [
    "#include",
    "using",
    "namespace",
    "int",
    "vector",
    "for",
    "if",
    "return",
    "auto",
    "void",
    "cin",
    "cout",
    "endl",
  ];
  let result = line;
  // Return as-is for simplicity — the mono font + dark bg gives enough "editor" feel
  return <span>{result}</span>;
}
