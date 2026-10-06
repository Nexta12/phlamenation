"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Music,
  X,
} from "lucide-react";
import TrackStreamingLinks from "@/components/shared/TrackStreamingLinks";

export const FloatingPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    setAudioRef,
    togglePlay,
    next,
    prev,
    setVolume,
    setProgress,
    setDuration,
    downloadCurrentTrack,
    closePlayer,
  } = usePlayerStore();

  // Keep audioRef registered in Zustand store on mount
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  // Synchronize audio element state when currentTrack, isPlaying, or volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = currentTrack?.audioFile?.url || currentTrack?.audioFile?.secure_url || "";

    if (!audioUrl) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    audio.volume = volume;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio playback was prevented or failed:", err);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const artistName =
    currentTrack && typeof currentTrack.primaryArtist === "object"
      ? currentTrack.primaryArtist?.stageName || currentTrack.primaryArtist?.name
      : "Artist";

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={next}
      />

      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0C10]/95 backdrop-blur-md border-t border-[#242430] py-3 px-4 md:px-8 transition-transform duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Track Info */}
            <div className="flex items-center gap-3 w-full md:w-1/4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#16161D] shrink-0 border border-[#242430]">
                {currentTrack.coverArt?.url ? (
                  <Image
                    src={currentTrack.coverArt.url}
                    alt={currentTrack.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#E5A93C]">
                    <Music className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="truncate flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#F8F8FA] truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-[#9D9DAE] truncate">{artistName}</p>
              </div>

            {/* Mobile Close Button */}
            <button
              onClick={closePlayer}
              title="Close player"
              aria-label="Close player"
              className="md:hidden p-1.5 text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                aria-label="Previous track"
                className="text-[#9D9DAE] hover:text-[#F8F8FA] transition-colors p-1 cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E5A93C] to-[#D4952B] hover:scale-105 transition-transform flex items-center justify-center text-[#08080A] shadow-md shadow-[#E5A93C]/20 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={next}
                aria-label="Next track"
                className="text-[#9D9DAE] hover:text-[#F8F8FA] transition-colors p-1 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full flex items-center gap-2.5 text-[11px] text-[#9D9DAE]">
              <span className="w-8 text-right tabular-nums">{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-[#242430] rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
              />
              <span className="w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume, Streaming Links & Download */}
          <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
            {currentTrack.streamingPlatforms && (
              <TrackStreamingLinks
                platforms={currentTrack.streamingPlatforms}
                variant="icons"
                size="sm"
              />
            )}

            {currentTrack.isDownloadable !== false && Boolean(currentTrack.audioFile?.url || currentTrack.audioFile?.secure_url) && (
              <button
                onClick={downloadCurrentTrack}
                title="Download track"
                className="flex items-center gap-1.5 text-xs text-[#9D9DAE] hover:text-[#E5A93C] border border-[#242430] hover:border-[#E5A93C]/40 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Free MP3</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                className="text-[#9D9DAE] hover:text-[#F8F8FA] cursor-pointer"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#EF4444]" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-[#242430] rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
              />
            </div>

            <div className="h-5 w-px bg-[#242430] mx-0.5" />

            {/* Desktop Close Button */}
            <button
              onClick={closePlayer}
              title="Close player"
              aria-label="Close player"
              className="p-1.5 text-[#9D9DAE] hover:text-[#F8F8FA] hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default FloatingPlayer;
