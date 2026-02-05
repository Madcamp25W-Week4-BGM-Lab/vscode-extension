import React, { useState, useEffect } from 'react';
import { Activity, Code, GitMerge, ChevronDown } from 'lucide-react'; 
import AsciiPortrait from '../AsciiPortrait'; 
import { TRAIT_CONFIG, LOGS } from '../constants';

// --- INTERNAL HELPER COMPONENTS ---

const TrafficLights = () => (
  <div className="flex gap-2">
    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
  </div>
);

const StatBar = ({ title, labelL, labelR, score, color }) => {
  const [width, setWidth] = useState(0);
  const isLeftDominant = score >= 50;
  const dominantPercentage = isLeftDominant ? score : 100 - score;

  useEffect(() => { 
    const timer = setTimeout(() => setWidth(dominantPercentage), 300); 
    return () => clearTimeout(timer);
  }, [dominantPercentage]);

  return (
    <div className="w-full">
      <div className="text-sm uppercase text-zinc-300 font-bold tracking-[0.2em] mb-3 text-center">{title}</div>
      <div className="flex justify-between mb-2 font-bold tracking-tight uppercase text-xs">
        <span className={isLeftDominant ? 'text-white' : 'text-zinc-600'}>{`<${labelL} />`}</span>
        <span className={!isLeftDominant ? 'text-white' : 'text-zinc-600'}>{`<${labelR} />`}</span>
      </div>
      <div className={`h-3 bg-[#1a1a1a] border border-[#333] w-full relative rounded-full overflow-hidden flex ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
         <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90 rounded-full`} style={{ width: `${width}%` }} />
      </div>
      <div className={`flex mt-1 text-[13px] text-blue-400 font-mono font-bold ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
        <span>{dominantPercentage}% {isLeftDominant ? labelL : labelR}</span>
      </div>
    </div>
  );
};

const CodeLine = ({ num, children }) => (
  <div className="flex hover:bg-[#ffffff05] transition-colors -mx-4 px-4 leading-6">
    <span className="text-[#4b5563] select-none w-8 text-right mr-4 shrink-0 font-mono text-[10px] pt-1">{num}</span>
    <span className="whitespace-pre-wrap break-all">{children}</span>
  </div>
);

// --- MAIN COMPONENT ---

const ProfileView = ({ data, t, lang }) => {
  return (
    <>
      <div className="max-w-7xl w-full flex flex-col items-center gap-12 lg:gap-24 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 text-center md:text-left">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-2 tracking-[0.3em] uppercase">{t.identity_label}</div>
            <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">{data.type}</h1>
            <div className="text-2xl lg:text-3xl font-mono text-gray-500 font-light border-l-4 border-gray-700 pl-6 inline-block">{data.title}</div>
          </div>
          <div className="transform scale-100 lg:scale-150 origin-center md:origin-left">
             <AsciiPortrait type={data.type} variant="full" />
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto bg-[#121212] border border-[#27272a] p-8 lg:p-14 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 right-0 p-6 opacity-20 hidden md:block"><Activity size={40} /></div>
          <div className="flex flex-col gap-10 lg:gap-14 pt-4">
             <StatBar title={t.stat_granularity} labelL={t.trait_atomic} labelR={t.trait_monolithic} score={data.stats.AM} color={TRAIT_CONFIG.AM.color} />
             <StatBar title={t.stat_style} labelL={t.trait_concise} labelR={t.trait_descriptive} score={data.stats.CD} color={TRAIT_CONFIG.CD.color} />
             <StatBar title={t.stat_problem} labelL={t.trait_feature} labelR={t.trait_fixer} score={data.stats.FX} color={TRAIT_CONFIG.FX.color} />
             <StatBar title={t.stat_activity} labelL={t.trait_day} labelR={t.trait_night} score={data.stats.DN} color={TRAIT_CONFIG.DN.color} />
          </div>
        </div>
      </div>
      
      <div className="mt-12 lg:absolute lg:bottom-10 animate-bounce text-gray-600">
        <ChevronDown size={32} />
      </div>

      {/* DETAILS SECTION */}
      <section className="relative z-10 py-24 px-6 animate-fade-in-up w-full max-w-6xl mx-auto flex flex-col gap-16">
           
           {/* SECTION 1: COMPATIBILITY LOGS */}
           <div className="w-full">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 <GitMerge className="text-purple-500"/> {t.compatibility}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {LOGS.map((log, i) => (
                    <div key={i} className="bg-[#121212] border border-[#27272a] p-5 rounded-xl hover:border-gray-600 transition group relative overflow-hidden flex items-start gap-5">
                       
                       {/* Status Indicator Line */}
                       <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.status === 'error' ? 'bg-red-500' : log.status === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                       
                       {/* Compact ASCII Portrait */}
                       <AsciiPortrait type={log.type} variant="compact" />

                       {/* Log Content */}
                       <div className="flex flex-col w-full min-w-0">
                          {/* Header: Event & Time */}
                          <div className="flex justify-between items-center mb-2">
                             <span className={`text-xs font-bold uppercase tracking-wider ${log.status === 'error' ? 'text-red-400' : log.status === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {log.event}
                             </span>
                             <span className="font-mono text-[10px] text-gray-600">{log.time}</span>
                          </div>

                          {/* Message */}
                          <p className="text-sm text-gray-400 mb-4 font-mono leading-relaxed break-words">
                             {`>> ${log.msg[lang]}`}
                          </p>

                          {/* Target Unit */}
                          <div className="mt-auto">
                             <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">{t.target_unit}:</div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-mono bg-[#1a1a1a] px-2 py-1 rounded text-gray-300 border border-[#333] tracking-widest group-hover:border-gray-500 transition-colors">
                                   {log.type}
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* SECTION 2: SOURCE DEFINITION */}
           <div className="w-full">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 <Code className="text-gray-500"/> {t.source_def}
              </h3>
              <div className="bg-[#121212] border border-[#333] rounded-lg shadow-2xl overflow-hidden font-mono text-sm w-full">
                 <div className="px-4 py-3 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
                    <div className="flex items-center gap-4">
                       <TrafficLights />
                       <span className="text-xs text-gray-400 font-bold opacity-75">profile.js</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-600 tracking-wider">READ ONLY</div>
                 </div>
                 <div className="p-6 overflow-x-auto">
                     <CodeLine num={1}><span className="text-gray-500">/**</span></CodeLine>
                     <CodeLine num={2}>
                        <span className="text-gray-500">* </span><span className="text-purple-400">@class</span> <span className="text-white font-bold">{data.title}</span>
                     </CodeLine>
                     {data.description[lang].split('\n').map((line, i) => (
                       <CodeLine num={4 + i} key={i}>
                          <span className="text-gray-500">* </span><span className="text-gray-300">{line}</span>
                       </CodeLine>
                     ))}
                     <CodeLine num={11 + data.description[lang].split('\n').length}>
                        <span className="text-yellow-400">{'}'}</span><span className="text-white">;</span><span className="ml-1 inline-block w-2.5 h-5 bg-blue-500 align-middle animate-pulse"></span>
                     </CodeLine>
                 </div>
              </div>
           </div>

      </section>
    </>
  );
};

export default ProfileView;