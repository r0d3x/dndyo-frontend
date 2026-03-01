import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2 } from "lucide-react";
import { chatHistory as initialChat } from "../data/mockData";

/* ── Audio Waveform Indicator ─────────────────── */
function AudioIndicator() {
    const bars = [0, 1, 2, 3, 4, 5, 6];
    return (
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/40">
            <Volume2 className="w-3.5 h-3.5 text-amber-500/60" />
            <span className="font-serif-dm text-[10px] tracking-[0.15em] text-amber-400/50 italic">
                AI Dungeon Master is Speaking
            </span>
            <div className="flex items-center gap-[2px] ml-auto h-4">
                {bars.map((i) => (
                    <span
                        key={i}
                        className="wave-bar inline-block w-[2px] rounded-full bg-amber-500/50"
                        style={{
                            height: "12px",
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── Chat Message ─────────────────────────────── */
function ChatMessage({ msg }) {
    const isDM = msg.sender === "dm";

    if (isDM) {
        return (
            <div className="mb-5">
                <p className="font-serif-dm text-[14.5px] leading-[1.75] text-amber-100/75">
                    {msg.text}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-5 flex justify-end">
            <div className="max-w-[85%] rounded-xl rounded-br-sm bg-slate-800/50 border border-slate-700/25 px-3.5 py-2.5">
                <p className="font-serif-dm text-[13px] leading-relaxed text-slate-300/90">
                    {msg.text}
                </p>
            </div>
        </div>
    );
}

/* ── DM Console (Right Panel) ─────────────────── */
export default function DMConsole() {
    const [messages, setMessages] = useState(initialChat);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    /* Auto-scroll to bottom on new messages */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg = {
            id: messages.length + 1,
            sender: "player",
            text: input.trim(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");

        /* Simulated DM response after a delay */
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    sender: "dm",
                    text: "The shadows in the tavern seem to shift as you speak. The bard's music falters for a moment before picking back up. Something has changed in the air — an almost imperceptible tension, like the quiet before a storm. Vex notices it too, their hand drifting to the blade at their hip.",
                },
            ]);
        }, 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 panel-border-l overflow-hidden">
            {/* ── Audio indicator ──────────────────────── */}
            <AudioIndicator />

            {/* ── Chat log ─────────────────────────────── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
            >
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}
            </div>

            {/* ── Input area ───────────────────────────── */}
            <div className="p-3 border-t border-slate-800/40">
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/30 border border-slate-700/25 focus-within:border-amber-500/30 transition-colors px-3 py-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What do you do?..."
                        className="flex-1 bg-transparent font-serif-dm text-[13px] text-slate-300 placeholder:text-slate-600 outline-none py-1.5"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 rounded-lg hover:bg-amber-500/5 text-amber-500/50 hover:text-amber-400/70 transition-colors cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
