import { useState } from "react";
import { Swords, Loader2 } from "lucide-react";



export default function FindingOpponentModal({ onComplete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-slide-up flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 glow-blue">
        <div className="relative">
          <Swords className="h-16 w-16 animate-pulse-glow text-primary" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-xl font-bold tracking-wider text-foreground">FINDING OPPONENT</h2>
          <p className="mt-2 text-sm text-muted-foreground">Matching you with a worthy challenger...</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Searching ranked queue...</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-pulse-glow rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
