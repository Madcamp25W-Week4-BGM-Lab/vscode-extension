// src/DevTools.jsx
import React from 'react';
import { Settings } from 'lucide-react';
import { PROFILES } from './constants';

const DevTools = ({ data, setData, toggleTrait }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#1e1e1e] border border-[#333] p-4 rounded-xl shadow-2xl w-64 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 border-b border-[#333] pb-2">
        <Settings size={14} /> DEV_TOOLS_PANEL
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-[10px] uppercase text-gray-600 font-bold mb-2">Select Archetype</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(PROFILES).map((key) => {
               // Determine colors based on key for a bit of flair
               let colorStyles = "bg-[#222] border-[#333] text-gray-300";
               if(key === 'NINJA') colorStyles = "bg-emerald-900/30 border-emerald-800 text-emerald-500";
               if(key === 'MECH') colorStyles = "bg-rose-900/30 border-rose-800 text-rose-500";
               if(key === 'WIZARD') colorStyles = "bg-amber-900/30 border-amber-800 text-amber-500";
               if(key === 'DRONE') colorStyles = "bg-blue-900/30 border-blue-800 text-blue-500";

               return (
                  <button 
                    key={key}
                    onClick={() => setData(PROFILES[key])} 
                    className={`px-3 py-1 border text-[10px] rounded hover:opacity-80 transition ${colorStyles}`}
                  >
                    {key}
                  </button>
               )
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase text-gray-600 font-bold mb-2">Toggle Traits</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => toggleTrait('D', 'N')} className="px-3 py-1 bg-[#222] border border-[#333] text-gray-300 text-[10px] rounded hover:bg-[#333] transition">
              {data.type.includes('N') ? 'To Day' : 'To Night'}
            </button>
            <button onClick={() => toggleTrait('C', 'D')} className="px-3 py-1 bg-[#222] border border-[#333] text-gray-300 text-[10px] rounded hover:bg-[#333] transition">
              {data.type.includes('D') ? 'To Concise' : 'To Desc'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;