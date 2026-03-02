import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

export default function Onboarding() {
    const { createDemoGame, joinGame, isLoading } = useGame();
    const [joinId, setJoinId] = useState("");

    const handleCreate = () => {
        createDemoGame();
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (joinId.trim()) {
            joinGame(joinId.trim());
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center p-6 rpg-panel-bg relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header Content */}
            <div className="text-center mb-12 relative z-10 w-full max-w-4xl">
                <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">Adventure Lobby</p>
                <h1 className="text-5xl md:text-6xl text-white font-serif-dm mb-6 drop-shadow-md">
                    Create or join a campaign
                </h1>
                <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
                    Start fresh with your own narrative or tap into an existing table.
                </p>

                {/* Quick Instructions */}
                <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-5 max-w-2xl mx-auto flex flex-col md:flex-row gap-6 text-left shadow-inner">
                    <div className="flex-1">
                        <h3 className="text-amber-500 font-serif-dm mb-2 flex items-center gap-2"><span className="text-xl">🎲</span> Rolling & Actions</h3>
                        <p className="text-slate-300 text-xs leading-relaxed">Type <strong>/roll 1d20</strong> or <strong>/attack target</strong> in the chat to perform checks and combat actions.</p>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-amber-500 font-serif-dm mb-2 flex items-center gap-2"><span className="text-xl">🐉</span> The AI Master</h3>
                        <p className="text-slate-300 text-xs leading-relaxed">Tag <strong>@master</strong> in your chat messages to invoke the AI Dungeon Master and advance the story.</p>
                    </div>
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">

                {/* Primary Card: Create Game */}
                <div className="bg-[#0b1120] border border-amber-700/50 rounded-xl p-8 shadow-[0_0_20px_rgba(180,83,9,0.2)] flex flex-col relative overflow-hidden group hover:border-amber-600 transition-colors duration-300">
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-50 pointer-events-none"></div>

                    <div className="flex justify-between items-baseline mb-8 relative z-10">
                        <h2 className="text-3xl text-white font-serif-dm">New Game</h2>
                        <span className="text-amber-500/80 font-serif-dm italic text-sm">World Building</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-8 border-b border-white/5 pb-6">
                        Forge a new realm and spawn the original cast. As the host, you will seed the world with monsters and set the stage for your party.
                    </p>

                    <div className="mt-auto relative z-10">
                        <button
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "Forging..." : "Create Game"}
                        </button>
                    </div>
                </div>

                {/* Secondary Card: Join Game */}
                <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-8 flex flex-col relative shadow-lg">
                    <div className="flex justify-between items-baseline mb-8">
                        <h2 className="text-3xl text-white font-serif-dm opacity-90">Join a game</h2>
                        <span className="text-cyan-600/60 font-serif-dm italic text-sm">Existing World</span>
                    </div>

                    <form onSubmit={handleJoin} className="flex flex-col flex-1">
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
                                Campaign ID
                            </label>
                            <input
                                type="text"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                placeholder="Enter access code..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-600/50 transition-colors"
                            />
                        </div>

                        <div className="mt-auto">
                            <button
                                type="submit"
                                disabled={isLoading || !joinId.trim()}
                                className="w-full py-4 bg-transparent border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 font-bold uppercase tracking-wider rounded-full transition-all duration-300 disabled:opacity-50"
                            >
                                {isLoading ? "Joining..." : "Join Game"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
