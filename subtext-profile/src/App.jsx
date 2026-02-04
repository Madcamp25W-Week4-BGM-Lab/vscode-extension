import React, { useEffect, useState } from 'react';
import { 
  GitMerge, Terminal, Activity, Share2, Code, ChevronDown 
} from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import DevTools from './DevTools';
import { COLORS, PROFILES, TRAIT_CONFIG, LOGS } from './constants';

// --- COMPONENTS ---

const CircuitBackground = () => (
  <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
    <svg className="w-full h-full" patternUnits="userSpaceOnUse" width="100" height="100">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#555" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
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
        <div className="w-1/2 h-full flex justify-end relative">
             <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90`} style={{ width: isLeft ? `${width}%` : '0%' }} />
        </div>
        <div className="w-1/2 h-full flex justify-start relative">
             <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90`} style={{ width: !isLeft ? `${width}%` : '0%' }} />
        </div>
      </div>

      <div className="flex justify-between mt-1 text-[11px] text-gray-500 font-mono">
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
      
      <CircuitBackground />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-[#09090b]/80 border-b border-white/5">
         <div className="flex items-center gap-3">
             <Terminal size={18} className="text-blue-500"/>
             <span className="font-mono font-bold tracking-wider text-gray-200 text-sm">SUBTEXT_ANALYZER</span>
         </div>
         <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-2 transition border border-blue-500/30 px-4 py-2 rounded-full hover:bg-blue-500/10">
             EXPORT RESULT <Share2 size={14} />
         </button>
      </nav>

      {/* --- HERO SECTION --- */}
      {/* UPDATE 1: Used min-h-[fit-content] and better padding to handle small screens gracefully */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 lg:pt-32">
         
         {/* UPDATE 2: Responsive gap (gap-12 mobile, gap-20 desktop) */}
         <div className="max-w-7xl w-full flex flex-col items-center gap-12 lg:gap-24">
            
            {/* ROW 1: IDENTITY */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 text-center md:text-left">
               
               <div>
                 <div className="text-sm font-bold text-blue-500 mb-2 tracking-[0.3em] uppercase">Identity Calculated</div>
                 
                 {/* UPDATE 3: Responsive Font Size (6xl mobile, 9xl desktop) */}
                 <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                   {data.type}
                 </h1>
                 
                 <div className="text-2xl lg:text-3xl font-mono text-gray-400 font-light border-l-4 border-blue-500 pl-6 inline-block">
                   {data.title}
                 </div>
               </div>

               {/* UPDATE 4: Responsive Scaling (100% mobile, 150% desktop) */}
               <div className="transform scale-100 lg:scale-150 origin-center md:origin-left">
                  <AsciiPortrait type={data.type} />
               </div>
            </div>

            {/* ROW 2: STATS CARD */}
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

         {/* Scroll Hint */}
         {/* UPDATE 5: Adjusted margin-top so it doesn't overlap on small screens */}
         <div className="mt-12 lg:absolute lg:bottom-10 animate-bounce text-gray-600">
            <ChevronDown size={32} />
         </div>
      </section>


      {/* --- DETAILS SECTION --- */}
      <section className="relative z-10 py-24 px-6 border-t border-[#27272a] bg-[#0c0c0e]">
         <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: CODE WINDOW */}
            <div className="lg:col-span-7">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="text-blue-500"/> Source Definition
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
                     <span className="text-gray-600 mr-4 select-none">1</span><span className={COLORS.s_key}>const</span> <span className={COLORS.s_num}>Profile</span> = {'{'}<br/>
                     <span className="text-gray-600 mr-4 select-none">2</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"type"</span>: <span className={COLORS.s_str}>"{data.type}"</span>,<br/>
                     <span className="text-gray-600 mr-4 select-none">3</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"alias"</span>: <span className={COLORS.s_str}>"{data.title}"</span>,<br/>
                     <span className="text-gray-600 mr-4 select-none">4</span>&nbsp;&nbsp;<span className={COLORS.s_key}>"traits"</span>: [<br/>
                     <span className="text-gray-600 mr-4 select-none">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className={COLORS.s_str}>"{data.type.includes('A') ? 'Atomic' : 'Monolithic'}"</span>, <span className={COLORS.s_str}>"{data.type.includes('N') ? 'NightOwl' : 'DayCoder'}"</span><br/>
                     <span className="text-gray-600 mr-4 select-none">6</span>&nbsp;&nbsp;],<br/>
                     <div className="flex items-start">
                        <span className="text-gray-600 mr-4 select-none mt-1">7</span>
                        <div>
                           <span className={COLORS.s_key}>"desc"</span>: <span className={COLORS.s_str}>"{data.description}"</span>
                        </div>
                     </div>
                     <span className="text-gray-600 mr-4 select-none">8</span>{'}'};<span className="animate-pulse w-2 h-4 bg-blue-500/50 inline-block align-middle ml-1"></span>
                  </div>
               </div>
            </div>

            {/* RIGHT: LOGS */}
            <div className="lg:col-span-5 flex flex-col justify-center">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <GitMerge className="text-purple-500"/> Compatibility Log
               </h3>

               <div className="space-y-4">
                  {LOGS.map((log, i) => (
                     <div key={i} className="bg-[#121212] border border-[#27272a] p-5 rounded-xl hover:border-gray-600 transition group">
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-xs font-bold uppercase tracking-wider ${log.status === 'error' ? COLORS.error : log.status === 'warn' ? COLORS.warn : COLORS.success}`}>
                              {log.event}
                           </span>
                           <span className="font-mono text-[10px] text-gray-600">{log.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 font-mono">{`>> ${log.msg}`}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-500 uppercase">Target Unit:</span>
                           <span className="text-[10px] font-mono bg-[#222] px-2 py-0.5 rounded text-blue-400 border border-[#333]">
                              {log.type}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-[10px] font-mono text-gray-600 border-t border-[#27272a] bg-[#09090b]">
         <p className="mb-2">SUBTEXT VSCODE EXTENSION</p>
         <p>SYSTEM ONLINE // v2.4.0</p>
      </footer>

      <DevTools data={data} setData={setData} toggleTrait={toggleTrait} />
    </div>
  );
}