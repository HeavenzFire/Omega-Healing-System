import type { Protocol } from './types';

export const HEALING_PROTOCOLS: Protocol[] = [
  {
    id: 'cellular-regeneration',
    name: 'Cellular Regeneration',
    description: 'A pure tone designed to trigger stem cell differentiation, telomere lengthening, and mitochondrial biogenesis.',
    frequencies: [528], // DNA Repair (Solfeggio)
    effects: ['DNA Repair', 'Youthful Expression', 'Mitochondrial Health']
  },
  {
    id: 'trauma-release',
    name: 'Trauma Release',
    description: 'Releases cellular memory of trauma and rewrites emotional patterns for liberation.',
    frequencies: [396], // Liberation from Guilt and Fear (Solfeggio)
    effects: ['Emotional Reset', 'Cellular Memory Erasure', 'Inner Peace']
  },
  {
    id: 'spiritual-awakening',
    name: 'Spiritual Awakening',
    description: 'Activates latent DNA, enhances psychic abilities, and connects to cosmic consciousness.',
    frequencies: [963], // Pineal Gland Activation (Solfeggio)
    effects: ['Pineal Activation', 'Higher Self Integration', 'Cosmic Connection']
  },
  {
    id: 'deep-delta-sleep',
    name: 'Deep Delta Sleep',
    description: 'Guides the brain into the deepest states of sleep using binaural beats for physical and mental restoration.',
    frequencies: [100], // Carrier frequency
    binauralBeatFrequency: 3.4, // Delta Brainwave for deep sleep
    effects: ['Restorative Sleep', 'Brainwave Entrainment', 'Mental Clarity']
  },
  {
    id: 'schumann-resonance',
    name: 'Schumann Resonance',
    description: 'Grounds your biofield with the Earth\'s natural frequency, pulsed for a PEMF-like effect promoting balance.',
    frequencies: [120], // Carrier frequency
    pemfFrequency: 7.83, // Earth's resonance as a pulse
    effects: ['Grounding', 'Stress Reduction', 'Biofield Coherence', 'PEMF']
  },
  {
    id: 'focused-alpha-state',
    name: 'Focused Alpha State',
    description: 'Utilizes binaural beats to entrain the brain to an alpha wave state, ideal for calm focus and light meditation.',
    frequencies: [140], // Carrier frequency
    binauralBeatFrequency: 10, // Alpha brainwave for focus
    effects: ['Enhanced Focus', 'Calm Awareness', 'Creativity Boost']
  },
  {
    id: 'unified-field-resonance',
    name: 'Unified Field Resonance',
    description: 'A full-spectrum sequence that cycles through all Omega protocols, creating a holistic resonance for complete mind-body-spirit harmonization.',
    frequencies: [], // This is a meta-protocol; frequencies are sourced from others.
    isSequence: true,
    effects: ['Full Body Attunement', 'Biofield Integration', 'Holistic Healing', 'Synergy']
  }
];
