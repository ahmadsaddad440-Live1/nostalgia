import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Sparkles, Disc, Radio } from 'lucide-react';

interface RetroCassettePreviewProps {
  title?: string;
  genreSubtitle?: string;
  isPlaying?: boolean;
}

export const RetroCassettePreview: React.FC<RetroCassettePreviewProps> = ({
  title = "PITA KASET NOSTALGIA 80-90AN",
  genreSubtitle = "Pop Balada & Slow Rock Remastered",
  isPlaying: externalIsPlaying
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapeCounter, setTapeCounter] = useState(128);
  const [vuLevelLeft, setVuLevelLeft] = useState(4);
  const [vuLevelRight, setVuLevelRight] = useState(5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Play nostalgic 80s / 90s chords using Web Audio API
  const playRetroChords = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Classic 80s Pop Ballad Chord Progression: Dmaj9 -> Bm9 -> Gmaj7 -> A7sus4
      const chords = [
        [146.83, 220.00, 277.18, 329.63, 440.00], // Dmaj9 (D3, A3, C#4, E4, A4)
        [123.47, 185.00, 246.94, 293.66, 369.99], // Bm9 (B2, F#3, B3, D4, F#4)
        [98.00, 196.00, 246.94, 293.66, 369.99],  // Gmaj7 (G2, G3, B3, D4, F#4)
        [110.00, 220.00, 293.66, 329.63, 440.00]  // A7sus4 (A2, A3, D4, E4, A4)
      ];

      const now = ctx.currentTime;
      const stepDuration = 2.4;

      chords.forEach((chord, chordIdx) => {
        const chordStartTime = now + chordIdx * stepDuration;

        chord.forEach((freq, noteIdx) => {
          // Yamaha DX7 style FM simulation: Carrier + Modulator + Bell shimmer
          const oscCarrier = ctx.createOscillator();
          const oscMod = ctx.createOscillator();
          const modGain = ctx.createGain();
          const noteGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Carrier: Sine / Triangle
          oscCarrier.type = noteIdx === 0 ? 'sawtooth' : 'sine';
          oscCarrier.frequency.setValueAtTime(freq, chordStartTime);

          // Modulator for chime sparkle
          oscMod.type = 'sine';
          oscMod.frequency.setValueAtTime(freq * 3.5, chordStartTime);
          modGain.gain.setValueAtTime(120, chordStartTime);
          modGain.gain.exponentialRampToValueAtTime(0.01, chordStartTime + stepDuration * 0.9);

          oscMod.connect(oscCarrier.frequency);

          // Low-pass warm filter
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(noteIdx === 0 ? 350 : 2400, chordStartTime);
          filter.frequency.exponentialRampToValueAtTime(900, chordStartTime + stepDuration);

          // Envelope (warm 80s tine pluck & sustain)
          const isBass = noteIdx === 0;
          const peakVol = isBass ? 0.22 : 0.08;
          noteGain.gain.setValueAtTime(0.0001, chordStartTime);
          noteGain.gain.linearRampToValueAtTime(peakVol, chordStartTime + 0.04);
          noteGain.gain.exponentialRampToValueAtTime(peakVol * 0.65, chordStartTime + 0.6);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, chordStartTime + stepDuration * 0.98);

          oscCarrier.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(ctx.destination);

          oscMod.start(chordStartTime);
          oscCarrier.start(chordStartTime);

          oscMod.stop(chordStartTime + stepDuration);
          oscCarrier.stop(chordStartTime + stepDuration);
        });
      });

      // Stop after 4 chords
      setTimeout(() => {
        setIsPlaying(false);
      }, chords.length * stepDuration * 1000);

    } catch (e) {
      console.warn("Web audio playback error:", e);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playRetroChords();
    }
  };

  // VU Meter & Tape Counter animation
  useEffect(() => {
    if (isPlaying || externalIsPlaying) {
      intervalRef.current = window.setInterval(() => {
        setTapeCounter(prev => (prev >= 999 ? 0 : prev + 1));
        setVuLevelLeft(Math.floor(Math.random() * 5) + 3);
        setVuLevelRight(Math.floor(Math.random() * 5) + 3);
      }, 180);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setVuLevelLeft(1);
      setVuLevelRight(1);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, externalIsPlaying]);

  const active = isPlaying || externalIsPlaying;

  return (
    <div className="relative w-full max-w-xl mx-auto my-6 select-none">
      {/* Tape Deck Surround */}
      <div className="bg-gradient-to-b from-stone-900 via-zinc-950 to-neutral-950 p-4 sm:p-6 rounded-3xl border-2 border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.15)] relative overflow-hidden">
        
        {/* Subtle vintage texture and metallic sheen */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Top Deck Info Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
            <span className="tracking-widest font-bold text-zinc-300">DOLBY B-C NR</span>
            <span className="text-zinc-600">|</span>
            <span className="text-cyan-400 font-semibold tracking-wide">CrO₂ HIGH BIAS</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-sans font-bold">TAPE</span>
              <span className="font-retro-lcd text-amber-400 text-base tracking-widest">
                {String(tapeCounter).padStart(3, '0')}
              </span>
            </div>
            <span className="bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded text-[10px] border border-rose-800/40 font-bold">
              SIDE A
            </span>
          </div>
        </div>

        {/* Cassette Tape Body */}
        <div className="relative bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-4 rounded-2xl border border-zinc-700/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.6)]">
          
          {/* Cassette Label (Retro Paper Aesthetic) */}
          <div className="relative bg-gradient-to-r from-amber-100 via-stone-100 to-amber-50 text-stone-900 p-3.5 rounded-xl border border-stone-300 shadow-md overflow-hidden">
            
            {/* Retro 80s stripes */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-fuchsia-600 to-cyan-500" />
            
            <div className="flex justify-between items-start pt-1">
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-rose-700">
                  ★ KASET PITA STEREO INDONESIA ★
                </div>
                <h4 className="text-sm sm:text-base font-black tracking-tight text-stone-900 uppercase truncate max-w-[280px]">
                  {title}
                </h4>
                <p className="text-[10px] text-stone-600 font-medium truncate max-w-[260px]">
                  {genreSubtitle}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block text-[9px] font-mono font-bold bg-stone-900 text-amber-200 px-1.5 py-0.5 rounded">
                  C-60 HQ
                </span>
                <div className="text-[8px] text-stone-500 font-mono mt-0.5">ERA 80-90AN</div>
              </div>
            </div>

            {/* Middle Transparent Cassette Window */}
            <div className="mt-3 bg-zinc-950/90 rounded-xl p-2.5 border-2 border-stone-400/80 shadow-[inset_0_3px_10px_rgba(0,0,0,0.9)] flex items-center justify-around relative overflow-hidden">
              
              {/* Left Spool */}
              <div className="relative flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full border-2 border-zinc-400 bg-zinc-900 flex items-center justify-center shadow-inner ${active ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 rounded-full border border-zinc-500 bg-stone-950 flex items-center justify-center relative">
                    {/* Teeth of spool */}
                    <div className="w-1.5 h-full bg-zinc-300 absolute" />
                    <div className="w-full h-1.5 bg-zinc-300 absolute" />
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-400 z-10" />
                  </div>
                </div>
                {/* Magnetic tape roll preview */}
                <div className="absolute -inset-1 rounded-full border-4 border-amber-950/40 pointer-events-none" />
              </div>

              {/* Center Tape Level Viewport */}
              <div className="flex flex-col items-center justify-center px-2">
                <div className="w-20 h-4 bg-zinc-900/90 rounded border border-zinc-700 flex items-center justify-center">
                  <div className="h-1.5 w-14 bg-gradient-to-r from-amber-900 to-amber-950 rounded-full shadow-inner" />
                </div>
                <div className="flex gap-2 text-[9px] font-retro-lcd text-amber-400/90 mt-1">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
              </div>

              {/* Right Spool */}
              <div className="relative flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full border-2 border-zinc-400 bg-zinc-900 flex items-center justify-center shadow-inner ${active ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 rounded-full border border-zinc-500 bg-stone-950 flex items-center justify-center relative">
                    <div className="w-1.5 h-full bg-zinc-300 absolute" />
                    <div className="w-full h-1.5 bg-zinc-300 absolute" />
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-400 z-10" />
                  </div>
                </div>
                <div className="absolute -inset-2 rounded-full border-8 border-amber-950/60 pointer-events-none" />
              </div>
            </div>

            {/* Bottom Cassette Screws & Subtext */}
            <div className="flex items-center justify-between pt-2 text-[8px] text-stone-500 font-mono">
              <span>● HI-FI STEREO CASSETTE</span>
              <span className="font-bold text-stone-700 tracking-wider">AQUARIUS / MUSICA VIBE</span>
              <span>JAPAN MECHANISM ●</span>
            </div>
          </div>
        </div>

        {/* Bottom Control & LED VU Meter Strip */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Real Audio Synthesis Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-[1.02]'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Hentikan Audio Sample 80s</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Tes Dentingan Chime DX7 (Web Audio)</span>
              </>
            )}
          </button>

          {/* Retro LED VU Meters */}
          <div className="flex items-center gap-3 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <div className="text-[9px] font-mono text-zinc-500 font-bold">VU METER</div>
            <div className="space-y-1">
              {/* Left Channel */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-zinc-400 font-mono w-2">L</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(level => {
                    const isLit = active && vuLevelLeft >= level;
                    const color = level <= 5 ? 'bg-emerald-500' : level <= 7 ? 'bg-amber-400' : 'bg-rose-500';
                    return (
                      <span
                        key={`l-${level}`}
                        className={`w-1.5 h-2 rounded-[1px] transition-colors duration-100 ${
                          isLit ? `${color} shadow-[0_0_4px_currentColor]` : 'bg-zinc-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right Channel */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-zinc-400 font-mono w-2">R</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(level => {
                    const isLit = active && vuLevelRight >= level;
                    const color = level <= 5 ? 'bg-emerald-500' : level <= 7 ? 'bg-amber-400' : 'bg-rose-500';
                    return (
                      <span
                        key={`r-${level}`}
                        className={`w-1.5 h-2 rounded-[1px] transition-colors duration-100 ${
                          isLit ? `${color} shadow-[0_0_4px_currentColor]` : 'bg-zinc-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RetroCassettePreview;
