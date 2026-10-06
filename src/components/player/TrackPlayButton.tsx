"use client";

import React from "react";
import { Play, Pause } from "lucide-react";
import { Track } from "@/types";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface TrackPlayButtonProps {
  track: Track;
  queue?: Track[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TrackPlayButton: React.FC<TrackPlayButtonProps> = ({
  track,
  queue,
  size = "md",
  className = "",
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const isCurrent = currentTrack?._id === track._id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isCurrentlyPlaying ? "Pause track" : "Play track"}
      className={`rounded-full bg-gradient-to-r from-[#E5A93C] to-[#D4952B] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-[#08080A] shadow-md shadow-[#E5A93C]/20 shrink-0 cursor-pointer ${sizes[size]} ${className}`}
    >
      {isCurrentlyPlaying ? (
        <Pause className={`${iconSizes[size]} fill-current`} />
      ) : (
        <Play className={`${iconSizes[size]} fill-current ml-0.5`} />
      )}
    </button>
  );
};

export default TrackPlayButton;
