import React, { useEffect, useState } from 'react';
import { 
  GitCommit, GitPullRequest, GitMerge, AlertTriangle, 
  Terminal, Activity, Share2, Hash, Code, Cpu 
} from 'lucide-react';

// --- Theme Config ---
const COLORS = {
  bg: "bg-[#09090b]",       // Deepest Black/Zinc
  window: "bg-[#0c0c0e]",   // Slightly lighter window bg
  panel: "bg-[#121212]",    // Inner panels
  border: "border-[#27272a]",
  text: "text-[#a1a1aa]",
  accent: "text-blue-500",
  success: "text-emerald-500",
  warn: "text-amber-500",
  error: "text-red-500",
  // Syntax Highlighting
  s_key: "text-[#7dd3fc]",  // Light Blue (Keys)
  s_str: "text-[#fda4af]",  // Light Red/Pink (Strings)
  s_num: "text-[#d8b4fe]",  // Light Purple (Numbers)
  s_bool: "text-[#fcd34d]", // Amber (Booleans/Null)
};

const MOCK_RESULT = {
  type: "ACFN",
  title: "Night_Surgeon",
  id: "8f2e-4a1b",
  description: "Building silently in the shadows. Commits are surgical, precise, and frequent.",
  stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
};

const TRAIT_CONFIG = {
  AM: { left: 'Atomic', right: 'Monolithic', color: 'bg-emerald-500' },
  CD: { left: 'Concise', right: 'Descriptive', color: 'bg-blue-500' },
  FX: { left: 'Feature', right: 'Fixer', color: 'bg-amber-500' },
  DN: { left: 'Day', right: 'Night', color: 'bg-purple-500' }
};

const LOGS = [
  { time: "14:02:22", type: "MDXD", event: "CONFLICT_DETECTED", msg: "Incoming massive commit block. Merge unlikely.", status: "error" },
  { time: "14:05:10", type: "MCFN", event: "CONTEXT_DRIFT", msg: "Large diffs detected during night cycle.", status: "warn" },
  { time: "14:08:45", type: "ACXD", event: "AUTO_MERGE", msg: "Pattern match found. Synergy 98%.", status: "success" }
];

// --- Components ---

const CircuitBackground = () => (
  <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
    <svg className="w-full h-full" patternUnits="userSpaceOnUse" width="100" height="100">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#555" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {/* Abstract Tech Lines */}
      <path d="M 100 0 V 1000" stroke="#333" strokeWidth="1" />
      <path d="M 300 0 V 1000" stroke="#333" strokeWidth="1" />
      <path d="M 80% 0 V 1000" stroke="#333" strokeWidth="1" />
      <circle cx="300" cy="200" r="3" fill="#444" />
      <circle cx="300" cy="500" r="3" fill="#444" />
      <circle cx="80%" cy="350" r="3" fill="#444" />
    </svg>
  </div>
);

const TrafficLights = () => (
  <div className="flex gap-2">
    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#ff5f56]/20"></div>
    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#ffbd2e]/20"></div>
    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#27c93f]/20"></div>
  </div>
);

const StatBar = ({ labelL, labelR, score, color }) => {
  const [width, setWidth] = useState(0);
  const isLeft = score >= 50;
  const targetPct = isLeft ? (score - 50) * 2 : (50 - score) * 2;
  
  useEffect(() => { setTimeout(() => setWidth(targetPct), 300); }, [targetPct]);

  return (
    <div className="mb-5 font-mono text-[11px]">
      <div className="flex justify-between mb-1.5 opacity-70">
        <span className={isLeft ? 'text-white font-bold' : 'text-gray-600'}>{labelL}</span>
        <span className={!isLeft ? 'text-white font-bold' : 'text-gray-600'}>{labelR}</span>
      </div>
      <div className="h-2 bg-[#1a1a1a] border border-[#333] w-full flex relative rounded-sm overflow-hidden">
        {/* Center Marker */}
        <div className="absolute left-1/2 w-[1px] h-full bg-[#444] z-10"></div>
        {/* The Bar */}
        <div 
          className={`h-full transition-all duration-1000 ease-out ${color}`}
          style={{ 
            width: `${width}%`,
            marginLeft: isLeft ? 'auto' : '50%',
            marginRight: isLeft ? '50%' : 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className={`min-h-screen ${COLORS.bg} text-gray-400 font-sans selection:bg-blue-500/20 flex items-center justify-center p-4 md:p-8`}>
      
      <CircuitBackground />

      {/* --- THE MAIN WINDOW --- */}
      <div className={`relative z-10 w-full max-w-5xl ${COLORS.window} border ${COLORS.border} rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in`}>
        
        {/* Window Header */}
        <div className="px-5 py-4 border-b border-[#27272a] flex justify-between items-center bg-[#0f0f11]">
          <div className="flex items-center gap-4">
             <TrafficLights />
             <div className="h-4 w-[1px] bg-[#333]"></div>
             <span className="text-xs font-mono font-bold tracking-wider text-gray-500 flex items-center gap-2">
                <Terminal size={12} /> SUBTEXT_ANALYZER <span className="text-[#333]">///</span> v2.4.0
             </span>
          </div>
          <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-2 transition">
             EXPORT_REPORT <Share2 size={12} />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex flex-col md:flex-row">
           
           {/* LEFT PANEL: IDENTITY (JSON & INFO) */}
           <div className="md:w-3/5 p-8 border-r border-[#27272a]">
              
              {/* Header Badge */}
              <div className="mb-8 flex items-end justify-between">
                 <div>
                    <div className="text-[10px] font-bold text-blue-500 mb-1 tracking-[0.2em] uppercase">profile.json</div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-1">{MOCK_RESULT.type}</h1>
                    <div className="text-lg font-mono text-gray-500">{MOCK_RESULT.title}</div>
                 </div>
                 <div className="text-right hidden sm:block">
                    <Hash size={32} className="text-[#333] mb-1 ml-auto" />
                    <div className="text-[10px] font-mono text-[#444]">{MOCK_RESULT.id}</div>
                 </div>
              </div>

              {/* JSON Editor View */}
              <div className={`${COLORS.panel} border border-[#27272a] rounded-lg p-6 font-mono text-xs md:text-sm shadow-inner relative group`}>
                 <div className="absolute top-2 right-2 text-[10px] text-[#333] font-bold group-hover:text-[#555] transition">read-only</div>
                 
                 <div className="leading-relaxed">
                    <span className="text-gray-600 mr-3 select-none">1</span><span className={COLORS.s_key}>const</span> <span className={COLORS.s_num}>Profile</span> = {'{'}<br/>
                    <span className="text-gray-600 mr-3 select-none">2</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"type"</span>: <span className={COLORS.s_str}>"{MOCK_RESULT.type}"</span>,<br/>
                    <span className="text-gray-600 mr-3 select-none">3</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"alias"</span>: <span className={COLORS.s_str}>"{MOCK_RESULT.title}"</span>,<br/>
                    <span className="text-gray-600 mr-3 select-none">4</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"traits"</span>: [<br/>
                    <span className="text-gray-600 mr-3 select-none">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className={COLORS.s_str}>"Atomic"</span>, <span className={COLORS.s_str}>"NightOwl"</span>, <span className={COLORS.s_str}>"FeatureDriven"</span><br/>
                    <span className="text-gray-600 mr-3 select-none">6</span>&nbsp;&nbsp;],<br/>
                    <span className="text-gray-600 mr-3 select-none">7</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"desc"</span>: <span className={COLORS.s_str}>"{MOCK_RESULT.description}"</span><br/>
                    <span className="text-gray-600 mr-3 select-none">8</span>{'}'};<span className="animate-pulse w-2 h-4 bg-blue-500/50 inline-block align-middle ml-1"></span>
                 </div>
              </div>

           </div>

           {/* RIGHT PANEL: DIAGNOSTICS & LOGS */}
           <div className="md:w-2/5 bg-[#0e0e10] flex flex-col">
              
              {/* Top: Stats */}
              <div className="p-8 border-b border-[#27272a]">
                 <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Activity size={14} /> Performance Metrics
                 </div>
                 
                 <StatBar labelL="Atomic" labelR="Monolithic" score={MOCK_RESULT.stats.AM} color={TRAIT_CONFIG.AM.color} />
                 <StatBar labelL="Concise" labelR="Descriptive" score={MOCK_RESULT.stats.CD} color={TRAIT_CONFIG.CD.color} />
                 <StatBar labelL="Feature" labelR="Fixer" score={MOCK_RESULT.stats.FX} color={TRAIT_CONFIG.FX.color} />
                 <StatBar labelL="Day" labelR="Night" score={MOCK_RESULT.stats.DN} color={TRAIT_CONFIG.DN.color} />
              </div>

              {/* Bottom: Logs (Collaboration) */}
              <div className="flex-1 p-8 bg-[#0c0c0e]">
                 <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <GitMerge size={14} /> Merge Conflicts Log
                 </div>
                 
                 <div className="space-y-3 font-mono text-[10px] md:text-xs">
                    {LOGS.map((log, i) => (
                       <div key={i} className="group flex gap-3 opacity-80 hover:opacity-100 transition">
                          <span className="text-gray-600 shrink-0">{log.time}</span>
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-0.5">
                                <span className={`font-bold ${log.status === 'error' ? COLORS.error : log.status === 'warn' ? COLORS.warn : COLORS.success}`}>
                                   {log.event}
                                </span>
                                <span className="text-gray-600 text-[9px] border border-[#333] px-1 rounded">
                                   target: {log.type}
                                </span>
                             </div>
                             <span className="text-gray-400">
                                {`>> ${log.msg}`}
                             </span>
                          </div>
                       </div>
                    ))}
                    <div className="animate-pulse text-blue-500 mt-4">_</div>
                 </div>
              </div>

           </div>
        </div>

        {/* Window Footer */}
        <div className="px-5 py-2 bg-[#09090b] border-t border-[#27272a] flex justify-between items-center text-[10px] font-mono text-gray-600">
           <div className="flex gap-4">
              <span>CPU: 12%</span>
              <span>MEM: 450MB</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>SYSTEM ONLINE</span>
           </div>
        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}