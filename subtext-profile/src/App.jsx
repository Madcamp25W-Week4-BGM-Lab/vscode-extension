import React, { useEffect, useState } from 'react';
import { Terminal, Globe, Search, Loader, Github, ArrowLeft } from 'lucide-react';

import DevTools from './DevTools';
import ProfileView from './components/ProfileView'; // Adjust path
import ListView from './components/ListView';       // Adjust path
import { COLORS, PROFILES, UI_TEXT } from './constants';

// --- VISUAL WRAPPERS ---

const GitGraphBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fadeUp" x1="0" y1="1" x2="0" y2="0">
           <stop offset="0%" stopColor="#000" stopOpacity="1" />
           <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Main Branch Line */}
      <path d="M160 1200 V-200" stroke="#333" strokeWidth="3" fill="none" />
      
      {/* Feature Branch Lines */}
      <path d="M60 1200 L60 700 C60 500 160 500 160 300" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      <path d="M260 1200 L260 850 C260 650 160 650 160 450" stroke="#52525b" strokeWidth="2" strokeDasharray="10 10" fill="none" opacity="0.4" />
      
      {/* Commit Dots & Messages */}
      <circle cx="160" cy="200" r="10" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="190" y="205" className="text-xs fill-zinc-600 font-mono font-bold tracking-widest">v2.5.0</text>
      
      <circle cx="160" cy="300" r="8" fill="#09090b" stroke="#444" strokeWidth="2" />
      <text x="190" y="305" className="text-[10px] fill-zinc-700 font-mono">merge: feat/ui</text>
      
      <circle cx="160" cy="450" r="8" fill="#09090b" stroke="#444" strokeWidth="2" />
      <text x="190" y="455" className="text-[10px] fill-zinc-700 font-mono">merge: hotfix-api</text>
      
      <circle cx="60" cy="700" r="6" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="80" y="705" className="text-[10px] fill-zinc-600 font-mono">feat: dark_mode</text>
      
      <circle cx="260" cy="850" r="6" fill="#09090b" stroke="#52525b" strokeWidth="2" />
      <text x="280" y="855" className="text-[10px] fill-zinc-600 font-mono">fix: memory_leak</text>
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#09090b] to-transparent"></div>
  </div>
);
const BackButton = ({ onClick, label }) => (
  <button 
    onClick={onClick} 
    className="group flex items-center gap-3 px-4 py-2 bg-[#121212] border border-[#333] rounded-full text-xs font-bold text-gray-400 hover:text-white hover:border-zinc-500 hover:bg-[#1a1a1a] transition-all shadow-lg mb-8"
  >
    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
    <span className="uppercase tracking-widest">{label}</span>
  </button>
);

// --- MAIN CONTROLLER ---

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

export default function App() {
  const [view, setView] = useState('SEARCH'); 
  const [repoQuery, setRepoQuery] = useState('');
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(PROFILES.ACFN);
  const [lang, setLang] = useState('en'); 
  const [isConnected, setIsConnected] = useState(false);

  // --- MESSAGE LISTENER ---
  useEffect(() => {
    const handleMessage = (event) => {
        const message = event.data;
        if (message.command === 'LOAD_PROFILE') {
            const { type, username, stats } = message.payload;
            let matchedProfile = PROFILES[type] || PROFILES.ACFN;
            setData({
                ...matchedProfile,
                type: type,
                title: `${username}_${matchedProfile.title}`, 
                stats: stats
            });
            setLoading(false);
            setView('PROFILE');
        }
        if (message.command === 'SEARCH_RESULTS') {
            setContributors(message.payload);
            setLoading(false);
            setView('LIST');
        }
        if (message.command === 'LOGIN_SUCCESS') {
            setIsConnected(true);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // This checks if VS Code injected data directly into the HTML window object
    if (window.INITIAL_LOCAL_DATA && Array.isArray(window.INITIAL_LOCAL_DATA) && window.INITIAL_LOCAL_DATA.length > 0) {
        console.log("Found initial local data:", window.INITIAL_LOCAL_DATA);
        setContributors(window.INITIAL_LOCAL_DATA);
        setView('LIST');
    }
  }, []);

  // --- HANDLERS ---
  const handleLogin = () => { if(vscode) vscode.postMessage({ command: 'LOGIN' }); };
  
  const handleScanRepo = (e) => {
    e.preventDefault();
    if (!repoQuery) return;
    setLoading(true);
    if(vscode) vscode.postMessage({ command: 'SEARCH_REPO', query: repoQuery });
  };

  const handleSelectContributor = (contributor) => {
    setLoading(true);
    if(vscode) {
        vscode.postMessage({
            command: 'ANALYZE',
            source: contributor.source || 'remote',
            name: contributor.name,
            email: contributor.email,
            repoQuery: repoQuery,
            contributor: contributor
        });
    }
  };

  const t = UI_TEXT[lang];

  return (
    <div className={`min-h-screen ${COLORS.bg} text-gray-400 font-sans selection:bg-blue-500/20`}>
      <GitGraphBackground />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-[#09090b]/80 border-b border-white/5">
         <div className="flex items-center gap-3">
             <Terminal size={18} className="text-gray-400"/>
             <span className="hidden md:inline font-mono font-bold tracking-wider text-gray-200 text-sm">{t.navbar_title}</span>
         </div>

         <div className="flex-1 max-w-md mx-6 flex justify-center">
            {view === 'SEARCH' || view === 'LIST' ? (
                !isConnected && contributors.length === 0 ? (
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
                          placeholder="Search Public Repo (e.g. facebook/react)" 
                          className="w-full bg-[#121212] border border-[#333] text-gray-300 text-xs rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1a] transition-all font-mono shadow-inner"
                        />
                        {loading && <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><Loader size={14} className="animate-spin text-blue-500" /></div>}
                    </form>
                )
            ) : (
                <div className="text-xs text-gray-600 font-mono">Viewing Profile Analysis</div>
            )}
         </div>

         <div className="flex gap-4">
             <button onClick={() => setLang(lang === 'en' ? 'ko' : 'en')} className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 transition border border-gray-700 px-3 py-2 rounded-full hover:bg-gray-800">
                <Globe size={14} /> {lang === 'en' ? 'KO' : 'EN'}
             </button>
         </div>
      </nav>

      {/* CONTENT AREA */}
      <section className="relative z-10 min-h-screen flex flex-col justify-start items-center px-6 pt-28 pb-12 lg:pt-36">
         
         {/* GLOBAL BACK BUTTON */}
         {(view === 'LIST' || view === 'PROFILE') && (
            <div className="absolute top-24 left-0 w-full px-8 z-50 flex justify-start pointer-events-none">
              <div className="pointer-events-auto">
                <BackButton 
                  onClick={() => view === 'PROFILE' ? setView('LIST') : setView('SEARCH')} 
                  label={view === 'PROFILE' ? "Back to Team" : "Back to Search"} 
                />
              </div>
            </div>
         )}

         {/* VIEWS */}
         {(view === 'SEARCH' || view === 'LIST') && (
            <ListView 
                view={view}
                contributors={contributors}
                loading={loading}
                handleSelectContributor={handleSelectContributor}
            />
         )}

         {view === 'PROFILE' && (
            <ProfileView 
                data={data}
                t={t}
                lang={lang}
            />
         )}

      </section>

      <DevTools data={data} setData={setData} toggleTrait={() => {}} /> 
    </div>
  );
}