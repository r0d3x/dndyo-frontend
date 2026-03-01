import React from "react";

/* ──────────────────────────────────────────────────
   Custom hand-crafted SVG icons for inventory items.
   Each icon renders at the given size with a single
   consistent stroke/fill style for a polished look.
   ────────────────────────────────────────────────── */

const iconColor = "currentColor";

export function SwordIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="M13 19l6-6" />
            <path d="M16 16l4 4" />
            <path d="M19 21l2-2" />
            <path d="M14.5 17.5l-1.5-1.5" />
        </svg>
    );
}

export function ShieldIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M10 10h4" />
        </svg>
    );
}

export function PotionIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2h4" />
            <path d="M10 2v5.2a2 2 0 01-.6 1.4L6 12c-1.3 1.3-2 3-2 4.8V18a3 3 0 003 3h10a3 3 0 003-3v-1.2c0-1.8-.7-3.5-2-4.8l-3.4-3.4a2 2 0 01-.6-1.4V2" />
            <path d="M6.5 15h11" />
        </svg>
    );
}

export function BowIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20C4 20 8 16 8 12C8 8 4 4 4 4" />
            <path d="M4 4L20 20" />
            <path d="M16 16l4 1-1-4" />
        </svg>
    );
}

export function WandIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 4V2" />
            <path d="M15 16v-2" />
            <path d="M8 9h2" />
            <path d="M20 9h2" />
            <path d="M17.8 11.8L19 13" />
            <path d="M15 9h0" />
            <path d="M17.8 6.2L19 5" />
            <path d="M3 21l9-9" />
            <circle cx="15" cy="9" r="3" />
        </svg>
    );
}

export function OrbIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v6" />
            <path d="M12 15v6" />
            <path d="M3 12h6" />
            <path d="M15 12h6" />
        </svg>
    );
}

export function ScrollIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 11-4 0V5a2 2 0 10-4 0v2h12V5a2 2 0 014 0v14a2 2 0 01-2 2H8z" />
            <path d="M10 12h4" />
            <path d="M10 15h2" />
        </svg>
    );
}

export function GemIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9z" />
            <path d="M2 9h20" />
            <path d="M12 22L6 9l3-6" />
            <path d="M12 22l6-13-3-6" />
        </svg>
    );
}

export function KeyIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="15" r="5" />
            <path d="M11.7 11.3L21 2" />
            <path d="M17 6l4-2-2 4" />
        </svg>
    );
}

export function MeatIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.5 2.5C17.5 2.5 21 4 21 8.5c0 4-3 7.5-7 9l-1.5 1" />
            <path d="M9 13c-2.5 1.5-5 .5-6-1s-1-4 1.5-5.5S9.5 5 12.5 3" />
            <path d="M3 21l5-5" />
        </svg>
    );
}

export function CompassIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
    );
}

export function ElixirIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2h6" />
            <path d="M10 2v4l-4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4l-4-8V2" />
            <path d="M6 14h12" />
            <circle cx="10" cy="17" r="1" />
            <circle cx="14" cy="17" r="1" />
        </svg>
    );
}

export function CoinIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 6v12" />
            <path d="M15 9.5c0-1.5-1.5-2.5-3-2.5s-3 1-3 2.5 1.5 2 3 2.5 3 1 3 2.5-1.5 2.5-3 2.5-3-1-3-2.5" />
        </svg>
    );
}

export function LodestoneIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 015 5v4a5 5 0 01-10 0V7a5 5 0 015-5z" />
            <path d="M7 11v4" />
            <path d="M17 11v4" />
            <path d="M7 22h4" />
            <path d="M13 22h4" />
            <path d="M9 15v7" />
            <path d="M15 15v7" />
        </svg>
    );
}

export function FeatherIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" />
            <path d="M16 8L2 22" />
            <path d="M17.5 15H9" />
        </svg>
    );
}

export function CandleIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="10" width="6" height="12" rx="1" />
            <path d="M12 2C12 2 9 5 9 7c0 1.7 1.3 3 3 3s3-1.3 3-3c0-2-3-5-3-5z" />
        </svg>
    );
}

export function GauntletIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 21h10a2 2 0 002-2v-4l-2-6V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4L5 15v4a2 2 0 002 2z" />
            <path d="M7 9h10" />
            <path d="M9 9V5" />
            <path d="M11 9V4" />
            <path d="M13 9V4" />
            <path d="M15 9V5" />
        </svg>
    );
}

export function AmuletIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8 2 6 4 6 6s2 3 3 3" />
            <path d="M12 2c4 0 6 2 6 4s-2 3-3 3" />
            <circle cx="12" cy="15" r="5" />
            <path d="M12 12v-3" />
            <circle cx="12" cy="15" r="2" />
        </svg>
    );
}

export function RunestoneIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20L12 4l8 16H4z" />
            <path d="M12 9v5" />
            <path d="M10 12l4-2" />
            <path d="M10 14h4" />
        </svg>
    );
}

export function GobletIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M6 3h12l-1 8c-.4 3-2.6 5-5 6-2.4-1-4.6-3-5-6L6 3z" />
            <path d="M6 6h12" />
        </svg>
    );
}

/* ── Icon Registry ────────────────────────────── */
const iconMap = {
    sword: SwordIcon,
    shield: ShieldIcon,
    potion: PotionIcon,
    bow: BowIcon,
    wand: WandIcon,
    orb: OrbIcon,
    scroll: ScrollIcon,
    gem: GemIcon,
    key: KeyIcon,
    meat: MeatIcon,
    compass: CompassIcon,
    elixir: ElixirIcon,
    coin: CoinIcon,
    lodestone: LodestoneIcon,
    feather: FeatherIcon,
    candle: CandleIcon,
    gauntlet: GauntletIcon,
    amulet: AmuletIcon,
    runestone: RunestoneIcon,
    goblet: GobletIcon,
};

export function ItemIcon({ icon, size = 24 }) {
    const Icon = iconMap[icon];
    if (!Icon) return null;
    return <Icon size={size} />;
}

export default ItemIcon;
