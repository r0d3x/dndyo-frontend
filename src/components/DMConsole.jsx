import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2 } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import { getChatMessages, sendChatMessage, runAIResponse, attackLiveActor } from "../services/api";

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

    let displayName = "Player";
    let displayText = msg.text;

    // Parse out Name: Message if present
    const match = msg.text.match(/^([^:]+):\s*(.*)/s);
    if (match) {
        displayName = match[1];
        displayText = match[2];
    }

    // Helper to render text with @master highlighted
    const renderText = (text) => {
        if (!text) return null;

        // Check if message contains a system result
        const systemRegex = /_\[System Result: (.*?)\]_/g;
        if (systemRegex.test(text)) {
            const parts = text.split(systemRegex);
            return parts.map((part, i) => {
                // The split regex makes every alternating part the match group
                if (i % 2 !== 0) {
                    return (
                        <div key={i} className="mt-2 p-2 rounded bg-slate-900/80 border border-amber-500/30 text-amber-400 font-serif-dm text-[11px] tracking-wide shadow-inner">
                            🎲 {part}
                        </div>
                    );
                }

                // Normal text parsing for @master
                return part.split(/(@master)/gi).map((subPart, j) =>
                    subPart.toLowerCase() === '@master' ? (
                        <span key={`${i}-${j}`} className="text-amber-500 font-bold drop-shadow-md">{subPart}</span>
                    ) : (
                        subPart
                    )
                );
            });
        }

        const parts = text.split(/(@master)/gi);
        return parts.map((part, i) =>
            part.toLowerCase() === '@master' ? (
                <span key={i} className="text-amber-500 font-bold drop-shadow-md">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="mb-5 flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-serif-dm uppercase tracking-widest mb-1 mr-1">{displayName}</span>
            <div className="max-w-[85%] rounded-xl rounded-br-sm bg-slate-800/50 border border-slate-700/25 px-3.5 py-2.5">
                <div className="font-serif-dm text-[13px] leading-relaxed text-slate-300/90 whitespace-pre-wrap">
                    {renderText(displayText)}
                </div>
            </div>
        </div>
    );
}

/* ── DM Console (Right Panel) ─────────────────── */
export default function DMConsole() {
    const { gameId, gameState, activePlayerId } = useGame();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    // Get active speaker
    const players = gameState?.live_actors?.filter(la => la.role === "Player") || [];
    const activePlayerActor = players.find(p => p.actor_id === activePlayerId) || players[0];
    const speakerName = activePlayerActor?.name || "Player";

    // Initial load of messages
    useEffect(() => {
        if (!gameId) return;
        getChatMessages(gameId).then(data => {
            // Map the API schema to our UI schema
            const history = data.map(msg => ({
                id: msg.id,
                sender: msg.message.role === 'user' ? 'player' : 'dm',
                text: msg.message.content
            }));
            setMessages(history);
        }).catch(err => console.error("Failed to load history", err));
    }, [gameId]);

    /* Auto-scroll to bottom on new messages */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (forcedText = null) => {
        const textToProcess = (typeof forcedText === 'string') ? forcedText : input;

        if (!textToProcess.trim() || isThinking || !gameId) return;
        const userText = textToProcess.trim();
        setInput("");

        let messageToSend = `${speakerName}: ${userText}`;

        // Process Chat Commands
        if (userText.toLowerCase().startsWith('/roll')) {
            const match = userText.match(/\/roll\s+(?:(\d+)d)?(\d+)/i);
            const numDice = match?.[1] ? parseInt(match[1]) : 1;
            const diceFaces = match?.[2] ? parseInt(match[2]) : 20;

            let total = 0;
            const rolls = [];
            for (let i = 0; i < numDice; i++) {
                const roll = Math.floor(Math.random() * diceFaces) + 1;
                total += roll;
                rolls.push(roll);
            }
            messageToSend = `${speakerName}: ${userText}\n\n_[System Result: Rolled ${numDice}d${diceFaces} -> ${rolls.join(', ')} (Total: ${total})]_`;
        } else if (userText.toLowerCase().startsWith('/attack')) {
            const targetName = userText.substring(7).trim() || "enemy";
            const liveEnemies = gameState?.live_actors?.filter(la => la.role === "Enemy" && la.current_hp > 0) || [];
            const targetEnemy = liveEnemies.length > 0 ? liveEnemies[0] : null;

            if (targetEnemy) {
                try {
                    // Hackathon Demo: Massive guaranteed damage to quickly slay enemies for the demo flow
                    const result = await attackLiveActor(gameId, targetEnemy.id, 99, 10, 20, 100);
                    messageToSend = `${speakerName}: ${userText}\n\n_[System Result: SMITED ${targetEnemy.name}! 1d20 To Hit: ${result.attack_roll}. Damage: ${result.damage}]_`;
                } catch (e) {
                    console.error("Failed to attack backend API", e);
                    messageToSend = `${speakerName}: ${userText}\n\n_[System Result: Attack failed to process.]_`;
                }
            } else {
                messageToSend = `${speakerName}: ${userText}\n\n_[System Result: No living enemies in sight!]_`;
            }
        }

        // Optimistic UI update for user message
        const optimisticUserMsg = { id: Date.now(), sender: "player", text: messageToSend };
        setMessages((prev) => [...prev, optimisticUserMsg]);

        try {
            await sendChatMessage(gameId, messageToSend);

            // Only trigger AI if they explicitly mention @master, or if they just used a command 
            // commands implicitly notify the master so it can react to the roll
            const needsAI = userText.toLowerCase().includes("@master") || userText.startsWith("/");

            if (needsAI) {
                setIsThinking(true);
                const aiMsgId = Date.now() + 1;
                setMessages((prev) => [...prev, { id: aiMsgId, sender: "dm", text: "" }]);

                // Stream AI Response
                await runAIResponse(gameId, (chunk, fullText) => {
                    setMessages((prev) =>
                        prev.map(msg => msg.id === aiMsgId ? { ...msg, text: fullText } : msg)
                    );
                });
            }
        } catch (error) {
            console.error("Failed to send message or fetch AI response", error);
            if (userText.toLowerCase().includes("@master") || userText.startsWith("/")) {
                setMessages((prev) => [...prev, { id: Date.now(), sender: "dm", text: "_[The DM is temporarily unreachable...]_" }]);
            }
        } finally {
            setIsThinking(false);
        }
    };

    // Listen for programmatic chat commands
    useEffect(() => {
        const handleCommand = (e) => {
            if (e.detail) {
                handleSend(e.detail);
            }
        };
        window.addEventListener('trigger-chat-command', handleCommand);
        return () => window.removeEventListener('trigger-chat-command', handleCommand);
        // We include handleSend's dependencies here to ensure latest state is captured
    }, [gameId, isThinking, speakerName, messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full rpg-panel-bg overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
            {/* ── Audio indicator (Only animate when thinking) ───────── */}
            <div className={`transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-30'}`}>
                <AudioIndicator />
            </div>

            {/* ── Chat log ─────────────────────────────── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[80%] text-center px-6 animate-in fade-in duration-700">
                        <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Volume2 className="w-6 h-6 text-amber-500/80 glow-gold" />
                        </div>
                        <h3 className="font-serif-dm text-lg text-amber-400 mb-2 glow-gold-text">The Dungeon Master Listens</h3>
                        <p className="text-[13px] text-slate-400 leading-relaxed max-w-xs mb-6">
                            Describe your actions or ask questions about the world.
                        </p>
                        <div className="flex flex-col gap-3 w-full max-w-[200px] text-left">
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-700/50 shadow-inner">
                                <span className="block text-[10px] text-amber-500/70 tracking-wider uppercase mb-1 font-bold">Invoke the DM</span>
                                <span className="font-serif-dm text-sm text-slate-200">Include <strong className="text-amber-400">@master</strong> in your message.</span>
                            </div>
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-700/50 shadow-inner">
                                <span className="block text-[10px] text-amber-500/70 tracking-wider uppercase mb-1 font-bold">Perform Actions</span>
                                <span className="font-serif-dm text-sm text-slate-200">Use <strong className="text-amber-400">/roll 1d20</strong></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} />
                    ))
                )}
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
