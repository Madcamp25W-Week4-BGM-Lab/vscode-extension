import React from 'react';
import { Github, Users, Loader } from 'lucide-react';

const ListView = ({ view, contributors, loading, handleSelectContributor }) => {
  
  // RENDER: SEARCH / WELCOME STATE
  if (view === 'SEARCH') {
    return (
      <div className="text-center animate-fade-in max-w-lg">
        <Github size={64} className="mx-auto text-gray-700 mb-6" />
        <h1 className="text-3xl font-bold text-gray-300 mb-2">Identify Your Team</h1>
        <p className="text-gray-500 mb-8">Enter a public repository to analyze contributor personalities.</p>
      </div>
    );
  }

  // RENDER: LIST RESULTS
  return (
    <div className="max-w-4xl w-full animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Users className="text-blue-500" size={24}/>
        <h2 className="text-xl font-bold text-white">Active Agents</h2>
      </div>
      
      {/* Absolute Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
           <div className="bg-[#18181b] p-4 rounded-full border border-[#27272a] shadow-2xl">
             <Loader className="animate-spin text-blue-500" size={32} />
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributors.map((user, idx) => (
          <button key={idx} onClick={() => handleSelectContributor(user)} className="flex items-center gap-4 p-4 bg-[#121212]/80 backdrop-blur border border-[#27272a] rounded-xl hover:border-blue-500 hover:bg-[#1a1a1a] transition text-left group">
            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden shrink-0 border border-gray-700">
               {user.avatar ? <img src={user.avatar} alt={user.name} /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">{user.name.substring(0,2).toUpperCase()}</div>}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-200 group-hover:text-blue-400 truncate">{user.name}</div>
              <div className="text-xs text-gray-500 font-mono">
                 {user.commits.length} commits 
                 {user.source === 'local' && <span className="ml-2 text-[10px] bg-zinc-800 px-1 rounded text-zinc-400">LOCAL</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListView;