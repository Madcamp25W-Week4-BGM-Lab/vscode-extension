import React, { useEffect, useState } from 'react';
import { 
  GitMerge, Terminal, Activity, Share2, Code, ChevronDown, Globe, Search, Loader, Github 
} from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import DevTools from './DevTools';
import { COLORS, PROFILES, TRAIT_CONFIG, LOGS, UI_TEXT } from './constants';
import { signInWithGitHub, logout, auth } from './firebase';
import { analyzeProfile } from './githubClient';
import { onAuthStateChanged } from 'firebase/auth';

// --- GIT GRAPH BACKGROUND ---
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

// --- TRAFFIC LIGHTS ---
const TrafficLights = () => (
  <div className="flex gap-2">
    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
  </div>
);

// --- STAT BAR ---
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
      <div className="text-xs uppercase text-zinc-300 font-bold tracking-[0.2em] mb-3 text-center">
        {title}
      </div>
      <div className="flex justify-between mb-2 font-bold tracking-tight uppercase text-xs">
        <span className={isLeftDominant ? 'text-white' : 'text-zinc-600 transition-colors duration-500'}>{`<${labelL} />`}</span>
        <span className={!isLeftDominant ? 'text-white' : 'text-zinc-600 transition-colors duration-500'}>{`<${labelR} />`}</span>
      </div>
      <div className={`h-3 bg-[#1a1a1a] border border-[#333] w-full relative rounded-full overflow-hidden flex ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
         <div 
           className={`h-full transition-all duration-1000 ease-out ${color} opacity-90 rounded-full`}
           style={{ width: `${width}%` }} 
         />
      </div>
      <div className={`flex mt-1 text-[10px] text-blue-400 font-mono font-bold ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
        <span>{dominantPercentage}% {isLeftDominant ? labelL : labelR}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(PROFILES.NINJA);
  const [lang, setLang] = useState('en'); 

  // 1. Persistence Logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const storedToken = localStorage.getItem('gh_token');
        if (storedToken) setToken(storedToken);
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Login Handler
  const handleLogin = async () => {
    try {
      const { user, token } = await signInWithGitHub();
      setToken(token);
      localStorage.setItem('gh_token', token); 
    } catch (e) {
      alert("Login failed", e);
    }
  };

  // 3. Search Handler (CONNECTED)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username || !token) return;
    
    setLoading(true);
    try {
      const result = await analyzeProfile(token, username);
      
      // --- DATA MAPPING LOGIC (Added) ---
      // We take the 4-letter type code (e.g. "MCXD") and find the closest base profile
      let baseProfile = PROFILES.NINJA;
      if (result.type.includes('M') && result.type.includes('X')) baseProfile = PROFILES.MECH;
      else if (result.type.includes('M') && result.type.includes('F')) baseProfile = PROFILES.WIZARD;
      else if (result.type.includes('A') && result.type.includes('X')) baseProfile = PROFILES.DRONE;

      const mergedProfile = {
        ...baseProfile,
        type: result.type, // "MCXD"
        title: `${username}_${result.type}`, // Custom title
        stats: result.stats, // Real stats from GraphQL
        id: result.username // Github username
      };

      setData(mergedProfile);
      
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Check username or rate limit.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTrait = (letter1, letter2) => {
    setData(prev => ({
      ...prev,
      type: prev.type.includes(letter1) 
        ? prev.type.replace(letter1, letter2) 
        : prev.type.replace(letter2, letter1)
    }));
  };

  const t = UI_TEXT[lang];

  return (
    <div className={`min-h-screen ${COLORS.bg} text-gray-400 font-sans selection:bg-blue-500/20`}>
      
      <GitGraphBackground />
      
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-[#09090b]/80 border-b border-white/5">
         <div className="flex items-center gap-3">
             <Terminal size={18} className="text-gray-400"/>
             <span className="hidden md:inline font-mono font-bold tracking-wider text-gray-200 text-sm">
                {t.navbar_title}
             </span>
         </div>

         {/* --- UPDATED NAVBAR CENTER: AUTH SWITCHER --- */}
         <div className="flex-1 max-w-md mx-6 flex justify-center">
            {!token ? (
                // STATE 1: NOT LOGGED IN
                <button 
                  onClick={handleLogin}
                  className="bg-[#238636] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#2ea043] transition flex items-center gap-2 shadow-[0_0_15px_rgba(46,160,67,0.4)]"
                >
                  <Github size={16} /> CONNECT GITHUB
                </button>
            ) : (
                // STATE 2: LOGGED IN (SEARCH BAR)
                <form onSubmit={handleSearch} className="w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={14} className="text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="github_username" 
                      className="w-full bg-[#121212] border border-[#333] text-gray-300 text-xs rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1a] transition-all font-mono shadow-inner"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {loading ? <Loader size={14} className="animate-spin text-blue-500" /> : null}
                    </div>
                </form>
            )}
         </div>

         <div className="flex gap-4">
             <button 
                onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
                className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition border border-gray-700 px-3 py-2 rounded-full hover:bg-gray-800"
             >
                <Globe size={14} /> {lang === 'en' ? 'KO' : 'EN'}
             </button>

             <button className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition border border-gray-700 px-4 py-2 rounded-full hover:bg-gray-800">
                 {t.export_btn} <Share2 size={14} />
             </button>
         </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 lg:pt-32">
         <div className="max-w-7xl w-full flex flex-col items-center gap-12 lg:gap-24">
            
            {/* Identity & ASCII */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 text-center md:text-left">
               <div>
                 <div className="text-sm font-bold text-gray-500 mb-2 tracking-[0.3em] uppercase">
                    {t.identity_label}
                 </div>
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

            {/* Stats Card */}
            <div className="w-full max-w-4xl mx-auto bg-[#121212] border border-[#27272a] p-8 lg:p-14 rounded-3xl shadow-2xl relative">
               <div className="absolute top-0 right-0 p-6 opacity-20 hidden md:block">
                  <Activity size={40} />
               </div>
               
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
      </section>

      {/* --- DETAILS SECTION --- */}
      <section className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="text-gray-500"/> {t.source_def}
               </h3>
               
               <div className={`${COLORS.window} border border-[#333] rounded-lg shadow-2xl overflow-hidden`}>
                  <div className="px-5 py-3 border-b border-[#27272a] flex justify-between items-center bg-[#151517]">
                     <div className="flex items-center gap-4">
                        <TrafficLights />
                        <span className="text-xs font-mono font-bold text-gray-500">profile.js</span>
                     </div>
                     <div className="text-[10px] uppercase font-bold text-gray-600">{t.read_only}</div>
                  </div>
                  
                  <div className="p-8 font-mono text-sm leading-loose overflow-x-auto">
                     <div className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right">1</span><span className="text-gray-500">/**</span></div>
                     <div className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right">2</span><span className="text-gray-500"><span className="mr-3 opacity-50">*</span><span className="text-purple-400">@class</span> <span className="text-gray-300 font-bold">{data.title}</span></span></div>
                     <div className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right">3</span><span className="text-gray-500"><span className="mr-3 opacity-50">*</span><span className="text-purple-400">@bio</span></span></div>
                     
                     {data.description[lang].split('\n').map((line, i) => (
                        line === "" ? <div key={i} className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right"> </span><span className="text-gray-500"><span className="mr-3 opacity-50">*</span></span></div> :
                        <div key={i} className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right"> </span><span className="text-gray-500"><span className="mr-3 opacity-50">*</span>{line}</span></div>
                     ))}
                     
                     <div className="flex"><span className="text-gray-500 mr-4 select-none shrink-0 w-4 text-right"> </span><span className="text-gray-500">*/</span></div>

                     <div className="flex mt-2"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">9</span><span><span className={COLORS.s_key}>export const</span> <span className={COLORS.s_num}>Profile</span> = {'{'}<br/></span></div>
                     <div className="flex"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">10</span><span className="pl-4"><span className={COLORS.s_key}>"type"</span>: <span className={COLORS.s_str}>"{data.type}"</span>,</span></div>
                     <div className="flex"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">11</span><span className="pl-4"><span className={COLORS.s_key}>"traits"</span>: [</span></div>
                     <div className="flex"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">12</span><span className="pl-8"><span className={COLORS.s_str}>"{data.type.includes('A') ? 'Atomic' : 'Monolithic'}"</span>, <span className={COLORS.s_str}>"{data.type.includes('N') ? 'NightOwl' : 'DayCoder'}"</span></span></div>
                     <div className="flex"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">13</span><span className="pl-4">]</span></div>
                     <div className="flex"><span className="text-gray-600 mr-4 select-none shrink-0 w-4 text-right">14</span><span>{'}'};<span className="animate-pulse w-2 h-4 bg-blue-500/50 inline-block align-middle ml-1"></span></span></div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <GitMerge className="text-purple-500"/> {t.compatibility}
               </h3>
               <div className="space-y-4">
                  {LOGS.map((log, i) => (
                     <div key={i} className="bg-[#121212] border border-[#27272a] p-5 rounded-xl hover:border-gray-600 transition group">
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-xs font-bold uppercase tracking-wider ${log.status === 'error' ? 'text-red-400' : log.status === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {log.event}
                           </span>
                           <span className="font-mono text-[10px] text-gray-600">{log.time}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 font-mono">{`>> ${log.msg[lang]}`}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-600 uppercase">{t.target_unit}:</span>
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
         <p>{t.system_online} // v2.4.0</p>
      </footer>

      {/* DevTools is here if you need it, but the app works without it now */}
      <DevTools data={data} setData={setData} toggleTrait={toggleTrait} />
    </div>
  );
}