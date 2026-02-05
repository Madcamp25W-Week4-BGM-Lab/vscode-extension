import React from 'react';

// HIGH-FIDELITY ASCII COLLECTION (FULL SIZE)
const FULL_ARTWORK = {
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

// COMPACT ICONS FOR LOGS
const COMPACT_ARTWORK = {
  NINJA: `
   .---.
  |  _  |
   \\___/
  /     \\
  `,
  MECH: `
  [###]
  | o |
  |___|
  /   \\
  `,
  WIZARD: `
    ____
   (    )
   | <  |
   /____\\
  `,
  OPERATOR: `
   /===\\
  | O O |
   \\_V_/
   /   \\
  `
};

const AsciiPortrait = ({ type, variant = 'full' }) => {
  // 1. Determine Archetype
  let bodyKey = "NINJA"; 
  let label = "UNKNOWN";
  let colorClass = "text-gray-400";

  if (type.includes('A') && type.includes('F')) {
    bodyKey = "NINJA";
    label = "STRIDER";
    colorClass = "text-emerald-500"; 
  } else if (type.includes('M') && type.includes('X')) {
    bodyKey = "MECH";
    label = "HEAVY";
    colorClass = "text-rose-500"; 
  } else if (type.includes('M') && type.includes('F')) {
    bodyKey = "WIZARD";
    label = "ARCHITECT";
    colorClass = "text-amber-500"; 
  } else if (type.includes('A') && type.includes('X')) {
    bodyKey = "OPERATOR";
    label = "DRONE";
    colorClass = "text-blue-500"; 
  }

  // 2. Select Traits
  const isNight = type.includes('N');
  const isDescriptive = type.includes('D');

  // 3. Get Artwork based on variant
  const isCompact = variant === 'compact';
  const finalArt = isCompact ? COMPACT_ARTWORK[bodyKey] : FULL_ARTWORK[bodyKey];

  if (isCompact) {
    return (
      <div className={`flex items-center justify-center p-2 bg-[#09090b] border border-[#27272a] rounded-lg w-20 h-20 shrink-0`}>
         <pre className={`font-mono text-[8px] leading-[1.1] whitespace-pre select-none ${colorClass}`}>
            {finalArt}
         </pre>
      </div>
    );
  }

  // DEFAULT FULL RENDER
  return (
    <div className={`flex flex-col items-center justify-center p-8 border border-[#27272a] bg-[#121212] rounded-xl relative overflow-hidden group w-72 h-80 shadow-2xl`}>
      <div className={`absolute inset-0 opacity-5 blur-3xl ${colorClass.replace('text-', 'bg-')}`}></div>
      <pre className={`font-mono text-[11px] leading-[1.2] whitespace-pre select-none relative z-10 ${colorClass} transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_currentColor]`}>
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