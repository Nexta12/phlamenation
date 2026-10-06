"use client";

import React, { useState } from "react";
import { StreamingPlatforms } from "@/types";
import { Radio, ExternalLink } from "lucide-react";

interface TrackStreamingLinksProps {
  platforms?: StreamingPlatforms;
  size?: "xs" | "sm" | "md";
  variant?: "icons" | "dropdown" | "pills";
  className?: string;
}

export const TrackStreamingLinks: React.FC<TrackStreamingLinksProps> = ({
  platforms,
  size = "sm",
  variant = "icons",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!platforms) return null;

  const links = [
    {
      key: "spotify",
      name: "Spotify",
      url: platforms.spotify,
      hoverClass: "hover:text-[#1DB954] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10",
      activeBg: "bg-[#1DB954]/15 border-[#1DB954]/40 text-[#1DB954]",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      key: "appleMusic",
      name: "Apple Music",
      url: platforms.appleMusic,
      hoverClass: "hover:text-[#FC3C44] hover:border-[#FC3C44]/50 hover:bg-[#FC3C44]/10",
      activeBg: "bg-[#FC3C44]/15 border-[#FC3C44]/40 text-[#FC3C44]",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.15c.66-.8 1.11-1.92.99-3.04-1 .04-2.15.65-2.83 1.45-.58.67-1.1 1.82-.96 2.93 1.12.09 2.14-.54 2.8-1.34z" />
        </svg>
      ),
    },
    {
      key: "audiomack",
      name: "Audiomack",
      url: platforms.audiomack,
      hoverClass: "hover:text-[#FFA200] hover:border-[#FFA200]/50 hover:bg-[#FFA200]/10",
      activeBg: "bg-[#FFA200]/15 border-[#FFA200]/40 text-[#FFA200]",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 3L2 9l10 6 10-6-10-6zm0 18l-8-4.8v-3.6l8 4.8 8-4.8v3.6L12 21zm0-6.6l-6.8-4.1L12 6.2l6.8 4.1L12 14.4z" />
        </svg>
      ),
    },
    {
      key: "boomplay",
      name: "Boomplay",
      url: platforms.boomplay,
      hoverClass: "hover:text-[#00D2FF] hover:border-[#00D2FF]/50 hover:bg-[#00D2FF]/10",
      activeBg: "bg-[#00D2FF]/15 border-[#00D2FF]/40 text-[#00D2FF]",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      ),
    },
    {
      key: "youtubeMusic",
      name: "YouTube Music",
      url: platforms.youtubeMusic,
      hoverClass: "hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10",
      activeBg: "bg-[#FF0000]/15 border-[#FF0000]/40 text-[#FF0000]",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-2-10.5v7l6-3.5-6-3.5z" />
        </svg>
      ),
    },
  ];

  const activeLinks = links.filter((l) => Boolean(l.url && l.url.trim()));

  if (activeLinks.length === 0) return null;

  const sizeClasses = {
    xs: "w-6 h-6 p-1 text-[10px]",
    sm: "w-7 h-7 p-1.5 text-xs",
    md: "w-8 h-8 p-1.5 text-sm",
  };

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          title="Stream on other platforms"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#16161D] border border-[#242430] hover:border-[#E5A93C]/40 text-[#9D9DAE] hover:text-[#F8F8FA] text-xs transition-colors cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>Stream</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#121217] border border-[#242430] shadow-2xl p-1.5 z-40 flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B7B] px-2 py-1">
                Listen on
              </span>
              {activeLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#9D9DAE] hover:text-white transition-all ${item.hoverClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === "pills") {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {activeLinks.map((item) => (
          <a
            key={item.key}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Listen on ${item.name}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#242430] bg-[#16161D] text-xs text-[#9D9DAE] transition-all ${item.hoverClass}`}
          >
            <span className="w-3.5 h-3.5">{item.icon}</span>
            <span className="text-[11px] font-medium">{item.name}</span>
          </a>
        ))}
      </div>
    );
  }

  // Default "icons" variant
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {activeLinks.map((item) => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={`Stream on ${item.name}`}
          className={`rounded-lg bg-[#16161D] border border-[#242430] text-[#9D9DAE] transition-all flex items-center justify-center cursor-pointer ${sizeClasses[size]} ${item.hoverClass}`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default TrackStreamingLinks;
