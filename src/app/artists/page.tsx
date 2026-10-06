"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Artist } from "@/types";
import ArtistCard from "@/components/shared/ArtistCard";
import ArtistSpotlight from "@/components/home/ArtistSpotlight";
import Input from "@/components/ui/Input";
import { Users, Search } from "lucide-react";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<Artist[]>("/artists", {
        search,
        status: selectedStatus === "all" ? "" : selectedStatus,
        limit: 40,
      })
      .then((res) => setArtists(res.data || []))
      .catch((err) => console.error("Error fetching artists:", err))
      .finally(() => setIsLoading(false));
  }, [search, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-2">
          <Users className="w-4 h-4" />
          <span>GLOBAL TALENT ROSTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8F8FA] font-heading">
          Our Artists
        </h1>
        <p className="text-xs sm:text-sm text-[#9D9DAE] mt-2 max-w-xl">
          The visionaries shaping the soundscape of contemporary African and international music.
        </p>
      </div>

      {artists.length > 0 && (
        <ArtistSpotlight
          artist={
            artists.find((a) => a.isFeatured && a.status === "signed") ||
            artists.find((a) => a.isFeatured) ||
            artists[0]
          }
        />
      )}

      {/* Filter / Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121217] border border-[#242430]">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#9D9DAE] pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "signed", "alumni"].map((st) => {
            const isSelected = selectedStatus === st || (st === "all" && !selectedStatus);
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st === "all" ? "" : st)}
                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-all cursor-pointer font-medium ${
                  isSelected
                    ? "bg-[#E5A93C] text-[#08080A] font-bold"
                    : "bg-[#1A1A22] text-[#9D9DAE] border border-[#242430]"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-[#121217] animate-pulse" />
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="p-16 text-center text-sm text-[#9D9DAE] bg-[#121217] rounded-2xl border border-[#242430]">
          No artists found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
