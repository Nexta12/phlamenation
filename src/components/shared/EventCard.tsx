"use client";

import React from "react";
import { TourEvent, Artist } from "@/types";
import { useUIStore } from "@/stores/useUIStore";
import { Calendar, MapPin, ExternalLink, Flame } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface EventCardProps {
  event: TourEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { openRequestShowModal } = useUIStore();

  const eventDate = new Date(event.date || event.eventDate || Date.now());
  const month = eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = eventDate.getDate();

  const statusVariants: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    available: "success",
    selling_fast: "warning",
    sold_out: "danger",
    free: "success",
    cancelled: "neutral",
  };

  const statusLabels: Record<string, string> = {
    available: "Tickets Available",
    selling_fast: "Selling Fast",
    sold_out: "Sold Out",
    free: "Free Entry",
    cancelled: "Cancelled",
  };

  const primaryArtist = event.artists?.[0] as Artist | undefined;
  const currentStatus = event.ticketStatus || event.status || "available";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/40 transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* Date Box */}
        <div className="w-14 h-14 rounded-xl bg-[#1A1A22] border border-[#242430] flex flex-col items-center justify-center shrink-0 text-center">
          <span className="text-[10px] font-black text-[#E5A93C] tracking-wider">{month}</span>
          <span className="text-xl font-black text-[#F8F8FA] leading-none">{day}</span>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-[#F8F8FA]">{event.title}</h4>
            <Badge variant={statusVariants[currentStatus] || "neutral"} size="sm">
              {statusLabels[currentStatus] || currentStatus}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9D9DAE]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
              {event.venue}, {event.city}, {event.country}
            </span>
            {event.time && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {event.time}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#242430]/60">
        {primaryArtist && (
          <button
            onClick={() => openRequestShowModal(primaryArtist)}
            className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors flex items-center gap-1 px-3 py-2 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Request In My City</span>
          </button>
        )}

        {event.ticketUrl && event.ticketStatus !== "sold_out" && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#D4952B] text-[#08080A] text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-[#E5A93C]/10 shrink-0"
          >
            <span>Get Tickets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
