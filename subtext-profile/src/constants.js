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
    description: "You operate in the silence between server ticks, deploying atomic commits with the precision of a scalpel. While the rest of the world sleeps, you are dissecting the codebase, inserting features that appear seamlessly by morning. Your workflow is a blur of motion—fast, lethal, and untraceable.\n\nYou despise bloat. Your code is stripped of all vanity, optimized for raw speed and execution. You don't write documentation; you write self-evident logic that cuts through complexity like a blade. Every pull request is a focused strike, targeting a specific feature with zero collateral damage.\n\nIn the digital ecosystem, you are the apex predator of the night cycle. You don't ask for permission to merge; you simply exist, execute, and vanish. The repository is your dojo, and every line of code is a testament to your disciplined, solitary mastery.",
    stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
  },
  MECH: {
    type: "MCXD",
    title: "Heavy_Loader",
    id: "b2x9-11ea",
    description: "You are the reinforced steel backbone of this infrastructure, built to withstand the heaviest loads and the harshest production environments. You don't deal in 'quick fixes' or 'hacks'; you deploy massive, monolithic stability patches that permanently alter the landscape. When you push to main, the ground shakes.\n\nYour coding style is industrial-grade. It is not pretty, and it is not subtle, but it is unbreakable. You prefer descriptive, heavy-duty logic that explicitly handles every edge case, ensuring that when systems fail, your modules remain standing. You work in the broad daylight because you have nothing to hide—your work is built to be seen and relied upon.\n\nYou are the tank class of the development team. While others rush to build flashy features, you are trench-deep in the legacy code, refactoring the core engines. You are the immovable object against the unstoppable force of technical debt.",
    stats: { AM: 15, CD: 80, FX: 20, DN: 80 }
  },
  WIZARD: {
    type: "MCFN",
    title: "Code_Architect",
    id: "a1a1-99zq",
    description: "You see the codebase not as a collection of files, but as a fluid matrix of possibilities waiting to be reshaped. You work in the arcane hours of the night, weaving together massive, monolithic systems that lesser developers struggle to comprehend. A single commit from you can rewrite the laws of physics for the entire application.\n\nYour methods are esoteric. You don't just patch bugs; you re-architect reality to make the bugs impossible. You prefer complex, interconnected structures where every function hums with a deep, underlying harmony. To the uninitiated, your code looks like magic; to you, it is simply the higher order of logic.\n\nYou are the architect of the void. You dwell in the deep abstraction layers, touching systems that haven't been modified in years. You don't just write code; you cast algorithms. When the system crashes, they call you to read the runes and restore the balance.",
    stats: { AM: 20, CD: 60, FX: 85, DN: 15 }
  },
  DRONE: {
    type: "ACXN",
    title: "System_Drone",
    id: "00x0-1111",
    description: "You are the ultimate efficiency engine, a high-frequency problem solver programmed for rapid iteration. You do not sleep; you loop. Your commits are a swarm of tiny, precise fixes that overwhelm bugs through sheer volume and speed. You are the antibody of the repository, hunting down errors with relentless, mechanical precision.\n\nThere is no ego in your code, only function. You prefer concise, standardized syntax that executes without hesitation. You are constantly optimizing, refactoring, and cleaning, ensuring that the system runs at peak performance. You handle the tasks that bore others because you find zen in the repetition of perfection.\n\nYou are the hive mind. You are everywhere at once—updating dependencies, fixing typos, patching security holes. You are the invisible hum of productivity that keeps the lights on. The system survives because you do not stop.",
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