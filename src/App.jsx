import React from "react";
import CharacterSheet from "./components/CharacterSheet";
import MainStage from "./components/MainStage";
import DMConsole from "./components/DMConsole";
import Onboarding from "./components/Onboarding";
import { GameProvider, useGame } from "./contexts/GameContext";

function MainApp() {
  const { isLoading, gameId } = useGame();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-amber-500 font-serif-dm">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl tracking-widest uppercase glow-gold-text">Forging the world...</h2>
      </div>
    );
  }

  if (!gameId) {
    return <Onboarding />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0806] flex items-center justify-center p-4 lg:p-6 pb-6 relative" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1612 0%, #030202 100%)' }}>
      {/* Decorative Table Texture/Glow behind the panels */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")' }}></div>

      <div className="w-full h-full max-w-[1920px] max-h-[1200px] grid grid-cols-[1fr_3fr_1fr] gap-4 z-10 relative">
        <div className="rounded-xl overflow-hidden border border-[#3d3220] shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] bg-[#050403] relative">
          <CharacterSheet />
        </div>

        <div className="rounded-xl overflow-hidden border-2 border-[#5c4a2e] shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.1)] relative">
          <MainStage />
        </div>

        <div className="rounded-xl overflow-hidden border border-[#3d3220] shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] bg-[#050403] relative">
          <DMConsole />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
