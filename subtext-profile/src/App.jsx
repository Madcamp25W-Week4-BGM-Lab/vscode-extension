import React, { useEffect, useState } from 'react';
import { 
  GitMerge, Terminal, Activity, Share2, Code, ChevronDown 
} from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import DevTools from './DevTools';
import { COLORS, PROFILES, TRAIT_CONFIG, LOGS } from './constants';

// --- COMPONENT: GREYSCALE GIT GRAPH (Unchanged) ---
const GitGraphBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fadeUp" x1="0" y1="1" x2="0" y2="0">
           <stop offset="0%" stopColor="#000" stopOpacity="1" />
           <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M160 1200 V-200" stroke="#333" strokeWidth="3" fill="none" />
      <path d="M60 1200 L60 700 C60 500 160 500 160 300" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      <path d="M260 1200 L260 850 C260 650 160 650 160 450" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      
      {/* Nodes */}
      <circle cx="160" cy="200" r="10" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="190" y="205" className="text-xs fill-zinc-600 font-mono font-bold tracking-widest">v2.5.0</text>
      <circle cx="160" cy="300" r="8" fill="#09090b" stroke="#444" strokeWidth="2" />
      <text x="190" y="305" className="text-[10px] fill-zinc-700 font-mono">merge: feat/ui</text>
      <circle cx="160" cy="450" r="8" fill="#09090b" stroke="#444" strokeWidth="2" />
      <text x="190" y="455" className="text-[10px] fill-zinc-700 font-mono">merge: hotfix-api</text>
      <circle cx="160" cy="700" r="4" fill="#333" />
      <circle cx="160" cy="900" r="4" fill="#333" />
      <circle cx="160" cy="1100" r="4" fill="#333" />
      <circle cx="60" cy="700" r="6" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="80" y="705" className="text-[10px] fill-zinc-600 font-mono">feat: dark_mode</text>
      <circle cx="260" cy="850" r="6" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="280" y="855" className="text-[10px] fill-zinc-600 font-mono">fix: memory_leak</text>
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#09090b] to-transparent"></div>
  </div>
);

const TrafficLights = () => (
  <div className="flex gap-2">
    <div className="w-3 h-3 rounded-full bg-[#333] border border-[#444]"></div>
    <div className="w-3 h-3 rounded-full bg-[#333] border border-[#444]"></div>
    <div className="w-3 h-3 rounded-full bg-[#333] border border-[#444]"></div>
  </div>
);

// --- UPDATED STATBAR: Accepts Dynamic Color ---
const StatBar = ({ labelL, labelR, score, color }) => {
  const [width, setWidth] = useState(0);
  const isLeft = score >= 50;
  const relativePct = isLeft ? (score - 50) * 2 : (50 - score) * 2;
  
  useEffect(() => { 
    const timer = setTimeout(() => setWidth(relativePct), 300); 
    return () => clearTimeout(timer);
  }, [relativePct]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 opacity-90 font-bold tracking-tight uppercase text-xs">
        <span className={isLeft ? 'text-white' : 'text-gray-600'}>{`<${labelL} />`}</span>
        <span className={!isLeft ? 'text-white' : 'text-gray-600'}>{`<${labelR} />`}</span>
      </div>

      <div className="h-6 bg-[#1a1a1a] border border-[#333] w-full flex relative rounded-sm overflow-hidden">
        <div className="absolute left-1/2 w-[1px] h-full bg-[#444] z-20"></div>
        {/* Dynamic Color injected here */}
        <div className="w-1/2 h-full flex justify-end relative">
             <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90`} style={{ width: isLeft ? `${width}%` : '0%' }} />
        </div>
        <div className="w-1/2 h-full flex justify-start relative">
             <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90`} style={{ width: !isLeft ? `${width}%` : '0%' }} />
        </div>
      </div>

      <div className="flex justify-between mt-1 text-[11px] text-gray-500 font-mono">
        {/* Percentage color matches bar color if you want, or keeps blue-400. 
            Here I used the generic accent or specific logic if needed. 
            Keeping blue-400 for text readability. */}
        <span className={isLeft ? 'text-blue-400 font-bold' : 'opacity-0'}>{relativePct}%</span>
        <span className={!isLeft ? 'text-blue-400 font-bold' : 'opacity-0'}>{relativePct}%</span>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [data, setData] = useState(PROFILES.NINJA);

  const toggleTrait = (letter1, letter2) => {
    setData(prev => ({
      ...prev,
      type: prev.type.includes(letter1) 
        ? prev.type.replace(letter1, letter2) 
        : prev.type.replace(letter2, letter1)
    }));
  };

  return (
    <div className={`min-h-screen ${COLORS.bg} text-gray-400 font-sans selection:bg-blue-500/20`}>
      
      <GitGraphBackground />
      
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-[#09090b]/80 border-b border-white/5">
         <div className="flex items-center gap-3">
             <Terminal size={18} className="text-gray-400"/>
             <span className="font-mono font-bold tracking-wider text-gray-200 text-sm">SUBTEXT_ANALYZER</span>
         </div>
         <button className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition border border-gray-700 px-4 py-2 rounded-full hover:bg-gray-800">
             EXPORT RESULT <Share2 size={14} />
         </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 lg:pt-32">
         
         <div className="max-w-7xl w-full flex flex-col items-center gap-12 lg:gap-24">
            
            {/* IDENTITY */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 text-center md:text-left">
               <div>
                 <div className="text-sm font-bold text-gray-500 mb-2 tracking-[0.3em] uppercase">Identity Calculated</div>
                 <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                   {data.type}
                 </h1>
                 <div className="text-2xl lg:text-3xl font-mono text-gray-500 font-light border-l-4 border-gray-700 pl-6 inline-block">
                   {data.title}
                 </div>
               </div>

               <div className="transform scale-100 lg:scale-150 origin-center md:origin-left">
                  <AsciiPortrait type={data.type} />
               </div>
            </div>

            {/* STATS CARD - VIBRANT COLORS RESTORED */}
            <div className="w-full max-w-4xl mx-auto bg-[#121212] border border-[#27272a] p-8 lg:p-14 rounded-3xl shadow-2xl relative">
               <div className="absolute top-0 right-0 p-6 opacity-20 hidden md:block">
                  <Activity size={40} />
               </div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 lg:mb-10 border-b border-[#333] pb-4">
                  Core System Parameters
               </h3>
               
               <div className="flex flex-col gap-6 lg:gap-10">
                  <StatBar key={data.type + "AM"} labelL="Atomic" labelR="Monolithic" score={data.stats.AM} color={TRAIT_CONFIG.AM.color} />
                  <StatBar key={data.type + "CD"} labelL="Concise" labelR="Descriptive" score={data.stats.CD} color={TRAIT_CONFIG.CD.color} />
                  <StatBar key={data.type + "FX"} labelL="Feature" labelR="Fixer" score={data.stats.FX} color={TRAIT_CONFIG.FX.color} />
                  <StatBar key={data.type + "DN"} labelL="Day" labelR="Night" score={data.stats.DN} color={TRAIT_CONFIG.DN.color} />
               </div>
            </div>
         </div>

         <div className="mt-12 lg:absolute lg:bottom-10 animate-bounce text-gray-600">
            <ChevronDown size={32} />
         </div>
      </section>

      {/* --- DETAILS SECTION --- */}
      <section className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
            
            {/* CODE WINDOW */}
            <div className="lg:col-span-7">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="text-gray-500"/> Source Definition
               </h3>
               
               <div className={`${COLORS.window} border border-[#333] rounded-lg shadow-2xl overflow-hidden`}>
                  <div className="px-5 py-3 border-b border-[#27272a] flex justify-between items-center bg-[#151517]">
                     <div className="flex items-center gap-4">
                        <TrafficLights />
                        <span className="text-xs font-mono font-bold text-gray-500">profile.json</span>
                     </div>
                     <div className="text-[10px] uppercase font-bold text-gray-600">Read Only</div>
                  </div>
                  
                  <div className="p-8 font-mono text-sm leading-loose overflow-x-auto">
                     <span className="text-gray-700 mr-4 select-none">1</span><span className={COLORS.s_key}>const</span> <span className={COLORS.s_num}>Profile</span> = {'{'}<br/>
                     <span className="text-gray-700 mr-4 select-none">2</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"type"</span>: <span className={COLORS.s_str}>"{data.type}"</span>,<br/>
                     <span className="text-gray-700 mr-4 select-none">3</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"alias"</span>: <span className={COLORS.s_str}>"{data.title}"</span>,<br/>
                     <span className="text-gray-700 mr-4 select-none">4</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"traits"</span>: [<br/>
                     <span className="text-gray-700 mr-4 select-none">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className={COLORS.s_str}>"{data.type.includes('A') ? 'Atomic' : 'Monolithic'}"</span>, <span className={COLORS.s_str}>"{data.type.includes('N') ? 'NightOwl' : 'DayCoder'}"</span><br/>
                     <span className="text-gray-700 mr-4 select-none">6</span>&nbsp;&nbsp;],<br/>
                     <div className="flex items-start">
                        <span className="text-gray-700 mr-4 select-none mt-1">7</span>
                        <div>
                           <span className={COLORS.s_key}>"desc"</span>: <span className={COLORS.s_str}>"{data.description}"</span>
                        </div>
                     </div>
                     <span className="text-gray-700 mr-4 select-none">8</span>{'}'};<span className="animate-pulse w-2 h-4 bg-gray-500/50 inline-block align-middle ml-1"></span>
                  </div>
               </div>
            </div>

            {/* LOGS - VIBRANT COLORS RESTORED */}
            <div className="lg:col-span-5 flex flex-col justify-center">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <GitMerge className="text-purple-500"/> Compatibility Log
               </h3>

               <div className="space-y-4">
                  {LOGS.map((log, i) => (
                     <div key={i} className="bg-[#121212] border border-[#27272a] p-5 rounded-xl hover:border-gray-600 transition group">
                        <div className="flex justify-between items-start mb-2">
                           {/* Restored Bright/Neon Text Colors */}
                           <span className={`text-xs font-bold uppercase tracking-wider ${log.status === 'error' ? 'text-red-400' : log.status === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {log.event}
                           </span>
                           <span className="font-mono text-[10px] text-gray-600">{log.time}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 font-mono">{`>> ${log.msg}`}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-600 uppercase">Target Unit:</span>
                           <span className="text-[10px] font-mono bg-[#222] px-2 py-0.5 rounded text-gray-400 border border-[#333]">
                              {log.type}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </section>

      <footer className="py-12 text-center text-[10px] font-mono text-gray-600 border-t border-[#27272a] bg-[#09090b]">
         <p className="mb-2">SUBTEXT VSCODE EXTENSION</p>
         <p>SYSTEM ONLINE // v2.4.0</p>
      </footer>

      <DevTools data={data} setData={setData} toggleTrait={toggleTrait} />
    </div>
  );
}