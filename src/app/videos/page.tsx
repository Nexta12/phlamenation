"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Video } from "@/types";
import VideoCard from "@/components/shared/VideoCard";
import Input from "@/components/ui/Input";
import { Film, Search } from "lucide-react";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { label: "All Videos", value: "" },
    { label: "Music Videos", value: "music_video" },
    { label: "Visualizers", value: "visualizer" },
    { label: "Live Performances", value: "live_performance" },
    { label: "Behind The Scenes", value: "behind_the_scenes" },
    { label: "Lyric Videos", value: "lyric_video" },
  ];

  useEffect(() => {
    setIsLoading(true);
    api
      .get<Video[]>("/videos", {
        search,
        category: selectedCategory,
        limit: 50,
      })
      .then((res) => setVideos(res.data || []))
      .catch((err) => console.error("Error fetching videos:", err))
      .finally(() => setIsLoading(false));
  }, [search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-2">
          <Film className="w-4 h-4" />
          <span>VISUAL EXPERIENCES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8F8FA] font-heading">
          Videos & Premieres
        </h1>
        <p className="text-xs sm:text-sm text-[#9D9DAE] mt-2 max-w-xl">
          Watch official music videos, visualizers, concert sessions, and behind-the-scenes footage.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121217] border border-[#242430]">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#9D9DAE] pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer font-medium ${
                  isSelected
                    ? "bg-[#E5A93C] text-[#08080A] font-bold"
                    : "bg-[#1A1A22] text-[#9D9DAE] hover:text-[#F8F8FA] border border-[#242430]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-[#121217] animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="p-16 text-center text-sm text-[#9D9DAE] bg-[#121217] rounded-2xl border border-[#242430]">
          No videos found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
