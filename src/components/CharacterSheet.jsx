import React, { useState } from "react";
import {
    Swords,
    Wind,
    Brain,
    Sparkles,
    Package,
    Shield,
} from "lucide-react";
import ItemIcon from "./ItemIcons";
import { useGame } from "../contexts/GameContext";

const statIcons = {
    strength: Swords,
    dexterity: Wind,
    intelligence: Brain,
    charisma: Sparkles,
};

const statLabels = {
    strength: "STR",
    dexterity: "DEX",
    intelligence: "INT",
    charisma: "CHA",
};

/* ── Stat Card ──────────────────────────────────── */
function StatCard({ statKey, value }) {
    const Icon = statIcons[statKey];
    const modifier = Math.floor((value - 10) / 2);
    const formattedMod = modifier >= 0 ? `+${modifier}` : `${modifier}`;

    return (
        <div className="rpg-stat-card flex flex-col items-center justify-center gap-0.5 p-3 cursor-default transition-all">
            <Icon className="w-5 h-5 text-amber-500/50 mb-1" />
            <span className="font-serif-dm text-[34px] font-bold leading-none rpg-text-gold">{value}</span>
            <span className="font-serif-dm text-[10px] uppercase tracking-[0.25em] text-amber-500/60 mt-1 font-bold">
                {statLabels[statKey]}
            </span>
            {/* Bonus Modifier */}
            <span className="absolute top-1.5 right-1.5 text-[11px] font-bold text-amber-400 drop-shadow-md">
                {formattedMod}
            </span>
        </div>
    );
}

/* ── Rarity Colors ──────────────────────────────── */
const rarityBorders = {
    common: "border-slate-600/50 hover:border-slate-500",
    rare: "border-blue-500/50 hover:border-blue-400/80 shadow-[inset_0_0_8px_rgba(59,130,246,0.2)]",
    epic: "border-purple-500/50 hover:border-purple-400/80 shadow-[inset_0_0_8px_rgba(168,85,247,0.2)]",
    legendary: "border-amber-500/60 hover:border-amber-400 shadow-[inset_0_0_12px_rgba(245,158,11,0.3)]",
};

/* ── Inventory Slot ─────────────────────────────── */
function InventorySlot({ item }) {
    const borderClass = rarityBorders[item.rarity] || rarityBorders.common;

    return (
        <div className={`group relative aspect-square flex items-center justify-center rpg-inventory-slot cursor-pointer ${borderClass} transition-all duration-300`}>
            <span className="text-amber-500/70 group-hover:text-amber-400 transition-colors drop-shadow-md">
                <ItemIcon icon={item.icon} size={20} />
            </span>

            {/* Quantity badge */}
            {item.qty > 1 && (
                <span className="absolute bottom-0.5 right-0.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-sm bg-slate-900/90 border border-slate-700/50 text-[8px] font-bold text-amber-400 px-0.5 shadow-sm">
                    {item.qty}
                </span>
            )}

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/95 border border-amber-500/30 px-3 py-1.5 text-[11px] font-serif-dm text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
                <span className="block">{item.name}</span>
                <span className={`block text-[9px] capitalize mt-0.5 ${item.rarity === 'legendary' ? 'text-amber-400' :
                    item.rarity === 'epic' ? 'text-purple-400' :
                        item.rarity === 'rare' ? 'text-blue-400' : 'text-slate-400'
                    }`}>{item.rarity} Item</span>
            </div>
        </div>
    );
}

/* ── Section Label ──────────────────────────────── */
function SectionLabel({ icon: Icon, children }) {
    return (
        <div className="section-header mb-2">
            {Icon && <Icon className="w-3 h-3 text-amber-500/60" />}
            <span className="font-serif-dm text-[11px] tracking-[0.12em] text-amber-400/70">
                {children}
            </span>
        </div>
    );
}

/* ── Character Sheet (Left Panel) ───────────────── */
export default function CharacterSheet() {
    const { gameState, activePlayerId, setActivePlayerId } = useGame();

    // Pull all player actors
    const players = gameState?.live_actors?.filter(la => la.role === "Player") || [];

    // If activePlayerId isn't valid, default to the first player
    const activePlayerActor = players.find(p => p.actor_id === activePlayerId) || players[0];

    const currentHp = activePlayerActor?.current_hp ?? 0;
    const maxHp = activePlayerActor?.max_hp ?? 1;
    const level = activePlayerActor?.level ?? 1;
    const armorClass = activePlayerActor?.armor_class ?? 10;
    const charName = activePlayerActor?.name ?? "Unknown";
    const charClass = activePlayerActor?.character_class ?? "Class";
    const avatarUrl = activePlayerActor?.image_url ?? "/avatar.png";

    const liveStats = {
        strength: activePlayerActor?.strength ?? 10,
        dexterity: activePlayerActor?.dexterity ?? 10,
        intelligence: activePlayerActor?.intelligence ?? 10,
        charisma: activePlayerActor?.charisma ?? 10,
    };

    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'abilities'

    // Calculate percentages
    const hpPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    const xpCurrent = 150;
    const xpMax = 300;
    const xpPercent = (xpCurrent / xpMax) * 100;

    return (
        <div className="flex flex-col h-full rpg-panel-bg overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">

            {/* ── Player Selector (If Multiple) ───────── */}
            {players.length > 1 && (
                <div className="flex justify-center gap-3 pt-4 px-4 relative z-20">
                    {players.map(p => {
                        const isSelected = activePlayerActor?.actor_id === p.actor_id;
                        return (
                            <button
                                key={p.actor_id}
                                onClick={() => setActivePlayerId(p.actor_id)}
                                className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${isSelected ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-amber-500/50'}`}
                                title={p.name}
                            >
                                <img src={p.image_url || "/avatar.png"} alt={p.name} className="w-full h-full object-cover" />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Hero Section (Avatar & Nameplate) ───── */}
            <div className={`p-6 pb-2 flex flex-col items-center relative z-10 ${players.length > 1 ? 'pt-2' : ''}`}>
                <div className="relative w-36 h-36 mb-2">
                    <div className="w-full h-full rpg-avatar-frame overflow-hidden bg-[#050403]">
                        <img
                            src={avatarUrl}
                            alt={charName}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* AC Badge */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 flex items-center justify-center drop-shadow-2xl z-20">
                        <Shield className="absolute inset-0 w-full h-full text-slate-300 fill-slate-900 drop-shadow-md" strokeWidth={1.5} />
                        <div className="relative flex flex-col items-center justify-center mt-[-3px]">
                            <span className="font-serif-dm text-base font-bold text-white tracking-widest leading-none rpg-text-gold ml-[3px]">{armorClass}</span>
                        </div>
                    </div>
                </div>

                {/* Nameplate plaque */}
                <div className="text-center w-full max-w-[90%] rpg-plaque py-2.5 rounded-[2px] z-10 -mt-2">
                    <h2 className="font-serif-dm text-lg font-bold rpg-text-gold tracking-wide">
                        {charName}
                    </h2>
                    <p className="font-serif-dm text-[9px] tracking-[0.2em] text-amber-500/50 mt-1 uppercase font-bold">
                        Level {level} · {charClass}
                    </p>
                </div>
            </div>

            {/* ── Status Bars ─────────────────────────── */}
            <div className="px-5 pt-3 space-y-3 relative z-10">
                {/* HP Bar */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-dm text-[11px] tracking-[0.1em] text-red-500 font-bold drop-shadow-sm">
                            Health
                        </span>
                        <span className="font-serif-dm text-[11px] text-red-200/50 tabular-nums">
                            {currentHp} / {maxHp}
                        </span>
                    </div>
                    <div className="h-3.5 w-full rpg-bar-track overflow-hidden">
                        <div
                            className={`bar-fill h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${currentHp <= maxHp * 0.25 ? "animate-pulse" : ""}`}
                            style={{ width: `${Math.max(0, hpPercent)}%` }}
                        />
                    </div>
                </div>

                {/* XP Bar */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-dm text-[11px] tracking-[0.1em] text-amber-500 font-bold drop-shadow-sm">
                            Experience
                        </span>
                        <span className="font-serif-dm text-[11px] text-amber-200/50 tabular-nums">
                            {xpCurrent} / {xpMax}
                        </span>
                    </div>
                    <div className="h-2 w-full rpg-bar-track overflow-hidden">
                        <div
                            className="bar-fill h-full bg-gradient-to-r from-amber-900 via-amber-600 to-amber-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                            style={{ width: `${xpPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Ornamental divider ────────────────── */}
            <div className="px-5 pt-5 pb-1 relative z-10">
                <div className="ornament-divider">
                    <span className="text-amber-500/80 text-[10px] drop-shadow-md">◆</span>
                </div>
            </div>

            {/* ── Core Stats 2×2 ──────────────────────── */}
            <div className="px-5 pt-2">
                <SectionLabel>Attributes</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(liveStats).map(([key, val]) => (
                        <StatCard key={key} statKey={key} value={val} />
                    ))}
                </div>
            </div>

            {/* ── Ornamental divider ────────────────── */}
            <div className="px-5 pt-4 pb-1">
                <div className="ornament-divider">
                    <span className="text-amber-400/60 text-[10px] glow-gold-text">◆</span>
                </div>
            </div>

            {/* ── Tabs: Inventory / Abilities ────────── */}
            <div className="px-5 pt-2 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center gap-4 mb-3 border-b border-slate-800/60 pb-2">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`font-serif-dm text-[11px] tracking-[0.12em] transition-colors ${activeTab === 'inventory' ? 'text-amber-400 glow-gold-text' : 'text-slate-500 hover:text-amber-500/70'}`}
                    >
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setActiveTab('abilities')}
                        className={`font-serif-dm text-[11px] tracking-[0.12em] transition-colors ${activeTab === 'abilities' ? 'text-amber-400 glow-gold-text' : 'text-slate-500 hover:text-amber-500/70'}`}
                    >
                        ABILITIES
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                    {activeTab === 'inventory' ? (
                        <div className="grid grid-cols-3 gap-2">
                            {activePlayerActor?.inventory && activePlayerActor.inventory.length > 0 ? (
                                activePlayerActor.inventory.map((item) => (
                                    <InventorySlot key={item.id} item={item} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center mt-6 flex flex-col items-center">
                                    <Package className="w-6 h-6 text-slate-700/50 mb-2" />
                                    <p className="text-slate-500/70 text-[11px] italic font-serif-dm">Backpack is empty.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {activePlayerActor?.abilities?.map((ability, idx) => (
                                <div key={idx} className="p-2.5 rounded-[4px] bg-slate-900/40 border border-slate-700/30 hover:border-amber-500/30 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-serif-dm text-xs font-bold text-amber-100/90 tracking-wide">{ability.name}</span>
                                        <span className="text-[9px] uppercase tracking-[0.15em] text-amber-500/50">{ability.ability_type}</span>
                                    </div>
                                    <p className="font-serif-dm text-[11px] text-slate-400/80 leading-relaxed text-justify">{ability.description}</p>
                                </div>
                            ))}
                            {(!activePlayerActor?.abilities || activePlayerActor.abilities.length === 0) && (
                                <p className="text-slate-500/70 text-[11px] italic font-serif-dm text-center mt-6">Capabilities unknown.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
