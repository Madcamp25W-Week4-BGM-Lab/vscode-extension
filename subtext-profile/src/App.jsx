import React from 'react';
import { Share2, AlertTriangle, CheckCircle, Moon, Activity, FileText, Users, Zap } from 'lucide-react';

// --- Configuration & Data (Same as before) ---

const TRAIT_DESCRIPTIONS = {
  AM: {
    left: { code: 'A', name: 'Atomic', color: 'text-emerald-600', bg: 'bg-emerald-500' },
    right: { code: 'M', name: 'Monolithic', color: 'text-blue-600', bg: 'bg-blue-500' }
  },
  CD: {
    left: { code: 'C', name: 'Concise', color: 'text-teal-600', bg: 'bg-teal-500' },
    right: { code: 'D', name: 'Descriptive', color: 'text-indigo-600', bg: 'bg-indigo-500' }
  },
  FX: {
    left: { code: 'F', name: 'Feature', color: 'text-amber-600', bg: 'bg-amber-500' },
    right: { code: 'X', name: 'Fixer', color: 'text-rose-600', bg: 'bg-rose-500' }
  },
  DN: {
    left: { code: 'D', name: 'Day', color: 'text-orange-500', bg: 'bg-orange-400' },
    right: { code: 'N', name: 'Night', color: 'text-purple-600', bg: 'bg-purple-600' }
  }
};

const MOCK_RESULT = {
  type: "ACFN",
  title: "The Night Surgeon",
  subtitle: "Code Ninja",
  description: "You build silently in the shadows. Your commits are surgical, precise, and frequent. While others sleep, you are stacking features brick by brick. You prefer to work alone, delivering high-impact changes without the noise of constant meetings.",
  stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
};

const COLLABORATION_DATA = [
  {
    type: "MDXD",
    relation: "Nemesis",
    title: "The Daytime Essayist",
    desc: "They push one massive bug-fix at 2 PM with a 5-paragraph commit message. You will never understand each other.",
    color: "bg-red-50 border-red-100",
    iconColor: "text-red-500"
  },
  {
    type: "MCFN",
    relation: "Chaos",
    title: "The Silent Boulder",
    desc: "You both work at night, but while you build piece-by-piece, they drop massive code-bombs that break your architecture.",
    color: "bg-orange-50 border-orange-100",
    iconColor: "text-orange-500"
  },
  {
    type: "ACXD",
    relation: "Partner",
    title: "The Day Surgeon",
    desc: "Perfect harmony. You build features at night; they wake up and surgically fix the bugs you left behind.",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600"
  }
];

// --- Components (Same as before) ---

const TraitRow = ({ left, right, score }) => {
  const isLeft = score >= 50;
  const percentage = isLeft ? (score - 50) * 2 : (50 - score) * 2;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isLeft ? left.color : 'text-gray-300'}`}>
          {left.name}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${!isLeft ? right.color : 'text-gray-300'}`}>
          {right.name}
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full flex items-center">
        <div className="absolute left-1/2 w-0.5 h-4 bg-white -top-0.5 z-10"></div>
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${isLeft ? left.bg : right.bg}`}
          style={{ 
            width: `${percentage}%`,
            marginLeft: isLeft ? 'auto' : '50%',
            marginRight: isLeft ? '50%' : 'auto',
          }} 
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono px-1">
        <span className={isLeft ? 'opacity-100' : 'opacity-0'}>{percentage}%</span>
        <span className={!isLeft ? 'opacity-100' : 'opacity-0'}>{percentage}%</span>
      </div>
    </div>
  );
};

const MatchCard = ({ match }) => (
  <div className={`p-5 rounded-2xl border-2 ${match.color} transition-transform hover:-translate-y-1`}>
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        {match.relation === "Nemesis" || match.relation === "Chaos" ? 
          <AlertTriangle size={18} className={match.iconColor} /> : 
          <CheckCircle size={18} className={match.iconColor} />
        }
        <span className={`text-xs font-black uppercase ${match.iconColor}`}>{match.relation}</span>
      </div>
      <span className="text-xs font-mono text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{match.type}</span>
    </div>
    <h4 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{match.title}</h4>
    <p className="text-xs text-gray-600 leading-relaxed">{match.desc}</p>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden relative pb-20">
      
      {/* --- NEW Rigid Mountain Background --- */}
      <div className="absolute top-0 left-0 w-full h-[800px] z-0 overflow-hidden pointer-events-none">
        {/* The SVG draws the rigid polygonal shape */}
        <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 1440 800" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            {/* The main Indigo mountain shape */}
            <path 
                d="M0 0H1440V450L1156.5 620.5L848 485L484 688L0 520V0Z" 
                fill="#4f46e5" // This is Tailwind's indigo-600
            />
            {/* Optional: A second, darker layer behind it for depth */}
            <path 
                d="M0 0H1440V300L1000 550L600 400L0 600V0Z" 
                fill="#3730a3" // Tailwind indigo-800, slightly darker, further back
                className="opacity-50"
            />
        </svg>
      </div>

      {/* --- Navbar --- */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
          <Zap className="fill-yellow-400 text-yellow-400" /> SubText
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md transition flex items-center gap-2 border border-white/20">
          Share Profile <Share2 size={16} />
        </button>
      </nav>

      {/* --- Main Content Grid --- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 mt-8">
        
        {/* Top Section: Avatar (Left) vs Stats (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12 items-center">
          
          {/* LEFT COLUMN: The Persona */}
          <div className="lg:col-span-5 text-center lg:text-left text-white space-y-6">
            <div className="inline-block relative">
              {/* Avatar Placeholder - kept rounded for contrast */}
              <div className="w-48 h-48 mx-auto lg:mx-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl shadow-2xl border-4 border-white/20 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition duration-500">
                 <Moon size={80} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-indigo-900 text-xs font-black px-3 py-1 rounded-full shadow-lg rotate-3">
                TOP 5%
              </div>
            </div>

            <div className="drop-shadow-lg">
              <h2 className="text-sm font-bold tracking-widest opacity-80 mb-2 uppercase">Your Personality Type</h2>
              <h1 className="text-6xl font-black tracking-tighter mb-2">{MOCK_RESULT.title}</h1>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                 <span className="text-3xl font-mono font-bold text-indigo-100 bg-indigo-900/50 px-3 py-1 rounded-lg border border-indigo-400/30 backdrop-blur-sm">
                    {MOCK_RESULT.type}
                 </span>
                 <span className="h-px w-10 bg-indigo-400/50"></span>
                 <span className="text-lg font-medium text-indigo-100">{MOCK_RESULT.subtitle}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Stats Card - Rounded contrast against rigid background */}
          <div className="lg:col-span-7 pt-10 lg:pt-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <Activity className="text-indigo-500" />
                <h3 className="text-xl font-bold text-gray-800">Trait Breakdown</h3>
              </div>
              
              <TraitRow left={TRAIT_DESCRIPTIONS.AM.left} right={TRAIT_DESCRIPTIONS.AM.right} score={MOCK_RESULT.stats.AM} />
              <TraitRow left={TRAIT_DESCRIPTIONS.CD.left} right={TRAIT_DESCRIPTIONS.CD.right} score={MOCK_RESULT.stats.CD} />
              <TraitRow left={TRAIT_DESCRIPTIONS.FX.left} right={TRAIT_DESCRIPTIONS.FX.right} score={MOCK_RESULT.stats.FX} />
              <TraitRow left={TRAIT_DESCRIPTIONS.DN.left} right={TRAIT_DESCRIPTIONS.DN.right} score={MOCK_RESULT.stats.DN} />
            </div>
          </div>
        </div>

        {/* --- Bottom Section: Details & Matches --- */}
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Description Text */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                  <FileText size={20} className="text-gray-400"/> About this Type
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {MOCK_RESULT.description}
                  <br /><br />
                  As a {MOCK_RESULT.title}, you often find yourself cleaning up complex codebases when no one else is watching. You value autonomy over collaboration, preferring to communicate through clean, self-documenting code rather than lengthy pull request descriptions.
                </p>
              </div>
            </div>

            {/* Matches / Collaboration */}
            <div className="lg:col-span-4 space-y-4">
               <div className="flex items-center gap-2 mb-2 px-2">
                 <Users size={18} className="text-gray-500"/>
                 <h3 className="font-bold text-gray-600 text-sm uppercase tracking-wider">Workplace Chemistry</h3>
               </div>
               
               {COLLABORATION_DATA.map((match, idx) => (
                 <MatchCard key={idx} match={match} />
               ))}
            </div>

        </div>

      </main>
    </div>
  );
}