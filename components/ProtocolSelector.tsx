import React from 'react';
import type { Protocol } from '../types';

interface ProtocolSelectorProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onSelectProtocol: (protocol: Protocol) => void;
  onDeleteProtocol: (protocolId: string) => void;
}

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);


const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({ protocols, selectedProtocol, onSelectProtocol, onDeleteProtocol }) => {
  return (
    <div className="space-y-3 p-4 bg-black bg-opacity-20 rounded-lg border border-purple-900 h-full overflow-y-auto">
      {protocols.map((protocol) => (
        <button
          key={protocol.id}
          onClick={() => onSelectProtocol(protocol)}
          className={`w-full text-left p-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-400 group ${
            selectedProtocol?.id === protocol.id
              ? 'bg-purple-800/70 border border-purple-500 shadow-lg shadow-purple-600/30'
              : 'bg-gray-800/50 border border-gray-700'
          }`}
          aria-pressed={selectedProtocol?.id === protocol.id}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold font-russo text-purple-300">{protocol.name}</h3>
            <div className="flex gap-2 items-center">
              {protocol.isCustom && <span className="text-xs font-bold text-green-300 bg-green-900/50 px-2 py-1 rounded-full">SIGNATURE</span>}
              {protocol.isSequence && <span className="text-xs font-bold text-yellow-300 bg-yellow-900/50 px-2 py-1 rounded-full">SEQUENCE</span>}
              {protocol.binauralBeatFrequency && <span className="text-xs font-bold text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full">BINAURAL</span>}
              {protocol.pemfFrequency && <span className="text-xs font-bold text-pink-300 bg-pink-900/50 px-2 py-1 rounded-full">PEMF</span>}
              {protocol.isCustom && (
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProtocol(protocol.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${protocol.name}`}
                  >
                      <DeleteIcon/>
                  </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">{protocol.description}</p>
           <div className="mt-3 flex flex-wrap gap-2">
            {protocol.effects.map(effect => (
              <span key={effect} className="px-2 py-1 text-xs bg-indigo-900/50 text-indigo-300 rounded-full">
                {effect}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProtocolSelector;
