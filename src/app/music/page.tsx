"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Track } from "@/types";
import TrackCard from "@/components/shared/TrackCard";
import Input from "@/components/ui/Input";
import { Search, Music2 } from "lucide-react";

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  const genres = ["All", "Afrobeats", "Afro-fusion", "Amapiano", "R&B", "Hip Hop"];

  useEffect(() => {
    setIsLoading(true);
    api
      .get<Track[]>("/tracks", {
        search,
        genre: selectedGenre === "All" ? "" : selectedGenre,
        sortBy,
        limit: 50,
      })
      .then((res) => setTracks(res.data || []))
      .catch((err) => console.error("Error fetching tracks:", err))
      .finally(() => setIsLoading(false));
  }, [search, selectedGenre, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-2">
          <Music2 className="w-4 h-4" />
          <span>PHLAME NATION CATALOG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8F8FA] font-heading">
          Music & Releases
        </h1>
        <p className="text-xs sm:text-sm text-[#9D9DAE] mt-2 max-w-xl">
          Stream official tracks and download free high-quality audio files directly from the label.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121217] border border-[#242430]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search tracks or artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#9D9DAE] pointer-events-none" />
        </div>

        {/* Genres Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {genres.map((g) => {
            const isSelected = selectedGenre === g || (g === "All" && !selectedGenre);
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g === "All" ? "" : g)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer font-medium ${
                  isSelected
                    ? "bg-[#E5A93C] text-[#08080A] font-bold shadow-md shadow-[#E5A93C]/10"
                    : "bg-[#1A1A22] text-[#9D9DAE] hover:text-[#F8F8FA] border border-[#242430]"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-44">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#1A1A22] text-xs text-[#F8F8FA] border border-[#242430] rounded-lg px-3 py-2.5 outline-none cursor-pointer"
          >
            <option value="newest">Newest Releases</option>
            <option value="popular">Most Streamed</option>
            <option value="downloads">Top Downloads</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Tracks List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[#121217] animate-pulse" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="p-16 text-center text-sm text-[#9D9DAE] bg-[#121217] rounded-2xl border border-[#242430]">
          No tracks matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <TrackCard key={track._id} track={track} queue={tracks} />
          ))}
        </div>
      )}
    </div>
  );
}
