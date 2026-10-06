"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { TourEvent, Artist } from "@/types";
import EventCard from "@/components/shared/EventCard";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/stores/useUIStore";
import { Calendar, Flame } from "lucide-react";

export default function ToursPage() {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [timeframe, setTimeframe] = useState<"upcoming" | "past">("upcoming");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { openRequestShowModal } = useUIStore();

  useEffect(() => {
    setIsLoading(true);
    api
      .get<TourEvent[]>("/events", { timeframe, limit: 50 })
      .then((res) => setEvents(res.data || []))
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setIsLoading(false));
  }, [timeframe]);

  useEffect(() => {
    api
      .get<Artist[]>("/artists", { limit: 10 })
      .then((res) => setArtists(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-2">
            <Calendar className="w-4 h-4" />
            <span>LIVE CONCERTS & TOURS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8F8FA] font-heading">
            Live Tour Dates
          </h1>
          <p className="text-xs sm:text-sm text-[#9D9DAE] mt-2 max-w-xl">
            Catch your favorite Phlame Nation artists live in concert around the world.
          </p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#121217] border border-[#242430]">
          <button
            onClick={() => setTimeframe("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "upcoming"
                ? "bg-[#E5A93C] text-[#08080A]"
                : "text-[#9D9DAE] hover:text-[#F8F8FA]"
            }`}
          >
            Upcoming Dates
          </button>
          <button
            onClick={() => setTimeframe("past")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeframe === "past"
                ? "bg-[#E5A93C] text-[#08080A]"
                : "text-[#9D9DAE] hover:text-[#F8F8FA]"
            }`}
          >
            Past Shows
          </button>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#121217] animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center text-sm text-[#9D9DAE] bg-[#121217] rounded-2xl border border-[#242430] flex flex-col items-center gap-3">
          <Calendar className="w-10 h-10 text-[#E5A93C] opacity-40" />
          <p className="font-semibold text-[#F8F8FA]">
            {timeframe === "upcoming"
              ? "No upcoming tour dates announced yet."
              : "No past tour dates recorded."}
          </p>
          <p className="text-xs text-[#6B6B7B] max-w-sm">
            Don't see your city on the schedule? Request a tour stop below to alert management.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* Fan City Demand Section */}
      <div className="rounded-3xl bg-[#121217] border border-[#242430] p-8 md:p-12 text-center flex flex-col items-center gap-4">
        <Flame className="w-8 h-8 text-[#E5A93C]" />
        <h3 className="text-2xl font-black text-[#F8F8FA]">
          Want an Artist to Visit Your City?
        </h3>
        <p className="text-xs md:text-sm text-[#9D9DAE] max-w-lg">
          We use real fan demand data when planning international and regional tour dates. Choose an artist and drop your city!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {artists.map((artist) => (
            <Button
              key={artist._id}
              variant="outline"
              size="sm"
              onClick={() => openRequestShowModal(artist)}
            >
              <span>Request {artist.name || (artist as any).stageName}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
