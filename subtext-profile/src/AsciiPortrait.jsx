import React from 'react';

// HIGH-FIDELITY ASCII COLLECTION
const ARTWORK = {
  // NINJA: The "Ghost in the Shell" Hacker
  NINJA: `
      .           .
    /' \\         / \`\\
   /   | .---.  |   \\
  |    |/  _  \\ |    |
  |    |\\   _  /|    |
   \\  /  \\___/  \\  /
    \\/           \\/
    |             |
    |    - - -    |
    \\    _   _    /
     \\__(")_(" )_/
     /   \\   /   \\
    `,

  // MECH: The "Heavy Walker" Unit
  MECH: `
      [=]-------[=]
       |  [###]  |
      /|   _|_   |\\
     | |  | o |  | |
     | |__|___|__| |
     |  |  |  |  | |
    /   |  |  |  |  \\
   /____|__|__|__|___\\
  |    |       |    |
  [====]       [====]
    `,

  // WIZARD: The "Unix Greybeard"
  WIZARD: `
          ____
        /'    \`\\
       (        )
       |  ^  ^  |
       | ((  )) |
       |   <    |
       |  ====  |
      / \\  --  / \\
     /   \\____/   \\
    /     |  |     \\
  _/      |  |      \\_
    `,

  // DRONE: The "Surveillance Swarm"
  OPERATOR: `
      /===\\   /===\\
      \\   /   \\   /
       \\ /     \\ /
       _|_______|_
      |  O   O  |
      |__  V  __|
       /|     |\\
      / \\     / \\
     /   \\___/   \\
    /_____\\ /_____\\
     (   )   (   )
    `
};

const AsciiPortrait = ({ type, variant = 'full' }) => {
  // 1. Determine Archetype
  let bodyKey = "NINJA"; 
  let label = "UNKNOWN";
  let colorClass = "text-gray-400";

  // Using brighter colors (400 instead of 500) for better contrast on dark bg
  if (type.includes('A') && type.includes('F')) {
    bodyKey = "NINJA";
    label = "STRIDER";
    colorClass = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"; 
  } else if (type.includes('M') && type.includes('X')) {
    bodyKey = "MECH";
    label = "HEAVY";
    colorClass = "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"; 
  } else if (type.includes('M') && type.includes('F')) {
    bodyKey = "WIZARD";
    label = "ARCHITECT";
    colorClass = "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"; 
  } else if (type.includes('A') && type.includes('X')) {
    bodyKey = "OPERATOR";
    label = "DRONE";
    colorClass = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"; 
  }

  // 2. Select Traits
  const isNight = type.includes('N');
  const isDescriptive = type.includes('D');

  // 3. Get Artwork
  const finalArt = ARTWORK[bodyKey];

  // 4. Compact Mode Handling (Scaling Down)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center bg-[#09090b] border border-[#27272a] rounded-lg w-24 h-24 shrink-0 overflow-hidden relative group`}>
         {/* Background Glow for Compact - Increased opacity */}
         <div className={`absolute inset-0 opacity-20 blur-xl ${colorClass.replace('text-', 'bg-').split(' ')[0]}`}></div>
         
         {/* Render FULL art but with tiny font size to fit - Increased size slightly */}
         <pre className={`font-mono text-[5px] leading-[5px] whitespace-pre select-none ${colorClass} origin-center transform scale-100 group-hover:scale-110 transition-transform duration-300`}>
            {finalArt}
         </pre>
      </div>
    );
  }

  // DEFAULT FULL RENDER
  return (
    <div className={`flex flex-col items-center justify-center p-8 border border-[#27272a] bg-[#121212] rounded-xl relative overflow-hidden group w-72 h-80 shadow-2xl`}>
      <div className={`absolute inset-0 opacity-10 blur-3xl ${colorClass.replace('text-', 'bg-').split(' ')[0]}`}></div>
      <pre className={`font-mono text-[11px] leading-[1.2] whitespace-pre select-none relative z-10 ${colorClass} transition-all duration-300 group-hover:scale-105`}>
        {finalArt}
      </pre>
      <div className="absolute bottom-6 flex gap-3 text-[10px] font-mono tracking-widest uppercase text-zinc-600">
         <span>{label}</span>
         <span className="text-zinc-700">|</span>
         <span className={isNight ? "text-purple-400" : "text-orange-400"}>{isNight ? "NIGHT" : "DAY"}</span>
         <span className="text-zinc-700">|</span>
         <span className={isDescriptive ? "text-indigo-400" : "text-teal-400"}>{isDescriptive ? "DESC" : "CONC"}</span>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default AsciiPortrait;