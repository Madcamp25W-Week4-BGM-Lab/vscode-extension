import React from 'react';
import { Share2, Terminal, GitCommit, GitPullRequest, GitMerge, AlertTriangle, Check, X, Cpu, Code } from 'lucide-react';

// --- Configuration & Data ---

const TRAIT_DESCRIPTIONS = {
  AM: {
    left: { code: 'A', name: 'Atomic', color: 'text-emerald-400', bg: 'bg-emerald-500' },
    right: { code: 'M', name: 'Monolithic', color: 'text-blue-400', bg: 'bg-blue-500' }
  },
  CD: {
    left: { code: 'C', name: 'Concise', color: 'text-teal-400', bg: 'bg-teal-500' },
    right: { code: 'D', name: 'Descriptive', color: 'text-indigo-400', bg: 'bg-indigo-500' }
  },
  FX: {
    left: { code: 'F', name: 'Feature', color: 'text-yellow-400', bg: 'bg-yellow-500' },
    right: { code: 'X', name: 'Fixer', color: 'text-rose-400', bg: 'bg-rose-500' }
  },
  DN: {
    left: { code: 'D', name: 'Day', color: 'text-orange-400', bg: 'bg-orange-500' },
    right: { code: 'N', name: 'Night', color: 'text-purple-400', bg: 'bg-purple-500' }
  }
};

const MOCK_RESULT = {
  type: "ACFN",
  title: "Night_Surgeon", // Underscore for tech feel
  description: "Building silently in the shadows. Your commits are surgical, precise, and frequent. While others sleep, you are stacking features brick by brick.",
  stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
};

const COLLABORATION_DATA = [
  {
    type: "MDXD",
    relation: "CONFLICT",
    title: "The_Daytime_Essayist",
    desc: ">> WARNING: Merge conflict likely. They push massive commits at 2 PM. You push atomic features at 3 AM.",
    color: "border-red-500/50 bg-red-900/10",
    iconColor: "text-red-500"
  },
  {
    type: "MCFN",
    relation: "WARN",
    title: "Silent_Boulder",
    desc: ">> CAUTION: Context drift. You both work at night, but their massive commits break your architecture.",
    color: "border-orange-500/50 bg-orange-900/10",
    iconColor: "text-orange-500"
  },
  {
    type: "ACXD",
    relation: "MERGE",
    title: "Day_Surgeon",
    desc: ">> SUCCESS: Clean merge. You build features at night; they fix bugs during the day.",
    color: "border-emerald-500/50 bg-emerald-900/10",
    iconColor: "text-emerald-500"
  }
];

// --- Components ---

const ProgressBar = ({ left, right, score }) => {
  const isLeft = score >= 50;
  const percentage = isLeft ? (score - 50) * 2 : (50 - score) * 2;
  
  return (
    <div className="mb-6 font-mono">
      <div className="flex justify-between items-end mb-1 text-xs">
        <span className={`font-bold ${isLeft ? left.color : 'text-gray-600'}`}>
          {`<${left.name} />`}
        </span>
        <span className={`font-bold ${!isLeft ? right.color : 'text-gray-600'}`}>
          {`<${right.name} />`}
        </span>
      </div>
      
      {/* Tech-style Progress Bar */}
      <div className="relative h-4 bg-[#1e1e1e] border border-gray-700 flex items-center overflow-hidden">
        {/* Grid lines inside bar */}
        <div className="absolute inset-0 flex justify-between px-1">
            {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-gray-800"></div>)}
        </div>
        
        {/* The Center Line */}
        <div className="absolute left-1/2 w-0.5 h-full bg-gray-500 z-10"></div>

        {/* The Fill */}
        <div 
          className={`h-full transition-all duration-1000 ${isLeft ? left.bg : right.bg} opacity-80`}
          style={{ 
            width: `${percentage}%`,
            marginLeft: isLeft ? 'auto' : '50%',
            marginRight: isLeft ? '50%' : 'auto',
          }} 
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>{isLeft ? `${percentage}%` : '0%'}</span>
        <span>{!isLeft ? `${percentage}%` : '0%'}</span>
      </div>
    </div>
  );
};

const CollaborationRow = ({ match }) => {
    let icon;
    if (match.relation === "CONFLICT") icon = <X size={16} />;
    else if (match.relation === "WARN") icon = <AlertTriangle size={16} />;
    else icon = <GitMerge size={16} />;

    return (
        <div className={`p-4 border-l-4 ${match.color} mb-3 font-mono hover:bg-white/5 transition`}>
            <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm font-bold ${match.iconColor} flex items-center gap-2`}>
                    {icon} {match.relation}
                </h4>
                <span className="text-xs bg-[#1e1e1e] px-2 py-0.5 border border-gray-700 rounded text-gray-400">
                    git checkout {match.type}
                </span>
            </div>
            <div className="text-gray-300 font-bold text-sm mb-1">{match.title}</div>
            <p className="text-xs text-gray-500 leading-relaxed font-mono">
                {match.desc}
            </p>
        </div>
    )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] font-mono text-gray-300 overflow-x-hidden relative selection:bg-pink-500/30">
      
      {/* --- BACKGROUND: "The Commit Graph" --- */}
      {/* This SVG draws rigid lines connecting dots, mimicking a Git history graph */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-20 z-0">
         <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
             {/* The "Main Branch" Line (Vertical) */}
             <path d="M500,0 L500,600" stroke="#333" strokeWidth="2" />
             
             {/* Branch 1 (Purple - Night) */}
             <path d="M500,50 L600,100 L600,300 L500,400" fill="none" stroke="#a855f7" strokeWidth="4" />
             <circle cx="600" cy="100" r="6" fill="#1e1e1e" stroke="#a855f7" strokeWidth="4" />
             <circle cx="600" cy="300" r="6" fill="#1e1e1e" stroke="#a855f7" strokeWidth="4" />

             {/* Branch 2 (Blue - Monolithic) */}
             <path d="M500,150 L350,250 L350,450 L500,550" fill="none" stroke="#3b82f6" strokeWidth="4" />
             <circle cx="350" cy="250" r="6" fill="#1e1e1e" stroke="#3b82f6" strokeWidth="4" />
             <circle cx="350" cy="450" r="6" fill="#1e1e1e" stroke="#3b82f6" strokeWidth="4" />
             
             {/* Commits on Main Branch */}
             <circle cx="500" cy="50" r="8" fill="#555" />
             <circle cx="500" cy="150" r="8" fill="#555" />
             <circle cx="500" cy="400" r="8" fill="#555" />
             <circle cx="500" cy="550" r="8" fill="#555" />
         </svg>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-20 border-b border-gray-800 bg-[#1e1e1e]/90 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded"><Terminal size={16} className="text-white" /></div>
            <span className="font-bold tracking-tight text-gray-200">SubText<span className="text-gray-600">.config</span></span>
        </div>
        <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1 text-gray-500"><GitCommit size={12}/> main*</span>
            <span className="flex items-center gap-1 text-gray-500"><AlertTriangle size={12}/> 0 errors</span>
        </div>
      </nav>


      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        
        {/* Top Grid: Result vs Stats */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* LEFT: The "Code Editor" Card (Result) */}
            <div className="bg-[#252526] border border-gray-700 shadow-2xl overflow-hidden flex flex-col h-full">
                {/* Window Controls */}
                <div className="bg-[#333333] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                    <span className="text-xs text-gray-400 flex items-center gap-2">
                        <Code size={12} /> profile.json
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-center">
                    <div className="text-sm text-gray-500 mb-6">
                        <span className="text-blue-400">const</span> <span className="text-yellow-300">developer</span> = <span className="text-pink-400">new</span> <span className="text-green-400">Persona</span>({'{'}
                    </div>

                    <div className="pl-6 border-l border-gray-700 space-y-4">
                        <div>
                            <span className="text-blue-300">type:</span> <span className="text-orange-300">"{MOCK_RESULT.type}"</span>,
                        </div>
                        <div>
                            <span className="text-blue-300">alias:</span> <span className="text-green-300">"{MOCK_RESULT.title}"</span>,
                        </div>
                        <div>
                            <span className="text-blue-300">desc:</span> <span className="text-gray-400">"{MOCK_RESULT.description}"</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mt-6">{'}'});</div>

                    <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-gray-500 uppercase tracking-widest">Git Identity</span>
                             <span className="text-2xl font-bold text-white tracking-widest">{MOCK_RESULT.type}</span>
                         </div>
                         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 transition">
                             <Share2 size={14} /> git push origin
                         </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: The "Diagnostics" Panel (Stats) */}
            <div className="flex flex-col justify-center">
                 <div className="mb-6 flex items-center gap-2">
                    <Cpu className="text-blue-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-200">System Diagnostics</h2>
                 </div>

                 <div className="bg-[#252526] p-6 border border-gray-700 relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blue-500"></div>

                    <ProgressBar left={TRAIT_DESCRIPTIONS.AM.left} right={TRAIT_DESCRIPTIONS.AM.right} score={MOCK_RESULT.stats.AM} />
                    <ProgressBar left={TRAIT_DESCRIPTIONS.CD.left} right={TRAIT_DESCRIPTIONS.CD.right} score={MOCK_RESULT.stats.CD} />
                    <ProgressBar left={TRAIT_DESCRIPTIONS.FX.left} right={TRAIT_DESCRIPTIONS.FX.right} score={MOCK_RESULT.stats.FX} />
                    <ProgressBar left={TRAIT_DESCRIPTIONS.DN.left} right={TRAIT_DESCRIPTIONS.DN.right} score={MOCK_RESULT.stats.DN} />
                 </div>
            </div>
        </div>

        {/* Bottom Section: Collaboration (The Diff View) */}
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12">
                <div className="flex items-center gap-2 mb-4">
                    <GitPullRequest className="text-pink-500" size={20} />
                    <h2 className="text-lg font-bold text-gray-200">Merge Conflicts & Compatibility</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {COLLABORATION_DATA.map((match, idx) => (
                        <CollaborationRow key={idx} match={match} />
                    ))}
                </div>
            </div>
        </div>

      </main>
      
      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full bg-[#007acc] text-white text-[10px] px-2 py-1 flex justify-between z-30 font-sans">
          <div className="flex gap-4">
              <span className="flex items-center gap-1"><GitMerge size={10}/> main</span>
              <span>SubText v2.4.0</span>
          </div>
          <div className="flex gap-4">
               <span>Ln 85, Col 10</span>
               <span>UTF-8</span>
               <span>JavaScript</span>
          </div>
      </footer>
    </div>
  );
}