import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

export type Reason = {
  id: string;
  title: string;
  url: string; // New field for external link
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
  tags: string[];
  impact: "high" | "medium" | "low";
};

export function ReasonFeed({ reasons }: { reasons: Reason[]; onReasonClick?: (reason: Reason) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {reasons.map((reason) => (
        <ReasonCard key={reason.id} reason={reason} />
      ))}
    </div>
  );
}

function ReasonCard({ reason }: { reason: Reason }) {
  const isBullish = reason.sentiment === "bullish";
  const isBearish = reason.sentiment === "bearish";

  const handleClick = () => {
     if (reason.url) {
        window.open(reason.url, "_blank", "noopener,noreferrer");
     }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 hover:border-neutral-700 transition-colors backdrop-blur-sm cursor-pointer active:scale-95 transition-transform"
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10 pointer-events-none",
          isBullish
            ? "from-green-500 to-transparent"
            : isBearish
            ? "from-red-500 to-transparent"
            : "from-blue-500 to-transparent"
        )}
      />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500 font-mono">
            {reason.timestamp}
          </span>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
              isBullish
                ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_-4px_rgba(74,222,128,0.5)]"
                : isBearish
                ? "bg-red-500/10 text-red-500 shadow-[0_0_10px_-4px_rgba(248,113,113,0.5)]"
                : "bg-blue-500/10 text-blue-500"
            )}
          >
            {isBullish ? (
              <ArrowUp size={10} />
            ) : isBearish ? (
              <ArrowDown size={10} />
            ) : (
              <Activity size={10} />
            )}
            {reason.sentiment.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
           <h3 className="font-bold text-neutral-200 text-sm leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
            {reason.title}
           </h3>
           <Activity size={16} className="text-neutral-700 opacity-50 group-hover:opacity-100 group-hover:text-cyan-500 transition-all shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {reason.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-neutral-600 border border-neutral-800/50 rounded px-1.5 py-0.5 uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
