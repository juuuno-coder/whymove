"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { LiveTicker } from "@/components/ui/live-ticker";
import { ReasonFeed } from "@/components/ui/reason-feed";
import { MainChart } from "@/components/chart/main-chart";
import { ChatRoom } from "@/components/community/chat-room";

export default function Home() {
  const [reasons, setReasons] = React.useState<Reason[]>([]);
  const [focusedTime, setFocusedTime] = React.useState<string | number | null>(null);

  // Initialize Data 
  React.useEffect(() => {
    const symbolInfo = SYMBOLS.find(s => s.id === currentSymbol) || SYMBOLS[0];
    const initialData = generateInitialData(1000, symbolInfo.price);
    setChartData(initialData);
    setManualMarkers([]);
    setVolatilityZones([]);
    setReasons([]); // Reset reasons
  }, [currentSymbol]);

  // ... (Simulation Effect remains same)
  React.useEffect(() => {
    if (chartData.length === 0) return;
    const interval = setInterval(() => {
      const lastCandle = chartData[chartData.length - 1];
      const symbolInfo = SYMBOLS.find(s => s.id === currentSymbol) || SYMBOLS[0];
      
      let volatilityMultiplier = 1;
      const activeZone = volatilityZones.find(z => {
         return (Date.now() / 1000) - Number(z.time) < (z.duration * 60);
      });
      if (activeZone) volatilityMultiplier = activeZone.type === "extreme" ? 5 : 2;

      const nextCandle = generateNextCandle(lastCandle, symbolInfo.volatility * volatilityMultiplier);
      setChartData(prev => [...prev.slice(1), nextCandle]); 
    }, 1000); 
    return () => clearInterval(interval);
  }, [currentSymbol, chartData, volatilityZones]); 

  const handleTrigger = (type: "trump" | "cpi" | "war" | "pump") => {
     const lastTime = chartData[chartData.length - 1]?.time;
     if (!lastTime) return;

     let markerColor = "#ef5350";
     let markerText = "Event";
     let markerShape = "arrowDown";
     let zoneType = "high";
     
     // Reason Feed Data
     let reasonTitle = "Market Event";
     let reasonDesc = "Significant market activity detected.";
     let sentiment: "bullish" | "bearish" | "neutral" = "neutral";
     let impact: "high" | "medium" | "low" = "medium";
     let tags = ["News"];

     switch (type) {
       case "trump":
         markerColor = "#ff9800";
         markerText = "Trump Tweet";
         markerShape = "arrowDown";
         zoneType = "extreme";
         reasonTitle = "Trump Posts on X";
         reasonDesc = "Former President comments on crypto regulation, sparking volatility.";
         sentiment = "bearish";
         impact = "high";
         tags = ["Trump", "Regulation"];
         break;
       case "cpi":
         markerColor = "#f44336";
         markerText = "High CPI";
         markerShape = "arrowDown";
         zoneType = "high";
         reasonTitle = "CPI Inflation Data";
         reasonDesc = "Inflation higher than expected (3.4%), reducing rate cut odds.";
         sentiment = "bearish";
         impact = "high";
         tags = ["Macro", "USD"];
         break;
       case "pump":
         markerColor = "#00e676";
         markerText = "Musk Pump";
         markerShape = "arrowUp";
         zoneType = "extreme";
         reasonTitle = "Elon Musk Tweet";
         reasonDesc = "Elon Musk tweets 'Doge', market reacts instantly.";
         sentiment = "bullish";
         impact = "high";
         tags = ["Elon", "Meme"];
         break;
     }

     // Add Marker
     setManualMarkers(prev => [...prev, {
        time: lastTime,
        position: markerShape === 'arrowUp' ? 'belowBar' : 'aboveBar',
        color: markerColor,
        shape: markerShape,
        text: markerText,
     }]);

     // Add Reason
     const newReason: Reason = {
        id: Date.now().toString(),
        title: reasonTitle,
        description: reasonDesc,
        sentiment: sentiment,
        timestamp: "Just now",
        tags: tags,
        impact: impact
     };
     setReasons(prev => [newReason, ...prev]);

     // Add Volatility Zone
     setVolatilityZones(prev => [...prev, {
        time: Date.now() / 1000, 
        duration: 10, 
        type: zoneType
     }]);
  };

  const tickerItems = [
    { symbol: "BTC/USD", price: "$98,420", change: "+4.2%", isUp: true },
    { symbol: "NQ", price: "21,050", change: "-1.2%", isUp: false },
    { symbol: "ES", price: "5,840", change: "-0.5%", isUp: false },
    { symbol: "GC", price: "2,045", change: "+0.8%", isUp: true },
    { symbol: "CL", price: "76.50", change: "+2.1%", isUp: true },
    { symbol: "NVDA", price: "$145.20", change: "-3.4%", isUp: false },
    { symbol: "TSLA", price: "$280.00", change: "+1.5%", isUp: true },
  ];

  return (
    <main className="min-h-screen w-full bg-black relative overflow-hidden text-neutral-200 font-sans selection:bg-cyan-500/30">
      <GridBackground className="min-h-screen w-full items-start overflow-y-auto">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col gap-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-6 pt-10 pb-4">
            <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500 tracking-tight">
              Why Is <span className="text-cyan-400">{currentSymbol.split('/')[0]}</span> Moving?
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto text-lg md:text-xl font-light">
              Real-time volatility tracking. <span className="text-cyan-500/80">Live Simulation Active</span>.
            </p>
          </div>

          {/* Ticker */}
          <div className="w-full -mx-4 md:mx-0">
             <LiveTicker items={tickerItems} speed="normal" />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Chart Area */}
            <div className="lg:col-span-8 min-h-[600px] border border-neutral-800 rounded-2xl bg-neutral-900/30 backdrop-blur-md p-1 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none z-10" />
              
              <div className="h-full w-full rounded-xl bg-[#131722] border border-neutral-800 flex flex-col">
                 {/* Chart Header */}
                 <div className="px-4 py-3 border-b border-[#2B2B43] flex justify-between items-center bg-[#1e222d] flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                       <SymbolSelector 
                          currentSymbol={currentSymbol} 
                          symbols={SYMBOLS} 
                          onSelect={setCurrentSymbol} 
                       />
                       <div className="hidden md:flex gap-4 text-sm font-medium text-[#d1d4dc]">
                          <span>1M</span>
                          <span className="text-[#2962FF]">5M</span>
                          <span>15M</span>
                          <span>1H</span>
                       </div>
                    </div>
                    
                    {/* Volatility Triggers */}
                    <VolatilityControlPanel onTrigger={handleTrigger} />
                 </div>
                 
                 {/* Main Chart */}
                 <div className="flex-1 w-full relative">
                    <MainChart 
                      data={chartData} 
                      markers={manualMarkers} 
                      volatilityZones={volatilityZones}
                      focusedTime={focusedTime}
                    />
                 </div>
              </div>
            </div>

            {/* Side Feed: Community & Chat */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[600px]">
              <ChatRoom className="h-full" />
            </div>
          </div>

          {/* Reason Feed Section */}
          <div className="w-full">
               <h2 className="text-2xl font-bold text-neutral-100 mb-6 flex items-center gap-2">
                 <span className="w-1 h-8 bg-cyan-500 rounded-full" />
                 Market Drivers
               </h2>
               <ReasonFeed 
                 reasons={reasons} 
                 onReasonClick={(r) => {
                    // Logic to find marker time corresponding to this reason if possible
                    // For now, simple interaction
                    console.log("Clicked:", r);
                 }} 
               />
               {reasons.length === 0 && (
                  <div className="text-center py-10 text-neutral-500 border border-neutral-800 rounded-xl bg-neutral-900/20">
                     No significant market drivers detected yet. <br/> Use the <b>Control Panel</b> above to simulate events.
                  </div>
               )}
          </div>
        </div>
      </GridBackground>
    </main>
  );
}
