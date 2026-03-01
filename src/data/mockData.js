export const character = {
    name: "Aldric Thornwood",
    class: "Ranger",
    level: 7,
    hp: { current: 12, max: 50 }, // lower current HP to trigger pulse animation
    xp: { current: 3200, max: 5000 },
    ac: 16,
    stats: {
        strength: 14,
        dexterity: 18,
        intelligence: 12,
        charisma: 10,
    },
    avatar: "/avatar.png",
};

export const inventory = [
    { id: 1, icon: "sword", name: "Moonblade Shortsword", qty: 1, rarity: "rare" },
    { id: 2, icon: "shield", name: "Iron Buckler", qty: 1, rarity: "common" },
    { id: 3, icon: "potion", name: "Health Potion", qty: 3, rarity: "common" },
    { id: 4, icon: "bow", name: "Elven Longbow", qty: 1, rarity: "epic" },
    { id: 5, icon: "wand", name: "Wand of Sparks", qty: 1, rarity: "rare" },
    { id: 6, icon: "orb", name: "Scrying Orb", qty: 1, rarity: "legendary" },
    { id: 7, icon: "scroll", name: "Scroll of Fireball", qty: 2, rarity: "rare" },
    { id: 8, icon: "gem", name: "Sapphire Gemstone", qty: 4, rarity: "epic" },
    { id: 9, icon: "key", name: "Rusty Dungeon Key", qty: 1, rarity: "common" },
    { id: 10, icon: "meat", name: "Smoked Venison", qty: 5, rarity: "common" },
    { id: 11, icon: "compass", name: "Enchanted Compass", qty: 1, rarity: "rare" },
    { id: 12, icon: "elixir", name: "Mana Elixir", qty: 2, rarity: "epic" },
    { id: 13, icon: "coin", name: "Gold Coins", qty: 47, rarity: "common" },
    { id: 14, icon: "lodestone", name: "Lodestone", qty: 1, rarity: "common" },
    { id: 15, icon: "feather", name: "Phoenix Feather", qty: 1, rarity: "legendary" },
    { id: 16, icon: "candle", name: "Everburning Candle", qty: 3, rarity: "common" },
    { id: 17, icon: "gauntlet", name: "Gauntlets of Might", qty: 1, rarity: "rare" },
    { id: 18, icon: "amulet", name: "Bone Amulet", qty: 1, rarity: "epic" },
    { id: 19, icon: "runestone", name: "Runestone", qty: 2, rarity: "rare" },
    { id: 20, icon: "goblet", name: "Dwarven Ale", qty: 6, rarity: "common" },
];

export const chatHistory = [
    {
        id: 1,
        sender: "dm",
        text: "The heavy oak door groans open, and you step into the warm embrace of The Broken Shield tavern. The air is thick with the scent of roasted meat and spilled mead. A bard strums a melancholy tune in the corner, and the flickering firelight casts long, dancing shadows across the stone walls.",
    },
    {
        id: 2,
        sender: "dm",
        text: "Several patrons glance your way — a hooded figure nursing a dark drink in the far booth, a boisterous group of dwarves arm-wrestling at the bar, and the barkeep — a scarred half-orc woman polishing a tankard with a skeptical eye trained on you.",
    },
    {
        id: 3,
        sender: "player",
        text: "I approach the barkeep and ask if she knows anything about the missing merchant caravan.",
    },
    {
        id: 4,
        sender: "dm",
        text: "The barkeep's eyes narrow as she sets down the tankard with a heavy thud. \"Aye, I've heard the whispers,\" she mutters, her voice a low rasp. \"Three caravans gone in a fortnight. The last one... they found the wagons, but not the people. Only bloodstains and claw marks on the wood.\" She leans closer. \"If you're fool enough to go looking, talk to the hooded one in the corner. Name's Vex. Knows the northern pass better than anyone alive.\"",
    },
    {
        id: 5,
        sender: "player",
        text: "I buy a mead and walk over to the hooded figure's table.",
    },
    {
        id: 6,
        sender: "dm",
        text: "As you slide into the seat across from Vex, you notice their hands — scarred, calloused, and missing the tip of one finger. They don't look up from their drink. \"I know why you're here,\" they whisper. \"And I'll tell you this for free: whatever took those people... it isn't wolves. I tracked it to the Hollowfang Caves. The tracks were wrong. Too large. Too deep.\" They finally raise their pale grey eyes to meet yours. \"I'll guide you, for a price. Fifty gold. And you go in first.\"",
    },
    {
        id: 7,
        sender: "player",
        text: "I offer 30 gold and tell them we split whatever treasure we find.",
    },
    {
        id: 8,
        sender: "dm",
        text: "Vex studies you for a long moment, the candlelight reflecting in their cold eyes. A thin smile crosses their lips. \"You've got nerve, ranger. I like that.\" They extend a hand across the table. \"Thirty gold and a fair split. But we leave at dawn. Whatever lurks in those caves grows bolder after dark.\"",
    },
];
