export interface Protocol {
  id: string;
  name: string;
  description: string;
  frequencies: number[]; // Base carrier frequency
  effects: string[];
  binauralBeatFrequency?: number; // The difference frequency for binaural beats
  pemfFrequency?: number; // The frequency for amplitude modulation (pulsing)
  isSequence?: boolean; // True if this protocol sequences other protocols
  isCustom?: boolean;
}
