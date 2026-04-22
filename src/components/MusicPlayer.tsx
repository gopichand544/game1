import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "AI Synthesis: Hyperdrive",
    artist: "Neon Core",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/A_Night_Of_Dizzy_Spells.ogg", 
  },
  {
    id: 2,
    title: "Neural Network Groove",
    artist: "Cyber Synth",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Complex_-_Kevin_MacLeod.ogg",
  },
  {
    id: 3,
    title: "Quantum Echoes",
    artist: "Byte Warden",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Jumpshot.ogg",
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleEnded = () => {
    handleSkipForward();
  };

  return (
    <div className="glass-panel p-5 flex flex-col w-full shrink-0">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded} 
        preload="auto"
      />
      
      <div className="flex flex-col mb-6 p-2 transition-colors bg-[#000] border-2 border-[var(--cyan)] shadow-[2px_2px_0_var(--magenta)]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[var(--magenta)] border-2 border-[#fff] flex items-center justify-center text-black font-display font-bold text-xl">
            {currentTrack.id.toString().padStart(2, '0')}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-[#fff] font-bold text-xl truncate uppercase tracking-widest">
              {currentTrack.title}
            </h3>
            <p className="text-[var(--cyan)] text-lg truncate uppercase mt-1">{currentTrack.artist}</p>
          </div>
        </div>
      </div>

      {/* Visualizer bars placeholder moved here */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-1 h-8 mb-6">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 bg-[var(--magenta)] border-t-2 border-[var(--cyan)]"
              style={{
                height: `${Math.max(10, Math.random() * 100)}%`,
                animation: `pulse ${0.3 + Math.random() * 0.3}s infinite steps(2, start)`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto">
        <button 
          onClick={handleSkipBack} 
          className="btn-retro w-12 h-12 flex items-center justify-center"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>

        <button 
          onClick={togglePlay} 
          className="btn-retro w-16 h-16 flex items-center justify-center !text-[var(--magenta)] !border-[var(--magenta)] hover:!bg-[var(--magenta)] hover:!text-black"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={handleSkipForward} 
          className="btn-retro w-12 h-12 flex items-center justify-center"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>

        <div className="w-1 h-8 bg-[var(--cyan)] mx-2 border-[1px] border-[#fff]"></div>

        <button 
          onClick={toggleMute} 
          className="btn-retro w-12 h-12 flex items-center justify-center"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
