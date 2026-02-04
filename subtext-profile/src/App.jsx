import React, { useEffect, useState } from 'react';
import { 
  GitMerge, Terminal, Activity, Share2, Code, ChevronDown, Globe, Search, Loader, Github, ArrowLeft, Users 
} from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import DevTools from './DevTools';
import { COLORS, PROFILES, TRAIT_CONFIG, LOGS, UI_TEXT } from './constants';
import { signInWithGitHub, auth } from './firebase';
import { fetchRepoContributors, analyzeContributorInRepo } from './githubClient';
import { onAuthStateChanged } from 'firebase/auth';

// --- 1. THE "OLD" BACKGROUND (RESTORED) ---
const GitGraphBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fadeUp" x1="0" y1="1" x2="0" y2="0">
           <stop offset="0%" stopColor="#000" stopOpacity="1" />
           <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Abstract Git Flow Lines */}
      <path d="M160 1200 V-200" stroke="#333" strokeWidth="3" fill="none" />
      <path d="M60 1200 L60 700 C60 500 160 500 160 300" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      <path d="M260 1200 L260 850 C260 650 160 650 160 450" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      
      {/* Commit Dots & Tags */}
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
      <div className="text-xs uppercase text-zinc-300 font-bold tracking-[0.2em] mb-3 text-center">{title}</div>
      <div className="flex justify-between mb-2 font-bold tracking-tight uppercase text-xs">
        <span className={isLeftDominant ? 'text-white' : 'text-zinc-600'}>{`<${labelL} />`}</span>
        <span className={!isLeftDominant ? 'text-white' : 'text-zinc-600'}>{`<${labelR} />`}</span>
      </div>
      <div className={`h-3 bg-[#1a1a1a] border border-[#333] w-full relative rounded-full overflow-hidden flex ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
         <div className={`h-full transition-all duration-1000 ease-out ${color} opacity-90 rounded-full`} style={{ width: `${width}%` }} />
      </div>
      <div className={`flex mt-1 text-[10px] text-blue-400 font-mono font-bold ${isLeftDominant ? 'justify-start' : 'justify-end'}`}>
        <span>{dominantPercentage}% {isLeftDominant ? labelL : labelR}</span>
      </div>
    </div>
  );
};


export default function App() {
  const [token, setToken] = useState(null);
  
  // UI States
  const [view, setView] = useState('SEARCH'); // 'SEARCH' | 'LIST' | 'PROFILE'
  const [repoQuery, setRepoQuery] = useState('');
  const [contributors, setContributors] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(PROFILES.NINJA);
  const [lang, setLang] = useState('en'); 

  // Persistence
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

  const handleLogin = async () => {
    try {
      const { user, token } = await signInWithGitHub();
      setToken(token);
      localStorage.setItem('gh_token', token); 
    } catch (e) {
      alert("Login failed");
    }
  };

  const handleScanRepo = async (e) => {
    e.preventDefault();
    if (!repoQuery || !token) return;
    setLoading(true);
    try {
      const list = await fetchRepoContributors(token, repoQuery);
      setContributors(list);
      setView('LIST');
    } catch (err) {
      alert("Repo not found (check permissions?)");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContributor = async (contributor) => {
    setLoading(true);
    try {
      const result = await analyzeContributorInRepo(token, repoQuery, contributor);
      
      let baseProfile = PROFILES.NINJA;
      if (result.type.includes('M') && result.type.includes('X')) baseProfile = PROFILES.MECH;
      else if (result.type.includes('M') && result.type.includes('F')) baseProfile = PROFILES.WIZARD;
      else if (result.type.includes('A') && result.type.includes('X')) baseProfile = PROFILES.DRONE;

      setData({
        ...baseProfile,
        type: result.type,
        title: `${contributor.name}_${result.type}`,
        stats: result.stats
      });
      
      setView('PROFILE');
    } catch (err) {
      console.error(err);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const t = UI_TEXT[lang];

  return (
    <div className={`min-h-screen ${COLORS.bg} text-gray-400 font-sans selection:bg-blue-500/20`}>
      
      {/* THE BACKGROUND YOU WANTED */}
      <GitGraphBackground />
      
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-[#09090b]/80 border-b border-white/5">
         <div className="flex items-center gap-3">
             <Terminal size={18} className="text-gray-400"/>
             <span className="hidden md:inline font-mono font-bold tracking-wider text-gray-200 text-sm">{t.navbar_title}</span>
         </div>

         <div className="flex-1 max-w-md mx-6 flex justify-center">
            {!token ? (
                <button onClick={handleLogin} className="bg-[#238636] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#2ea043] flex items-center gap-2 shadow-lg transition transform hover:scale-105">
                  <Github size={16} /> CONNECT GITHUB
                </button>
            ) : (
                <form onSubmit={handleScanRepo} className="w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={14} className="text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={repoQuery}
                      onChange={(e) => setRepoQuery(e.target.value)}
                      placeholder="owner/repo (e.g. facebook/react)" 
                      className="w-full bg-[#121212] border border-[#333] text-gray-300 text-xs rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1a] transition-all font-mono shadow-inner"
                    />
                    {loading && <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><Loader size={14} className="animate-spin text-blue-500" /></div>}
                </form>
            )}
         </div>

         <div className="flex gap-4">
             <button onClick={() => setLang(lang === 'en' ? 'ko' : 'en')} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition border border-gray-700 px-3 py-2 rounded-full hover:bg-gray-800">
                <Globe size={14} /> {lang === 'en' ? 'KO' : 'EN'}
             </button>
         </div>
      </nav>

      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-12 lg:pt-32">
         
         {/* --- VIEW 1: SEARCH STATE --- */}
         {view === 'SEARCH' && (
            <div className="text-center animate-fade-in max-w-lg">
              <Github size={64} className="mx-auto text-gray-700 mb-6" />
              <h1 className="text-3xl font-bold text-gray-300 mb-2">Identify Your Team</h1>
              <p className="text-gray-500 mb-8">Enter a public repository to analyze the coding personalities of its top contributors using Waterfall Logic (Messages > Diffs > Files).</p>
            </div>
         )}

         {/* --- VIEW 2: CONTRIBUTOR LIST --- */}
         {view === 'LIST' && (
           <div className="max-w-4xl w-full animate-fade-in">
             <button onClick={() => setView('SEARCH')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 uppercase text-xs font-bold tracking-widest">
               <ArrowLeft size={12}/> Back to Search
             </button>
             <div className="flex items-center gap-4 mb-8">
                <Users className="text-blue-500" size={24}/>
                <h2 className="text-xl font-bold text-white">Active Agents</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {contributors.map((user) => (
                 <button key={user.name} onClick={() => handleSelectContributor(user)} className="flex items-center gap-4 p-4 bg-[#121212]/80 backdrop-blur border border-[#27272a] rounded-xl hover:border-blue-500 hover:bg-[#1a1a1a] transition text-left group">
                   <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : <div className="w-full h-full flex items-center justify-center text-xs">?</div>}
                   </div>
                   <div className="min-w-0">
                     <div className="font-bold text-gray-200 group-hover:text-blue-400 truncate">{user.name}</div>
                     <div className="text-xs text-gray-500 font-mono">{user.commits.length} commits detected</div>
                   </div>
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* --- VIEW 3: PROFILE (The "Old UI" restored) --- */}
         {view === 'PROFILE' && (
            <div className="max-w-7xl w-full flex flex-col items-center gap-12 lg:gap-24 animate-fade-in">
               
               <div className="w-full flex justify-start">
                 <button onClick={() => setView('LIST')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition">
                   <ArrowLeft size={12}/> Back to Team
                 </button>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 text-center md:text-left">
                  <div>
                    <div className="text-sm font-bold text-gray-500 mb-2 tracking-[0.3em] uppercase">{t.identity_label}</div>
                    <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">{data.type}</h1>
                    <div className="text-2xl lg:text-3xl font-mono text-gray-500 font-light border-l-4 border-gray-700 pl-6 inline-block">{data.title}</div>
                  </div>
                  <div className="transform scale-100 lg:scale-150 origin-center md:origin-left">
                     <AsciiPortrait type={data.type} />
                  </div>
               </div>

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
         )}
         
         {view === 'PROFILE' && (
           <div className="mt-12 lg:absolute lg:bottom-10 animate-bounce text-gray-600">
              <ChevronDown size={32} />
           </div>
         )}
      </section>

      {/* --- DETAILS SECTION (Restoring the Commit Conflicts / Logs) --- */}
      {view === 'PROFILE' && (
        <section className="relative z-10 py-24 px-6">
           <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
              
              {/* LEFT COL: CODE PREVIEW */}
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
                        <div className="text-gray-500">// Generated Analysis for {data.title}</div>
                        <div className="text-gray-500">// Waterfall Logic: NLP -> Diff -> File</div>
                        <br/>
                        <div className="flex"><span className="text-purple-400">const</span> <span className="text-yellow-400">User</span> = <span className="text-blue-400">{'{'}</span></div>
                        <div className="pl-4"><span className="text-red-400">type</span>: <span className="text-green-400">"{data.type}"</span>,</div>
                        <div className="pl-4"><span className="text-red-400">stats</span>: <span className="text-blue-400">{JSON.stringify(data.stats)}</span></div>
                        <div className="text-blue-400">{'}'}</div>
                    </div>
                 </div>
              </div>

              {/* RIGHT COL: COMMIT CONFLICTS / COMPATIBILITY (RESTORED) */}
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
      )}
    </div>
  );
}