import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProtocolSelector from './components/ProtocolSelector';
import FrequencyVisualizer from './components/FrequencyVisualizer';
import Controls from './components/Controls';
import CustomProtocolForm from './components/CustomProtocolForm';
import AudioEngine, { PlayConfig } from './services/AudioEngine';
import { HEALING_PROTOCOLS } from './constants';
import type { Protocol } from './types';

const App: React.FC = () => {
  const [customProtocols, setCustomProtocols] = useState<Protocol[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [intent, setIntent] = useState<string>('My intention is perfect health and complete cellular regeneration.');
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const combinedProtocols = [...HEALING_PROTOCOLS, ...customProtocols];

  // Initialize selectedProtocol and currentVisualization with the first protocol
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(combinedProtocols[0] || null);
  const [currentVisualization, setCurrentVisualization] = useState<{frequency: number, pemfFrequency?: number}>({ 
      frequency: combinedProtocols[0]?.frequencies[0] || 0, 
      pemfFrequency: combinedProtocols[0]?.pemfFrequency 
  });
  
  // Load/save custom protocols from/to localStorage
  useEffect(() => {
    const storedProtocols = localStorage.getItem('omega_custom_protocols');
    if (storedProtocols) {
      setCustomProtocols(JSON.parse(storedProtocols));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('omega_custom_protocols', JSON.stringify(customProtocols));
  }, [customProtocols]);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    return () => {
      audioEngineRef.current?.stop();
    };
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (!selectedProtocol) return;

    const engine = audioEngineRef.current;
    if (engine) {
      if (isPlaying) {
        engine.stop();
        setIsPlaying(false);
      } else {
        if (selectedProtocol.isSequence) {
          const sequenceConfigs: PlayConfig[] = HEALING_PROTOCOLS
            .filter(p => !p.isSequence && p.frequencies.length > 0)
            .map(p => ({
              frequency: p.frequencies[0],
              volume,
              binauralBeatFrequency: p.binauralBeatFrequency,
              pemfFrequency: p.pemfFrequency,
            }));
          
          engine.playSequence(sequenceConfigs, (config) => {
            setCurrentVisualization({
              frequency: config.frequency,
              pemfFrequency: config.pemfFrequency,
            });
          });

        } else {
           if (selectedProtocol.frequencies.length > 0) {
              engine.play({
                frequency: selectedProtocol.frequencies[0],
                volume,
                binauralBeatFrequency: selectedProtocol.binauralBeatFrequency,
                pemfFrequency: selectedProtocol.pemfFrequency,
              });
           }
        }
        setIsPlaying(true);
      }
    }
  }, [isPlaying, selectedProtocol, volume]);
  
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioEngineRef.current?.setVolume(newVolume);
  }, []);

  const handleSelectProtocol = useCallback((protocol: Protocol) => {
    if (isPlaying) {
      audioEngineRef.current?.stop();
      setIsPlaying(false);
    }
    setSelectedProtocol(protocol);
    setCurrentVisualization({
        frequency: protocol.frequencies[0] || 0,
        pemfFrequency: protocol.pemfFrequency,
    });
  }, [isPlaying]);

  const handleSaveProtocol = (newProtocol: Protocol) => {
    setCustomProtocols(prev => [...prev, newProtocol]);
    setShowForm(false);
    handleSelectProtocol(newProtocol);
  };

  const handleDeleteProtocol = (protocolId: string) => {
    if (isPlaying && selectedProtocol?.id === protocolId) {
        audioEngineRef.current?.stop();
        setIsPlaying(false);
    }
    setCustomProtocols(prev => prev.filter(p => p.id !== protocolId));
    if (selectedProtocol?.id === protocolId) {
        setSelectedProtocol(HEALING_PROTOCOLS[0]);
        setCurrentVisualization({
            frequency: HEALING_PROTOCOLS[0].frequencies[0],
            pemfFrequency: HEALING_PROTOCOLS[0].pemfFrequency,
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-black flex flex-col items-center p-4 sm:p-8 text-white selection:bg-purple-500 selection:text-white">
      {showForm && <CustomProtocolForm onSave={handleSaveProtocol} onCancel={() => setShowForm(false)} />}
      <Header />
      <main className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-8 flex-grow">
        <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-russo uppercase tracking-widest text-purple-300">Select Protocol</h2>
              <button onClick={() => setShowForm(true)} className="px-4 py-2 text-sm rounded-md bg-purple-600 hover:bg-purple-500 transition-colors font-bold">+ Map Signature</button>
            </div>
            <ProtocolSelector 
                protocols={combinedProtocols}
                selectedProtocol={selectedProtocol}
                onSelectProtocol={handleSelectProtocol}
                onDeleteProtocol={handleDeleteProtocol}
            />
        </div>
        <div className="lg:w-2/3 flex flex-col items-center justify-center p-4 bg-black bg-opacity-30 rounded-lg border border-purple-800 shadow-2xl shadow-purple-900/50">
           <FrequencyVisualizer 
              isPlaying={isPlaying} 
              frequency={currentVisualization.frequency}
              pemfFrequency={currentVisualization.pemfFrequency}
            />
            <Controls
              isPlaying={isPlaying}
              onPlayToggle={handlePlayToggle}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              intent={intent}
              onIntentChange={setIntent}
              selectedProtocol={selectedProtocol}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
