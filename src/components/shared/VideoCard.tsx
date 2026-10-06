"use client";

import React from "react";
import Image from "next/image";
import { Video } from "@/types";
import { useUIStore } from "@/stores/useUIStore";
import { Play } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { openVideoModal } = useUIStore();

  const categoryLabels = {
    music_video: "Official Video",
    visualizer: "Visualizer",
    lyric_video: "Lyric Video",
    live_performance: "Live Session",
    behind_the_scenes: "Behind The Scenes",
    teaser: "Teaser",
  };

  return (
    <div
      onClick={() => openVideoModal(video)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col"
    >
      <div className="relative aspect-video w-full bg-black overflow-hidden">
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E5A93C] to-[#D4952B] flex items-center justify-center text-[#08080A] shadow-lg shadow-[#E5A93C]/30 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[#E5A93C]">
          {(categoryLabels as Record<string, string>)[video.category] || video.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h4 className="text-sm font-bold text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors line-clamp-1">
          {video.title}
        </h4>
        {video.artistsText && (
          <p className="text-xs text-[#9D9DAE] truncate">{video.artistsText}</p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
