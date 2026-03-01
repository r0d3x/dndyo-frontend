import React from "react";
import {
    Swords,
    Wind,
    Brain,
    Sparkles,
    Package,
    Shield,
} from "lucide-react";
import { character, inventory } from "../data/mockData";
import ItemIcon from "./ItemIcons";

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
        <div className="vintage-card relative flex flex-col items-center justify-center gap-0.5 rounded-md p-3 cursor-default transition-all">
            <Icon className="w-4 h-4 text-amber-500/50 mb-1" />
            <span className="font-serif-dm text-[32px] font-bold text-slate-200 leading-none glow-gold-text">{value}</span>
            <span className="font-serif-dm text-[9px] uppercase tracking-[0.25em] text-slate-500 mt-1">
                {statLabels[statKey]}
            </span>
            {/* Bonus Modifier */}
            <span className="absolute top-1.5 right-1.5 text-[11px] font-bold text-amber-400 glow-gold-text">
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
        <div className={`group relative aspect-square flex items-center justify-center rounded-md vintage-slot cursor-pointer ${borderClass} transition-all duration-300`}>
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
    const hpPercent = (character.hp.current / character.hp.max) * 100;
    const xpPercent = (character.xp.current / character.xp.max) * 100;

    return (
        <div className="flex flex-col h-full bg-slate-950 panel-border-r overflow-hidden">
            {/* ── Hero Section (Avatar & Nameplate) ───── */}
            <div className="p-4 flex flex-col items-center relative">
                <div className="relative w-4/5 aspect-square overflow-visible mb-6">
                    <div className="w-full h-full rounded-md overflow-hidden border-2 border-amber-600/40 glow-gold shadow-2xl relative">
                        <img
                            src={character.avatar}
                            alt={character.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />
                    </div>

                    {/* AC Badge breaking out of bottom right */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 flex items-center justify-center drop-shadow-2xl z-20">
                        <Shield className="absolute inset-0 w-full h-full text-slate-400 fill-slate-800 drop-shadow-md" strokeWidth={1.5} />
                        <div className="relative flex flex-col items-center justify-center mt-[-3px]">
                            <span className="font-serif-dm text-base font-bold text-white tracking-widest leading-none glow-gold-text ml-[3px]">{character.ac}</span>
                        </div>
                    </div>
                </div>

                {/* Nameplate separated from image */}
                <div className="text-center w-full bg-gradient-to-r from-transparent via-slate-800/80 to-transparent py-2 border-y border-amber-500/20">
                    <h2 className="font-serif-dm text-lg font-bold text-amber-400 glow-gold-text tracking-wide">
                        {character.name}
                    </h2>
                    <p className="font-serif-dm text-[9px] tracking-[0.25em] text-slate-400 mt-1 uppercase">
                        Level {character.level} · {character.class}
                    </p>
                </div>
            </div>

            {/* ── Status Bars ─────────────────────────── */}
            <div className="px-5 pt-1 space-y-3">
                {/* HP Bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif-dm text-[11px] tracking-[0.1em] text-red-400/90 font-semibold drop-shadow-sm">
                            Health
                        </span>
                        <span className="font-serif-dm text-[11px] text-slate-300 tabular-nums">
                            {character.hp.current} / {character.hp.max}
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-900 shadow-inner overflow-hidden border border-slate-800">
                        <div
                            className={`bar-fill h-full rounded-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] ${character.hp.current < 15 ? "animate-pulse" : ""}`}
                            style={{ width: `${hpPercent}%` }}
                        />
                    </div>
                </div>

                {/* XP Bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif-dm text-[11px] tracking-[0.1em] text-amber-400/80 font-semibold drop-shadow-sm">
                            Experience
                        </span>
                        <span className="font-serif-dm text-[11px] text-slate-300 tabular-nums">
                            {character.xp.current} / {character.xp.max}
                        </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 shadow-inner overflow-hidden border border-slate-800">
                        <div
                            className="bar-fill h-full rounded-full bg-gradient-to-r from-amber-900 via-amber-600 to-amber-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                            style={{ width: `${xpPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Ornamental divider ────────────────── */}
            <div className="px-5 pt-4 pb-1">
                <div className="ornament-divider">
                    <span className="text-amber-400/60 text-[10px] glow-gold-text">◆</span>
                </div>
            </div>

            {/* ── Core Stats 2×2 ──────────────────────── */}
            <div className="px-5 pt-2">
                <SectionLabel>Attributes</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(character.stats).map(([key, val]) => (
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

            {/* ── Inventory ───────────────────────────── */}
            <div className="px-5 pt-2 flex-1 min-h-0 flex flex-col">
                <SectionLabel icon={Package}>Inventory</SectionLabel>
                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                    <div className="grid grid-cols-3 gap-2">
                        {inventory.map((item) => (
                            <InventorySlot key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
