"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  youtubeId?: string;
  fallbackPoster?: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  youtubeId = "0-VwN0s9HJU",
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Set timeout fallback so logo gracefully transitions even if YouTube iframe load event is delayed
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black flex items-center justify-center">
      {/* 1. Preloader Screen: Phlame Nation Logo displayed until video is ready */}
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
          videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
          {/* Logo Crest */}
          <div className="relative">
            <div className="absolute -inset-6 bg-[#E5A93C]/25 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 drop-shadow-[0_10px_35px_rgba(229,169,60,0.4)]">
              <Image
                src="/images/c-logo.png"
                alt="Phlame Nation Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Minimalist Loading Bar */}
          <div className="w-36 h-0.5 bg-[#242430] rounded-full overflow-hidden mt-3">
            <div className="w-full h-full bg-[#E5A93C] animate-[marquee_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Background Video Frame */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
          title="Phlame Nation Hero Visual"
          onLoad={handleIframeLoad}
          className="absolute top-1/2 left-1/2 w-[160vw] h-[160vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* 3. Subtle Cinema Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

    </section>
  );
};

export default HeroVideo;
