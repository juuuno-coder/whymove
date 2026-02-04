"use client";

import React, { useState } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { LiveTicker } from "@/components/ui/live-ticker";
import { ReasonFeed, Reason } from "@/components/ui/reason-feed";
import { MainChart } from "@/components/chart/main-chart";
import { ChatRoom } from "@/components/community/chat-room";

export default function Home() {
  // Static ticker data
  const tickerItems = [
    { symbol: "BTC/USDT", price: "98,420", change: "+4.2%", isUp: true },
    { symbol: "ETH/USDT", price: "2,850", change: "+1.2%", isUp: true },
    { symbol: "SOL/USDT", price: "145", change: "-0.5%", isUp: false },
    { symbol: "BNB/USDT", price: "620", change: "+0.8%", isUp: true },
    { symbol: "XRP/USDT", price: "1.20", change: "-2.1%", isUp: false },
  ];

  // Placeholder for reasons (can be connected to an API later)
  const [reasons] = useState<Reason[]>([
    {
      id: "1",
      title: "Bitcoin Breaks $98k",
      description: "BTC surges past $98,000 as ETF inflows reach record highs.",
      sentiment: "bullish",
      timestamp: "2 mins ago",
      tags: ["Bitcoin", "ETF"],
      impact: "high"
    },
    {
      id: "2",
      title: "SEC Approval Rumors",
      description: "Sources suggest SEC is considering approval for Solana ETF next month.",
      sentiment: "bullish",
      timestamp: "15 mins ago",
      tags: ["Regulation", "SEC"],
      impact: "medium"
    },
    {
      id: "3",
      title: "Fed Interest Rate Decision",
      description: "Powell signals 'higher for longer', causing minor dip in tech stocks.",
      sentiment: "bearish",
      timestamp: "1 hour ago",
      tags: ["Macro", "Fed"],
      impact: "high"
    }
  ]);

  return (
    <main className="min-h-screen w-full bg-black relative overflow-hidden text-neutral-200 font-sans selection:bg-cyan-500/30">
      <GridBackground className="min-h-screen w-full items-start overflow-y-auto">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-2">
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500 tracking-tight">
              Why Is <span className="text-cyan-400">Bitcoin</span> Moving?
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto text-base md:text-lg font-light">
              Real-time volatility tracking & Community Intelligence.
            </p>
          </div>

          {/* Ticker */}
          <div className="w-full -mx-4 md:mx-0 border-y border-white/5 bg-black/40 backdrop-blur-md">
             <LiveTicker items={tickerItems} speed="normal" />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            {/* Chart Area */}
            <div className="lg:col-span-8 min-h-[600px] border border-neutral-800 rounded-2xl bg-neutral-900/30 backdrop-blur-md p-1 relative group overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none z-10" />
              
              <div className="h-full w-full rounded-xl bg-[#131722] border border-neutral-800 flex flex-col overflow-hidden">
                 {/* Main Chart (TradingView Widget) */}
                 <div className="flex-1 w-full h-full relative">
                    <MainChart />
                 </div>
              </div>
            </div>

            {/* Side Feed: Community & Chat */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[600px]">
              <ChatRoom className="h-full shadow-2xl shadow-black/50" />
            </div>
          </div>

          {/* Reason Feed Section (Optional / Future Use) */}
          <div className="w-full">
               <h2 className="text-xl font-bold text-neutral-100 mb-4 flex items-center gap-2">
                 <span className="w-1 h-6 bg-cyan-500 rounded-full" />
                 Market Drivers
               </h2>
               <ReasonFeed 
                 reasons={reasons} 
                 onReasonClick={() => {}} 
               />
               {reasons.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 border border-neutral-800 rounded-xl bg-neutral-900/20 text-sm">
                     Waiting for market events...
                  </div>
               )}
          </div>
        </div>
      </GridBackground>
    </main>
  );
}
