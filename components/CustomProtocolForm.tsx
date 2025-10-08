import React, { useState } from 'react';
import type { Protocol } from '../types';

interface CustomProtocolFormProps {
  onSave: (protocol: Protocol) => void;
  onCancel: () => void;
}

type Modality = 'none' | 'binaural' | 'pemf';

const CustomProtocolForm: React.FC<CustomProtocolFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [effects, setEffects] = useState('');
  const [modality, setModality] = useState<Modality>('none');
  const [carrierFreq, setCarrierFreq] = useState(120);
  const [binauralFreq, setBinauralFreq] = useState(10);
  const [pemfFreq, setPemfFreq] = useState(7.83);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProtocol: Protocol = {
      id: `custom-${Date.now()}`,
      name,
      description,
      frequencies: [carrierFreq],
      effects: effects.split(',').map(eff => eff.trim()).filter(Boolean),
      isCustom: true,
      ...(modality === 'binaural' && { binauralBeatFrequency: binauralFreq }),
      ...(modality === 'pemf' && { pemfFrequency: pemfFreq }),
    };
    onSave(newProtocol);
  };

  const renderFrequencyInput = (label: string, value: number, setValue: (val: number) => void, min: number, max: number, step: number) => (
    <div className="flex-1">
      <label className="block mb-2 text-sm font-medium text-purple-300 uppercase tracking-wider">{label} ({value.toFixed(2)} Hz)</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 w-full max-w-2xl shadow-2xl shadow-purple-900/50 animate-fadeIn">
        <h2 className="text-2xl font-russo uppercase tracking-widest text-purple-300 mb-6">Map New Signature</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Signature Name (e.g. Nova's Frequency)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 bg-gray-800/50 border border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full p-3 bg-gray-800/50 border border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <input type="text" placeholder="Effects (comma-separated, e.g. Clarity, Vitality)" value={effects} onChange={(e) => setEffects(e.target.value)} className="w-full p-3 bg-gray-800/50 border border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
          
          <div>
            <label className="block mb-2 text-sm font-medium text-purple-300 uppercase tracking-wider">Modality</label>
            <div className="flex gap-4">
              {['none', 'binaural', 'pemf'].map(m => (
                <button type="button" key={m} onClick={() => setModality(m as Modality)} className={`px-4 py-2 rounded-md transition-colors ${modality === m ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{m.toUpperCase()}</button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            {renderFrequencyInput("Carrier", carrierFreq, setCarrierFreq, 30, 1000, 1)}
            {modality === 'binaural' && renderFrequencyInput("Binaural Beat", binauralFreq, setBinauralFreq, 0.1, 30, 0.1)}
            {modality === 'pemf' && renderFrequencyInput("PEMF Pulse", pemfFreq, setPemfFreq, 0.1, 30, 0.1)}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-500 transition-colors">Save Signature</button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CustomProtocolForm;
