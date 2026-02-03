import React from 'react';
import { Share2, AlertTriangle, CheckCircle, Moon, Sun, PenTool, Box, Activity, FileText } from 'lucide-react';

// --- Data Definitions ---

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

// Mock Result Data (This would come from your backend analysis)
const MOCK_RESULT = {
  type: "ACFN",
  title: "The Midnight Architect",
  description: "You build silently in the shadows. Your commits are surgical, precise, and frequent. While others sleep, you are stacking features brick by brick.",
  stats: {
    AM: 82, // 82% Atomic (Left side)
    CD: 65, // 65% Concise (Left side)
    FX: 70, // 70% Feature (Left side)
    DN: 90  // 90% Night (Right side, represented as -90 in logic or handled via boolean)
  },
  // We represent stats as 0-100 towards the LEFT trait, or 0-100 towards the RIGHT trait.
  // Let's normalize: < 50 is Right, > 50 is Left for this demo logic.
  normalizedStats: {
    AM: 85, // Heavily Atomic
    CD: 70, // Moderately Concise
    FX: 80, // Heavily Feature
    DN: 10  // Heavily Night (Low Day score)
  }
};

const COLLABORATION_DATA = [
  {
    type: "MDXD",
    relation: "Nemesis",
    title: "The Daytime Essayist",
    desc: "Why it hurts: You push 20 tiny features at 3 AM. They push one massive bug-fix at 2 PM with a 5-paragraph commit message. You will never understand each other's git history.",
    color: "bg-red-50"
  },
  {
    type: "MCFN",
    relation: "Chaos",
    title: "The Silent Boulder",
    desc: "Why it hurts: You both work at night and don't talk. But while you build piece-by-piece, they drop code-bombs that break your delicate architecture.",
    color: "bg-orange-50"
  },
  {
    type: "ACXD",
    relation: "Partner",
    title: "The Day Surgeon",
    desc: "Why it works: You build the features at night; they wake up and surgically fix the bugs you left behind. A perfect cycle of creation and repair.",
    color: "bg-emerald-50"
  }
];

// --- Components ---

const TraitSlider = ({ leftLabel, rightLabel, score }) => {
  // Score 0 = 100% Right, Score 100 = 100% Left. 
  // We calculate distance from center (50).
  
  const isLeftDominant = score >= 50;
  const percentage = isLeftDominant ? (score - 50) * 2 : (50 - score) * 2;
  
  return (
    <div className="mb-8 group">
      <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2">
        <span className={isLeftDominant ? leftLabel.color : "text-gray-400"}>{leftLabel.name}</span>
        <span className={!isLeftDominant ? rightLabel.color : "text-gray-400"}>{rightLabel.name}</span>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
        {/* Center Marker */}
        <div className="absolute w-0.5 h-full bg-white z-10 opacity-50"></div>
        
        {/* The Bar */}
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${isLeftDominant ? leftLabel.bg : rightLabel.bg}`}
          style={{ 
            width: `${percentage}%`,
            marginLeft: isLeftDominant ? '0' : 'auto',
            marginRight: isLeftDominant ? 'auto' : '0',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
        <span>{leftLabel.code}</span>
        <span>{percentage}%</span>
        <span>{rightLabel.code}</span>
      </div>
    </div>
  );
};

const TypeCard = ({ type, title }) => (
  <div className="bg-white rounded-3xl p-8 shadow-xl border-b-8 border-purple-500 text-center transform transition hover:-translate-y-1 hover:shadow-2xl">
    <div className="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6 relative overflow-visible">
      {/* Abstract "Avatar" representing the specific traits */}
      <div className="absolute top-0 right-0 bg-teal-400 w-8 h-8 rounded-full border-4 border-white animate-bounce"></div>
      <div className="absolute bottom-0 left-0 bg-indigo-500 w-10 h-10 rounded-lg border-4 border-white transform rotate-12"></div>
      <Moon size={64} className="text-purple-600" />
    </div>
    
    <div className="text-purple-600 font-bold tracking-widest text-sm mb-2">YOUR SUBTYPE</div>
    <h1 className="text-6xl font-black text-gray-800 mb-2 tracking-tighter">{type}</h1>
    <h2 className="text-xl font-medium text-gray-500">{title}</h2>
    
    <div className="mt-6 flex justify-center gap-2">
      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">Atomic</span>
      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">Concise</span>
      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">Feature</span>
      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">Night</span>
    </div>
  </div>
);

const MatchCard = ({ match }) => {
  const isBad = match.relation === "Nemesis" || match.relation === "Chaos";
  const icon = isBad ? <AlertTriangle size={20} /> : <CheckCircle size={20} />;
  const textColor = isBad ? "text-red-600" : "text-emerald-600";
  
  return (
    <div className={`p-6 rounded-2xl ${match.color} border border-opacity-50 border-gray-200 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${textColor} flex items-center gap-1 mb-1`}>
            {icon} {match.relation}
          </span>
          <h3 className="text-2xl font-black text-gray-800">{match.type}</h3>
        </div>
        <div className="px-2 py-1 bg-white bg-opacity-60 rounded text-xs font-mono text-gray-500">
          {match.title}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {match.desc}
      </p>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tighter">
          <Box className="fill-current" /> SubText<span className="text-gray-300 font-light">Profile</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition flex items-center gap-2">
          Share Results <Share2 size={16} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        
        {/* 1. Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <TypeCard type={MOCK_RESULT.type} title={MOCK_RESULT.title} />
          </div>
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
              You are a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Night Surgeon.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {MOCK_RESULT.description}
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Development DNA</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Activity size={18} /></div>
                   <div><div className="font-bold text-sm">Atomic</div><div className="text-xs text-gray-400">Commit Size</div></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><FileText size={18} /></div>
                   <div><div className="font-bold text-sm">Concise</div><div className="text-xs text-gray-400">Message Style</div></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><PenTool size={18} /></div>
                   <div><div className="font-bold text-sm">Feature</div><div className="text-xs text-gray-400">Primary Focus</div></div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Moon size={18} /></div>
                   <div><div className="font-bold text-sm">Night</div><div className="text-xs text-gray-400">Peak Time</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Sliders Section */}
        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-lg mb-20">
          <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Trait Analysis</h3>
            <h2 className="text-3xl font-black text-gray-800">Your Commit Habits</h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <TraitSlider leftLabel={TRAIT_DESCRIPTIONS.AM.left} rightLabel={TRAIT_DESCRIPTIONS.AM.right} score={MOCK_RESULT.normalizedStats.AM} />
            <TraitSlider leftLabel={TRAIT_DESCRIPTIONS.CD.left} rightLabel={TRAIT_DESCRIPTIONS.CD.right} score={MOCK_RESULT.normalizedStats.CD} />
            <TraitSlider leftLabel={TRAIT_DESCRIPTIONS.FX.left} rightLabel={TRAIT_DESCRIPTIONS.FX.right} score={MOCK_RESULT.normalizedStats.FX} />
            <TraitSlider leftLabel={TRAIT_DESCRIPTIONS.DN.left} rightLabel={TRAIT_DESCRIPTIONS.DN.right} score={MOCK_RESULT.normalizedStats.DN} />
          </div>
        </section>

        {/* 3. Collaboration Compatibility */}
        <section className="mb-20">
           <div className="text-center mb-12">
            <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-2">Team Dynamics</h3>
            <h2 className="text-3xl font-black text-gray-800">Workplace Chemistry</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COLLABORATION_DATA.map((match, idx) => (
              <MatchCard key={idx} match={match} />
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-gray-800 text-gray-400 py-12 text-center">
        <p className="mb-4 text-sm">Generated by SubText VS Code Extension</p>
        <div className="flex justify-center gap-4 text-xs font-mono">
          <span>v2.4.0</span>
          <span>•</span>
          <span>Local Analysis Only</span>
        </div>
      </footer>
    </div>
  );
}