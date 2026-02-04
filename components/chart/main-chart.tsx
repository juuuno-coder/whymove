"use client";

  markers?: any[];
  volatilityZones?: {
    time: string | number; // Support timestamp
    duration: number; // Duration in candles (approx) or time
    type: "high" | "extreme"; 
  }[];
  focusedTime?: string | number | null; 
  colors?: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  };
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // New: Volatility Overlay Logic
  // Since Lightweight charts are canvas, we can overlay HTML/CSS divs for "Clouds" or "Warning Zones"
  // absolute positioned on top of the chart container.

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    // Cleanup existing content to prevent duplication on HMR
    chartContainerRef.current.innerHTML = '';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#131722" }, // TV Dark Bg
        textColor: "#d1d4dc",
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 500,
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      crosshair: {
        mode: 1, // Magnet
        vertLine: {
           width: 1,
           color: "#758696",
           style: 3, // Dashed
           labelBackgroundColor: "#758696",
        },
        horzLine: {
           width: 1,
           color: "#758696",
           style: 3, // Dashed
           labelBackgroundColor: "#758696",
        },
      },
      timeScale: {
         borderColor: "#2B2B43",
      },
      rightPriceScale: {
         borderColor: "#2B2B43",
      }
    });
    
    chartRef.current = chart;

    const isCandlestick = 'open' in (data[0] || {});

    let series: ISeriesApi<"Candlestick"> | ISeriesApi<"Area">;

    if (isCandlestick) {
       series = chart.addCandlestickSeries({
          upColor: '#089981', // TV Green
          downColor: '#f23645', // TV Red
          borderVisible: false, 
          wickUpColor: '#089981', 
          wickDownColor: '#f23645',
       });
       series.setData(data as any);
    } else {
       series = chart.addAreaSeries({
        lineColor: colors.lineColor,
        topColor: colors.areaTopColor,
        bottomColor: colors.areaBottomColor,
      });
      series.setData(data as any);
    }

    if (markers) {
       series.setMarkers(markers);
    }

    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, colors, markers]);

  return (
    <div ref={chartContainerRef} className="w-full h-full relative">
      {/* Volatility Warning Overlay */}
      {volatilityZones && volatilityZones.map((zone, idx) => (
         <div 
           key={idx}
           className="absolute top-10 right-10 bg-red-900/20 border border-red-500/50 p-4 rounded-xl backdrop-blur-md animate-pulse z-20 flex items-center gap-3"
         >
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <div>
               <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider">Warning: {zone.type} Volatility</h4>
               <p className="text-xs text-red-200/70">Potential ±3.5% move expected</p>
            </div>
         </div>
      ))}
    </div>
  );
};
