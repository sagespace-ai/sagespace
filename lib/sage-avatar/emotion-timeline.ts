// Emotion Animation Timeline System
// Normalized 0-1 timeline for smooth emotion transitions

import { SageEmotion } from './types';

export interface EmotionKeyframe {
  t: number; // time 0-1
  eyeIntensity: number; // 0-1
  bodyBrightness: number; // 0-1
  haloSpeed: number; // 0-1 relative
  particleDensity: number; // 0-1
}

export interface EmotionTimeline {
  keyframes: EmotionKeyframe[];
  duration: number; // milliseconds
  easing: string;
  notes: string;
}

export const EMOTION_TIMELINES: Record<SageEmotion, EmotionTimeline> = {
  calm: {
    keyframes: [
      { t: 0, eyeIntensity: 0.4, bodyBrightness: 0.5, haloSpeed: 0.3, particleDensity: 0.3 },
      { t: 0.5, eyeIntensity: 0.45, bodyBrightness: 0.52, haloSpeed: 0.32, particleDensity: 0.32 },
      { t: 1, eyeIntensity: 0.4, bodyBrightness: 0.5, haloSpeed: 0.3, particleDensity: 0.3 },
    ],
    duration: 4000,
    easing: 'easeInOut',
    notes: 'Long, smooth, slow easing with small sinusoidal variations',
  },
  
  joy: {
    keyframes: [
      { t: 0, eyeIntensity: 0.7, bodyBrightness: 0.7, haloSpeed: 0.5, particleDensity: 0.5 },
      { t: 0.3, eyeIntensity: 0.9, bodyBrightness: 0.9, haloSpeed: 0.7, particleDensity: 0.7 },
      { t: 0.5, eyeIntensity: 0.9, bodyBrightness: 0.9, haloSpeed: 0.7, particleDensity: 0.7 },
      { t: 1, eyeIntensity: 0.6, bodyBrightness: 0.6, haloSpeed: 0.5, particleDensity: 0.5 },
    ],
    duration: 1800,
    easing: 'easeOut',
    notes: 'Quick bright pulse then gentle glow settle',
  },
  
  curious: {
    keyframes: [
      { t: 0, eyeIntensity: 0.6, bodyBrightness: 0.55, haloSpeed: 0.5, particleDensity: 0.4 },
      { t: 0.5, eyeIntensity: 0.7, bodyBrightness: 0.6, haloSpeed: 0.8, particleDensity: 0.6 },
      { t: 1, eyeIntensity: 0.55, bodyBrightness: 0.55, haloSpeed: 0.5, particleDensity: 0.4 },
    ],
    duration: 2200,
    easing: 'easeInOut',
    notes: 'Halo speed spikes, particles swirl, slight overshoot then settle',
  },
  
  confident: {
    keyframes: [
      { t: 0, eyeIntensity: 0.8, bodyBrightness: 0.8, haloSpeed: 0.6, particleDensity: 0.5 },
      { t: 0.7, eyeIntensity: 0.8, bodyBrightness: 0.8, haloSpeed: 0.6, particleDensity: 0.5 },
      { t: 1, eyeIntensity: 0.7, bodyBrightness: 0.7, haloSpeed: 0.5, particleDensity: 0.45 },
    ],
    duration: 3000,
    easing: 'linear',
    notes: 'Strong, steady glow with slow fade',
  },
  
  concerned: {
    keyframes: [
      { t: 0, eyeIntensity: 0.4, bodyBrightness: 0.4, haloSpeed: 0.35, particleDensity: 0.2 },
      { t: 0.3, eyeIntensity: 0.35, bodyBrightness: 0.38, haloSpeed: 0.32, particleDensity: 0.18 },
      { t: 0.7, eyeIntensity: 0.42, bodyBrightness: 0.42, haloSpeed: 0.37, particleDensity: 0.22 },
      { t: 1, eyeIntensity: 0.35, bodyBrightness: 0.35, haloSpeed: 0.35, particleDensity: 0.2 },
    ],
    duration: 2500,
    easing: 'easeInOut',
    notes: 'Slight flicker with color desaturation',
  },
  
  doubt: {
    keyframes: [
      { t: 0, eyeIntensity: 0.3, bodyBrightness: 0.35, haloSpeed: 0.3, particleDensity: 0.2 },
      { t: 0.4, eyeIntensity: 0.35, bodyBrightness: 0.38, haloSpeed: 0.32, particleDensity: 0.22 },
      { t: 0.8, eyeIntensity: 0.28, bodyBrightness: 0.33, haloSpeed: 0.28, particleDensity: 0.18 },
      { t: 1, eyeIntensity: 0.3, bodyBrightness: 0.35, haloSpeed: 0.3, particleDensity: 0.2 },
    ],
    duration: 2800,
    easing: 'easeInOut',
    notes: 'Small, uneven pulses with shallow oscillation',
  },
  
  shadow: {
    keyframes: [
      { t: 0, eyeIntensity: 0.7, bodyBrightness: 0.3, haloSpeed: 0.8, particleDensity: 0.6 },
      { t: 0.2, eyeIntensity: 0.9, bodyBrightness: 0.25, haloSpeed: 1.0, particleDensity: 0.7 },
      { t: 0.4, eyeIntensity: 0.6, bodyBrightness: 0.3, haloSpeed: 0.8, particleDensity: 0.6 },
      { t: 1, eyeIntensity: 0.7, bodyBrightness: 0.3, haloSpeed: 0.8, particleDensity: 0.6 },
    ],
    duration: 3200,
    easing: 'easeInOut',
    notes: 'Narrow intense eyes, periodic sharp halo flickers, hue shifts toward violet',
  },
};

// Get interpolated values at a specific time point
export const getEmotionStateAtTime = (
  emotion: SageEmotion,
  progress: number // 0-1
): EmotionKeyframe => {
  const timeline = EMOTION_TIMELINES[emotion];
  const { keyframes } = timeline;
  
  // Find surrounding keyframes
  let startFrame = keyframes[0];
  let endFrame = keyframes[keyframes.length - 1];
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].t && progress <= keyframes[i + 1].t) {
      startFrame = keyframes[i];
      endFrame = keyframes[i + 1];
      break;
    }
  }
  
  // Interpolate between frames
  const segmentProgress = (progress - startFrame.t) / (endFrame.t - startFrame.t);
  
  return {
    t: progress,
    eyeIntensity: lerp(startFrame.eyeIntensity, endFrame.eyeIntensity, segmentProgress),
    bodyBrightness: lerp(startFrame.bodyBrightness, endFrame.bodyBrightness, segmentProgress),
    haloSpeed: lerp(startFrame.haloSpeed, endFrame.haloSpeed, segmentProgress),
    particleDensity: lerp(startFrame.particleDensity, endFrame.particleDensity, segmentProgress),
  };
};

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};
