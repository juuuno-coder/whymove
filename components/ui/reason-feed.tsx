import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

export type Reason = {
  id: string;
  title: string;
  description: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
  tags: string[];
  impact: "high" | "medium" | "low";
};

export function ReasonFeed({ reasons, onReasonClick }: { reasons: Reason[]; onReasonClick?: (reason: Reason) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {reasons.map((reason) => (
        <ReasonCard key={reason.id} reason={reason} onClick={() => onReasonClick?.(reason)} />
      ))}
    </div>
  );
}

function ReasonCard({ reason, onClick }: { reason: Reason; onClick?: () => void }) {
  const isBullish = reason.sentiment === "bullish";
  const isBearish = reason.sentiment === "bearish";

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 hover:border-neutral-700 transition-colors backdrop-blur-sm cursor-pointer active:scale-95 transition-transform"
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

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500 font-mono">
            {reason.timestamp}
          </span>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tracking-wider",
              isBullish
                ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_-4px_rgba(74,222,128,0.5)]"
                : isBearish
                ? "bg-red-500/10 text-red-500 shadow-[0_0_10px_-4px_rgba(248,113,113,0.5)]"
                : "bg-blue-500/10 text-blue-500"
            )}
          >
            {isBullish ? (
              <ArrowUp size={12} />
            ) : isBearish ? (
              <ArrowDown size={12} />
            ) : (
              <Activity size={12} />
            )}
            {reason.sentiment.toUpperCase()}
          </div>
        </div>
        
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h3 className="font-bold text-neutral-100 text-lg leading-tight group-hover:text-primary transition-colors">
              {reason.title}
             </h3>
           </div>
           <p className="text-sm text-neutral-400 leading-relaxed">
             {reason.description}
           </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {reason.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-neutral-500 border border-neutral-800 rounded px-1.5 py-0.5 uppercase tracking-wider hover:border-neutral-600 transition-colors"
            >
              #{tag}
            </span>
          ))}
           <span className={cn(
                "text-[10px] ml-auto border rounded px-1.5 py-0.5 uppercase font-bold tracking-wider",
                reason.impact === 'high' ? "border-red-900 text-red-700" : "border-neutral-800 text-neutral-600"
           )}>
             {reason.impact} Impact
           </span>
        </div>
      </div>
    </div>
  );
}
