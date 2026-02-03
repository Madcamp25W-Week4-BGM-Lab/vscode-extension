import React from 'react';

// 1. DEFINE THE TEMPLATES (With {{PLACEHOLDERS}})
const TEMPLATES = {
  // NINJA (Atomic + Feature)
  NINJA: `
      .-------.
    /   .   .   \\
   /   /  _  \\   \\
  |   | {{EYES}}  |   |
  |    \\ {{MOUTH}} /    |
   \\    '---'    /
    '-----------'
      /|  |  |\\
     / |  |  | \\
    `,

  // MECH (Monolithic + Fixer)
  MECH: `
    [=]-------[=]
    |  [-----]  |
    |  |{{EYES}}|  |
    |  [-----]  |
    |  |{{MOUTH}}|  |
    |___|___|___|
    /   |   |   \\
   [____|___|____]
    `,

  // WIZARD (Monolithic + Feature)
  WIZARD: `
      /\\
     /  \\
    |    |
   ( {{EYES}} )
   | {{MOUTH}}  |
   | {||} |
   /  ::  \\
  /___::___\\
    `,

  // OPERATOR (Atomic + Fixer)
  OPERATOR: `
      _HT_
     |{{EYES}}|
    _|[__]|_
   / |{{MOUTH}}| \\
  |  | -- |  |
  |__|____|__|
     /    \\
    `
};

// 2. DEFINE THE PARTS
const PARTS = {
  EYES: {
    DAY:   { NINJA: "(O O)", MECH: "[0 0]", WIZARD: " O O ", OPERATOR: "O  O" },
    NIGHT: { NINJA: "(- -)", MECH: "[- -]", WIZARD: " - - ", OPERATOR: "-  -" }
  },
  MOUTH: {
    CONCISE:     { NINJA: " _ ", MECH: "__|__", WIZARD: "  -   ", OPERATOR: " .. " },
    DESCRIPTIVE: { NINJA: "[ ]", MECH: "[___]", WIZARD: " (o)  ", OPERATOR: " [] " }
  }
};

const AsciiPortrait = ({ type }) => {
  // --- A. Determine the Body Class (Base Archtype) ---
  let bodyKey = "NINJA"; // Default
  let label = "UNKNOWN";
  let colorClass = "text-gray-400";

  // Logic: Atomic/Monolithic (A/M) + Feature/Fixer (F/X)
  if (type.includes('A') && type.includes('F')) {
    bodyKey = "NINJA";
    label = "STRIDER";
    colorClass = "text-emerald-400"; 
  } else if (type.includes('M') && type.includes('X')) {
    bodyKey = "MECH";
    label = "HEAVY";
    colorClass = "text-rose-400"; 
  } else if (type.includes('M') && type.includes('F')) {
    bodyKey = "WIZARD";
    label = "ARCHITECT";
    colorClass = "text-amber-400"; 
  } else if (type.includes('A') && type.includes('X')) {
    bodyKey = "OPERATOR";
    label = "DRONE";
    colorClass = "text-blue-400"; 
  }

  // --- B. Determine Traits for Parts ---
  const isNight = type.includes('N');
  const isDescriptive = type.includes('D'); // Assuming 'D' in 'CD' axis stands for Descriptive

  // --- C. Select the specific parts for this body ---
  const eyesStr = isNight ? PARTS.EYES.NIGHT[bodyKey] : PARTS.EYES.DAY[bodyKey];
  const mouthStr = isDescriptive ? PARTS.MOUTH.DESCRIPTIVE[bodyKey] : PARTS.MOUTH.CONCISE[bodyKey];

  // --- D. Compile the final string ---
  let finalArt = TEMPLATES[bodyKey]
    .replace('{{EYES}}', eyesStr)
    .replace('{{MOUTH}}', mouthStr);

  return (
    <div className={`flex flex-col items-center justify-center p-6 border border-[#27272a] bg-[#121212] rounded-xl relative overflow-hidden group`}>
      
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 opacity-10 blur-2xl ${colorClass.replace('text-', 'bg-')}`}></div>

      {/* The Rendered ASCII */}
      <pre className={`font-mono text-[10px] sm:text-xs leading-[1.1] whitespace-pre select-none relative z-10 ${colorClass} transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_currentColor]`}>
        {finalArt}
      </pre>

      {/* The Label */}
      <div className="mt-4 flex gap-2 text-[10px] font-mono tracking-widest uppercase text-gray-600">
         <span>{label}</span>
         <span className="text-gray-700">|</span>
         <span className={isNight ? "text-purple-400" : "text-orange-400"}>{isNight ? "NIGHT" : "DAY"}</span>
         <span className="text-gray-700">|</span>
         <span className={isDescriptive ? "text-indigo-400" : "text-teal-400"}>{isDescriptive ? "DESC" : "CONC"}</span>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default AsciiPortrait;