import React from "react";
import CharacterSheet from "./components/CharacterSheet";
import MainStage from "./components/MainStage";
import DMConsole from "./components/DMConsole";

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden grid grid-cols-[1fr_3fr_1fr] bg-slate-950">
      {/* Left – Character Sheet (25%) */}
      <CharacterSheet />

      {/* Center – Main Stage (50%) */}
      <MainStage />

      {/* Right – DM Console (25%) */}
      <DMConsole />
    </div>
  );
}
