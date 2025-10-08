
import React from 'react';
import type { Protocol } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  intent: string;
  onIntentChange: (intent: string) => void;
  selectedProtocol: Protocol | null;
}

const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3zm7.5 0a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
    </svg>
);


const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlayToggle, volume, onVolumeChange, intent, onIntentChange, selectedProtocol }) => {
  const isDisabled = !selectedProtocol;

  return (
    <div className="w-full max-w-lg mt-4 flex flex-col items-center gap-6 p-4">
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={onPlayToggle}
          disabled={isDisabled}
          className="p-4 rounded-full bg-purple-600 text-white transition-all duration-300 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-400 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="flex-grow flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-400">
             <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 12c0-1.857-.87-3.534-2.274-4.585.126.05.25.105.374.162a4.51 4.51 0 012.273 4.423 4.51 4.51 0 01-2.273 4.423c-.124.057-.248.112-.374.162A6.016 6.016 0 0018.584 12z" />
            </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            disabled={isDisabled}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:cursor-not-allowed"
            aria-label="Volume control"
          />
        </div>
      </div>
      <div className="w-full">
        <label htmlFor="intent-input" className="block mb-2 text-sm font-medium text-purple-300 uppercase tracking-wider">Sovereign Intent</label>
        <textarea
          id="intent-input"
          value={intent}
          onChange={(e) => onIntentChange(e.target.value)}
          rows={3}
          placeholder="State your healing intention..."
          className="w-full p-3 bg-gray-800/50 border border-purple-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
        />
      </div>
    </div>
  );
};

export default Controls;
