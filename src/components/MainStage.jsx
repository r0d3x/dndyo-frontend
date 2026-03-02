import React, { useState, useEffect, useRef } from "react";
import { Dice5, Skull, Target, Swords, Info } from "lucide-react";
import { character } from "../data/mockData";
import { useGame } from "../contexts/GameContext";
import { getGame } from "../services/api";

/*  Walkable Areas (Static map collision)  */
const walkableAreas = [
    // Main 3x3 Rooms Grid
    { xMin: 30, xMax: 70, yMin: 25, yMax: 65 }, // Center
    { xMin: 35, xMax: 65, yMin: 4, yMax: 26 }, // North
    { xMin: 40, xMax: 60, yMin: 64, yMax: 96 }, // South
    { xMin: 4, xMax: 30, yMin: 35, yMax: 55 }, // West
    { xMin: 70, xMax: 96, yMin: 35, yMax: 55 }, // East
    { xMin: 4, xMax: 30, yMin: 4, yMax: 30 }, // NW
    { xMin: 70, xMax: 96, yMin: 4, yMax: 30 }, // NE
    { xMin: 4, xMax: 30, yMin: 70, yMax: 96 }, // SW
    { xMin: 70, xMax: 96, yMin: 70, yMax: 96 }, // SE

    // Connecting doorways (very generous overlaps)
    { xMin: 20, xMax: 40, yMin: 15, yMax: 25 }, // NW <-> North
    { xMin: 15, xMax: 25, yMin: 20, yMax: 40 }, // NW <-> West
    { xMin: 60, xMax: 80, yMin: 15, yMax: 25 }, // North <-> NE
    { xMin: 75, xMax: 85, yMin: 20, yMax: 40 }, // NE <-> East
    { xMin: 15, xMax: 25, yMin: 50, yMax: 75 }, // West <-> SW
    { xMin: 20, xMax: 45, yMin: 75, yMax: 85 }, // SW <-> South
    { xMin: 55, xMax: 80, yMin: 75, yMax: 85 }, // South <-> SE
    { xMin: 75, xMax: 85, yMin: 50, yMax: 75 }, // East <-> SE

    // Core connections to center
    { xMin: 40, xMax: 60, yMin: 20, yMax: 30 }, // North <-> Center
    { xMin: 40, xMax: 60, yMin: 60, yMax: 70 }, // South <-> Center
    { xMin: 25, xMax: 35, yMin: 40, yMax: 50 }, // West <-> Center
    { xMin: 65, xMax: 75, yMin: 40, yMax: 50 }, // East <-> Center
];

const isValidMove = (x, y) => {
    return walkableAreas.some(area =>
        x >= area.xMin && x <= area.xMax &&
        y >= area.yMin && y <= area.yMax
    );
};

export default function MainStage() {
    const { gameId, gameState, fetchState, activePlayerId } = useGame();
    const [playerPositions, setPlayerPositions] = useState({});
    const [enemies, setEnemies] = useState([]);

    // Story Info State
    const [showStoryModal, setShowStoryModal] = useState(false);
    const [storyLoading, setStoryLoading] = useState(false);
    const [chapters, setChapters] = useState([]);

    const handleOpenStory = (e) => {
        if (e) e.stopPropagation();
        setShowStoryModal(true);
    };

    // Fetch story chapters on mount or game load to show the latest on the HUD
    useEffect(() => {
        if (!gameId) return;
        const loadStory = async () => {
            setStoryLoading(true);
            try {
                const gameData = await getGame(gameId);
                setChapters(gameData.current_chapters || []);
            } catch (error) {
                console.error("Failed to fetch story chapters", error);
                setChapters(["Failed to load the story script..."]);
            } finally {
                setStoryLoading(false);
            }
        };
        loadStory();
    }, [gameId]);

    // Note: State polling interval is now handled globally in GameContext.jsx

    // Reconcile backend live actors with frontend positions
    useEffect(() => {
        if (!gameState?.live_actors) return;

        // Dynamic spawn generation near the center, avoiding overlaps
        const generateSpawnPoint = (existingPositions) => {
            let x, y;
            let attempts = 0;
            let overlap;
            do {
                // Pick a spot near the center (40-60%)
                x = 40 + Math.random() * 20;
                y = 40 + Math.random() * 20;

                // Check if it's too close (within 5% distance) of any existing pos
                overlap = existingPositions.some(p => Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5);
                attempts++;
            } while (overlap && attempts < 10);
            return { x, y };
        };

        setEnemies(prev => {
            const currentPositions = prev.map(e => e.pos);

            return gameState.live_actors.filter(la => la.role === "Enemy" && la.current_hp > 0).map((liveActor) => {
                const existing = prev.find(e => e.id === liveActor.actor_id);
                let pos = existing?.pos;

                if (!pos) {
                    pos = generateSpawnPoint(currentPositions);
                    currentPositions.push(pos);
                }

                return {
                    id: liveActor.actor_id,
                    name: liveActor.name || `Monster ${liveActor.actor_id}`,
                    hp: liveActor.current_hp,
                    maxHp: liveActor.max_hp || 20,
                    pos: pos
                };
            });
        });
    }, [gameState]);

    const handleMapClick = (e) => {
        // Prevent moving if they click a button or overlay
        if (e.target.closest("button")) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (isValidMove(x, y) && activePlayerId) {
            setPlayerPositions(prev => ({
                ...prev,
                [activePlayerId]: { x, y }
            }));
        }
    };

    // Keyboard Movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only move if we aren't focused on an input
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            if (!activePlayerId) return;
            const currentPos = playerPositions[activePlayerId] || { x: 50, y: 80 };
            let newX = currentPos.x;
            let newY = currentPos.y;
            let moved = false;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY -= STEP; moved = true; break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY += STEP; moved = true; break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX -= STEP; moved = true; break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX += STEP; moved = true; break;
                default:
                    return;
            }

            if (moved) {
                if (isValidMove(newX, newY)) {
                    setPlayerPositions(prev => ({
                        ...prev,
                        [activePlayerId]: { x: newX, y: newY }
                    }));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPositions, activePlayerId]);

    return (
        <div
            className="relative h-full w-full overflow-hidden bg-cover bg-center cursor-crosshair shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
            style={{ backgroundImage: `url('${gameState?.current_map_image_url || '/map.png'}')`, backgroundColor: '#020617' }}
            onClick={handleMapClick}
        >
            {/* ── Scene Title Overlay ──────────────────── */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent p-6 pb-12 z-20 pointer-events-none flex justify-between items-start">
                <div>
                    <h1 className="font-serif-dm text-2xl font-semibold text-amber-400/90 glow-gold-text tracking-wide drop-shadow-lg">
                        {gameState?.current_map_name || 'The Unknown'}
                    </h1>
                    <p className="font-serif-dm text-[11px] text-slate-300 drop-shadow-md mt-1.5 tracking-[0.15em] uppercase">
                        Current Location
                    </p>
                </div>
                <button
                    onClick={handleOpenStory}
                    className="pointer-events-auto p-2 rounded-full bg-slate-900/50 border border-amber-500/30 text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] group flex items-center gap-2"
                >
                    <Info className="w-4 h-4" />
                    <span className="font-serif-dm text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden">Tale</span>
                </button>
            </div>

            {/* ── Fog of War Overlay ──────────────────── */}
            {/* 
                Calculates the reveal radius based on chapter progression.
                0 chapters = 15% revealed (starting area only)
                1 chapter = 40% revealed
                2 chapters = 70% revealed
                3+ chapters = 100% revealed (no fog)
            */}
            <div
                className="absolute inset-0 pointer-events-none z-10 transition-all duration-1000 ease-in-out mix-blend-multiply"
                style={{
                    background: `radial-gradient(
                        circle at 50% 50%, 
                        transparent 0%, 
                        transparent ${chapters.length >= 3 ? 100 : chapters.length === 2 ? 70 : chapters.length === 1 ? 40 : 15}%, 
                        rgba(0, 0, 0, 0.95) ${chapters.length >= 3 ? 100 : chapters.length === 2 ? 85 : chapters.length === 1 ? 55 : 30}%, 
                        #000 100%
                    )`
                }}
            />
            {/* Adds a thematic cloudy/smoky texture to the fog */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-40 transition-opacity duration-1000 mix-blend-screen bg-repeat"
                style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")',
                    opacity: chapters.length >= 3 ? 0 : 0.3
                }}
            />

            {/* Player Tokens */}
            {gameState?.live_actors?.filter(la => la.role === "Player").map((player, idx) => {
                const pos = playerPositions[player.actor_id] || { x: 45 + (idx * 5), y: 80 };
                const isMainPlayer = player.actor_id === activePlayerId;

                return (
                    <div
                        key={player.actor_id}
                        className={`absolute w-10 h-10 rounded-full border-2 ${isMainPlayer ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)] z-20 z-index-top scale-110' : 'border-slate-500 shadow-md z-10 opacity-80'} flex items-center justify-center transition-all duration-300 ease-out pointer-events-none bg-slate-900 overflow-hidden`}
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        title={player.name}
                    >
                        {player.image_url ? (
                            <img src={player.image_url} className="w-full h-full object-cover" alt={player.name} />
                        ) : (
                            <Swords className="w-5 h-5 text-amber-400 drop-shadow-md" />
                        )}
                    </div>
                );
            })}

            {/* Enemy Tokens */}
            {enemies.map(enemy => (
                <div
                    key={enemy.id}
                    className="absolute flex flex-col items-center z-10 pointer-events-none transition-all duration-300"
                    style={{
                        left: `${enemy.pos.x}%`,
                        top: `${enemy.pos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Floating Info */}
                    <div className="absolute bottom-[110%] flex flex-col items-center mb-1 drop-shadow-lg">
                        <span className="text-[9px] font-serif-dm font-bold tracking-wider text-red-100 bg-slate-950/80 px-1.5 py-0.5 rounded-sm mb-1 whitespace-nowrap border border-red-500/30">
                            {enemy.name}
                        </span>
                        <div className="w-10 h-1.5 bg-slate-950/90 rounded-full border border-slate-700/80 overflow-hidden shadow-inner flex">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Enemy Circle */}
                    <div className="w-10 h-10 rounded-full border-2 border-red-600 bg-slate-900/90 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.7)] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-900/20"></div>
                        <Target className="w-5 h-5 text-red-500 drop-shadow-md" />
                    </div>
                </div>
            ))}

            {/* ── UI Controls ─────────────────────────── */}

            {/* ── Story Context Ticker ────────────────── */}
            {chapters.length > 0 && (
                <div className="absolute bottom-6 left-6 right-48 pointer-events-none z-20">
                    <div className="bg-slate-950/85 backdrop-blur-md border-t border-x border-amber-900/40 border-b border-b-amber-500/40 p-5 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-start gap-4 transition-all hover:bg-slate-950/95">
                        <div className="shrink-0 mt-1 p-2 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-inner">
                            <Info className="w-4 h-4 text-amber-500/80" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-serif-dm text-[10px] text-amber-500/70 tracking-[0.25em] uppercase mb-1.5 drop-shadow-md font-bold">The Tale Unfolds</h4>
                            <p className="font-serif-dm text-[13px] leading-relaxed text-slate-300 drop-shadow-md line-clamp-2 md:line-clamp-3 text-justify">
                                {chapters[chapters.length - 1]}
                            </p>
                            <button
                                onClick={handleOpenStory}
                                className="pointer-events-auto mt-2.5 font-serif-dm text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-widest transition-colors flex items-center gap-1.5 glow-gold-text group/btn"
                            >
                                View Chronicles <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Quick Action Buttons ───────────────────────── */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
                {/* Attack Button (Only visible if enemies exist) */}
                {enemies.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('trigger-chat-command', { detail: '/attack nearest enemy' }));
                        }}
                        className="px-4 py-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 font-serif-dm text-sm tracking-widest uppercase hover:bg-red-900/90 hover:border-red-400 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-2 transition-all group"
                    >
                        <Swords className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-md text-red-500" />
                        Attack
                    </button>
                )}

                {/* Roll Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('trigger-chat-command', { detail: '/roll 1d20' }));
                    }}
                    className="px-4 py-2.5 rounded-lg bg-slate-900/95 border border-amber-500/40 text-amber-400 font-serif-dm text-sm tracking-widest uppercase hover:bg-slate-800 hover:border-amber-400 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-2 transition-all group"
                >
                    <Dice5 className="w-5 h-5 group-hover:rotate-12 transition-transform drop-shadow-md text-amber-500" />
                    Roll Check
                </button>
            </div>

            {/* ── Story Info Modal ────────────────────── */}
            {showStoryModal && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <div className="absolute inset-0 pointer-events-none" onClick={() => setShowStoryModal(false)}></div>
                    <div className="relative z-50 bg-slate-900/95 p-8 rounded-xl border border-amber-500/30 shadow-2xl max-w-lg w-[90%] max-h-[80%] flex flex-col">
                        <button
                            onClick={() => setShowStoryModal(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-amber-400 transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="font-serif-dm text-2xl text-amber-400 mb-2 glow-gold-text tracking-wide text-center">The Adventure Thus Far</h2>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6"></div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            {storyLoading ? (
                                <p className="text-amber-500/50 text-center text-sm italic py-10 font-serif-dm">Unearthing the chronicles...</p>
                            ) : (
                                <div className="space-y-6">
                                    {chapters.length > 0 ? chapters.map((chapter, i) => (
                                        <div key={i} className="font-serif-dm text-sm leading-relaxed text-slate-300/90 text-justify">
                                            {chapter}
                                        </div>
                                    )) : (
                                        <p className="font-serif-dm text-sm leading-relaxed text-slate-400 text-center italic">
                                            The pages are empty. The story has yet to begin.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
