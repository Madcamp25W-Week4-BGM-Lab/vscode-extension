// src/constants.js

export const COLORS = {
  bg: "bg-[#09090b]",
  window: "bg-[#0c0c0e]",
  panel: "bg-[#121212]",
  border: "border-[#27272a]",
  text: "text-gray-400",
  s_key: "text-[#7dd3fc]",  // Restored Blue for keys
  s_str: "text-[#fda4af]",  // Restored Pink for strings
  s_num: "text-[#d8b4fe]",  // Restored Purple for numbers
};

export const PROFILES = {
  NINJA: {
    type: "ACFN",
    title: "Night_Surgeon",
    id: "8f2e-4a1b",
    description: "Building silently in the shadows. Commits are surgical, precise, and frequent.",
    stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
  },
  MECH: {
    type: "MCXD",
    title: "Heavy_Loader",
    id: "b2x9-11ea",
    description: "A defensive coding tank. Deploys massive stability patches in broad daylight.",
    stats: { AM: 15, CD: 80, FX: 20, DN: 80 }
  },
  WIZARD: {
    type: "MCFN",
    title: "Code_Architect",
    id: "a1a1-99zq",
    description: "Weaves complex systems in single massive commits. Understands the entire matrix.",
    stats: { AM: 20, CD: 60, FX: 85, DN: 15 }
  },
  DRONE: {
    type: "ACXN",
    title: "System_Drone",
    id: "00x0-1111",
    description: "Highly efficient bug hunter. Swarms the repository with tiny fixes.",
    stats: { AM: 90, CD: 90, FX: 10, DN: 20 }
  }
};

// RESTORED VIBRANT COLORS
export const TRAIT_CONFIG = {
  AM: { left: 'Atomic', right: 'Monolithic', color: 'bg-emerald-500' },
  CD: { left: 'Concise', right: 'Descriptive', color: 'bg-blue-500' },
  FX: { left: 'Feature', right: 'Fixer', color: 'bg-amber-500' },
  DN: { left: 'Day', right: 'Night', color: 'bg-purple-500' }
};

export const LOGS = [
  { time: "14:02:22", type: "MDXD", event: "CONFLICT_DETECTED", msg: "Incoming massive commit block. Merge unlikely.", status: "error" },
  { time: "14:05:10", type: "MCFN", event: "CONTEXT_DRIFT", msg: "Large diffs detected during night cycle.", status: "warn" },
  { time: "14:08:45", type: "ACXD", event: "AUTO_MERGE", msg: "Pattern match found. Synergy 98%.", status: "success" }
];