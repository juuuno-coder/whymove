"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Send, User, Zap, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, push, serverTimestamp, query, limitToLast, orderByChild } from "firebase/database";

// Types
export type MessageType = "chat" | "alert" | "donation";

export interface ChatMessage {
  id: string;
  type: MessageType;
  user?: string;
  text: string;
  timestamp: string | number;
  amount?: string;
  side?: "bull" | "bear";
  sentiment?: "bullish" | "bearish" | "neutral";
}

// Initial/Fallback Data
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", type: "chat", text: "System: Connecting to live channel...", timestamp: "Now" },
];

export const ChatRoom = ({ className }: { className?: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("Guest");

  // Load username
  useEffect(() => {
    const savedName = localStorage.getItem("whymove_username");
    if (savedName) setUsername(savedName);
    else {
        const newName = `Guest${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem("whymove_username", newName);
        setUsername(newName);
    }
  }, []);

  // Subscribe to Firebase
  useEffect(() => {
    const messagesRef = query(ref(rtdb, "messages"), orderByChild("timestamp"), limitToLast(50));
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const loadedMessages = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        // Sort by timestamp
        loadedMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setMessages(loadedMessages);
      } else {
        setMessages([]); 
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    try {
        await push(ref(rtdb, "messages"), {
            user: username,
            text: input,
            type: "chat",
            timestamp: serverTimestamp(),
        });
        setInput("");
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Message failed to send. Check console.");
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-[#131722] border border-[#2B2B43] rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2B2B43] bg-[#1e222d] flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="font-bold text-neutral-200">Live Chat</span>
        </div>
        <div className="text-xs text-neutral-500 flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => {
            const newName = prompt("Enter new username:", username);
            if(newName) {
                setUsername(newName);
                localStorage.setItem("whymove_username", newName);
            }
        }}>
           <User size={12} />
           {username}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-neutral-700">
         {messages.length === 0 && (
             <div className="text-center text-neutral-600 py-10 opacity-50">
                 Connecting to secure channel... <br/>
                 (If this persists, check .env.local)
             </div>
         )}

         {messages.map((msg) => (
           <div key={msg.id} className={cn("animate-in fade-in slide-in-from-bottom-2 duration-300", 
               msg.type === 'donation' ? "border-l-4 border-yellow-400 bg-yellow-400/10 p-2 rounded" : 
               msg.type === 'alert' ? (msg.side === 'bull' ? "bg-green-500/10 border-l-2 border-green-500 p-1" : "bg-red-500/10 border-l-2 border-red-500 p-1") : ""
           )}>
              {/* Chat Message */}
              {msg.type === 'chat' && (
                 <div className="flex items-start gap-2">
                    <span className={cn("font-bold whitespace-nowrap", msg.user === username ? "text-cyan-400" : "text-neutral-400")}>
                        {msg.user}:
                    </span>
                    <span className="text-neutral-300 break-words leading-relaxed">{msg.text}</span>
                 </div>
              )}

              {/* Alert Message */}
              {msg.type === 'alert' && (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      {msg.side === 'bull' ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
                      <span className={msg.side === 'bull' ? "text-green-500" : "text-red-500"}>{msg.text}</span>
                  </div>
              )}

              {/* Donation Message */}
              {msg.type === 'donation' && (
                  <div className="flex items-center gap-2 text-yellow-500">
                      <DollarSign size={16} fill="currentColor" />
                      <span className="font-bold">{msg.user} donated {msg.amount}!</span>
                      <span className="text-white text-xs ml-2">"{msg.text}"</span>
                  </div>
              )}
           </div>
         ))}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#1e222d] border-t border-[#2B2B43] flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 bg-[#131722] border border-[#2B2B43] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <Send size={16} />
        </button>
      </form>
    </div>
  );
};
