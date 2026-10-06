"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ArrowRight, Play, Flame } from "lucide-react";
import { heroService } from "@/services/api";
import { HeroConfig } from "@/types";

interface HeroVideoProps {
  initialConfig?: HeroConfig;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ initialConfig }) => {
  const [hero, setHero] = useState<HeroConfig | null>(initialConfig || null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaReadyRef = useRef(false);
  const minTimerDoneRef = useRef(false);

  // Fetch active hero configuration from backend API
  useEffect(() => {
    heroService
      .getHero()
      .then((res) => {
        if (res.data) {
          setHero(res.data);
          setIsMuted(res.data.isMutedDefault !== false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch hero config, using fallback:", err);
      });
  }, []);

  // Show c-logo.png as a loading animation for at least 1.8s, exactly as it was before
  useEffect(() => {
    const minTimer = setTimeout(() => {
      minTimerDoneRef.current = true;
      // If media has already loaded or in default mode, transition out smoothly
      if (mediaReadyRef.current || hero?.type === "default") {
        setVideoLoaded(true);
      }
    }, 1800);

    // Safety fallback so user is never stuck if media load event delays
    const safetyTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 3800);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
    };
  }, [hero?.type]);

  const handleMediaLoaded = () => {
    mediaReadyRef.current = true;
    // Only transition if the minimum brand loading animation time (1.8s) has finished
    if (minTimerDoneRef.current) {
      setVideoLoaded(true);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const type = hero?.type || "video";
  const videoUrl =
    hero?.videoUrl ||
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
    "https://www.youtube.com/watch?v=0-VwN0s9HJU";
  const imageUrl = hero?.imageUrl || "";

  // Check if YouTube
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  let youtubeId = "0-VwN0s9HJU";
  if (isYouTube) {
    if (videoUrl.includes("v=")) {
      youtubeId = videoUrl.split("v=")[1]?.split("&")[0] || youtubeId;
    } else if (videoUrl.includes("youtu.be/")) {
      youtubeId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || youtubeId;
    } else {
      youtubeId = videoUrl.split("/").pop() || youtubeId;
    }
  }

  // Optimize Cloudinary video URL with auto quality and auto format if not already present
  const optimizedVideoUrl =
    videoUrl.includes("cloudinary.com") && !videoUrl.includes("f_auto,q_auto")
      ? videoUrl.replace("/upload/", "/upload/f_auto,q_auto/")
      : videoUrl;

  // Text should ONLY appear when there's no video or image banner
  const hasActiveMedia =
    Boolean(type === "video" && videoUrl) ||
    Boolean(type === "image" && imageUrl);

  const showOverlay = !hasActiveMedia;
  const badgeText = hero?.badgeText || "PHLAME NATION ENTERTAINMENT";
  const headline = hero?.headline || "IGNITING GLOBAL SOUNDS";
  const subheadline =
    hero?.subheadline ||
    "The frontline of African sonic excellence, world tours, and platinum artistry.";
  const primaryCtaText = hero?.primaryCtaText || "Listen to Catalogue";
  const primaryCtaLink = hero?.primaryCtaLink || "/music";
  const secondaryCtaText = hero?.secondaryCtaText || "Meet the Roster";
  const secondaryCtaLink = hero?.secondaryCtaLink || "/artists";

  return (
    <section className="relative w-full h-[85vh] sm:h-screen min-h-[640px] overflow-hidden bg-black flex items-center justify-center">
      {/* 1. Preloader Screen: Phlame Nation Logo displayed until media is ready */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
          videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
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

          <div className="w-36 h-0.5 bg-[#242430] rounded-full overflow-hidden mt-3">
            <div className="w-full h-full bg-[#E5A93C] animate-[marquee_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* 2. Visual Layer: Video, Image Banner, or Default */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {type === "video" && videoUrl && (
          <>
            {isYouTube ? (
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
                  title="Phlame Nation Hero Visual"
                  onLoad={handleMediaLoaded}
                  className="absolute top-1/2 left-1/2 w-[160vw] h-[160vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={optimizedVideoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onLoadedData={handleMediaLoaded}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        )}

        {type === "image" && imageUrl && (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={headline}
              fill
              priority
              onLoadingComplete={handleMediaLoaded}
              className="object-cover transition-transform duration-1000 scale-100"
            />
          </div>
        )}

        {type === "default" && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#101016] via-[#0A0A0E] to-[#08080A] flex items-center justify-center">
            {/* Animated Ambient Light Spheres */}
            <div className="absolute w-[600px] h-[600px] bg-[#E5A93C]/10 rounded-full blur-[130px] animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 w-[450px] h-[450px] bg-[#D4952B]/15 rounded-full blur-[100px] pointer-events-none" />
          </div>
        )}
      </div>

      {/* 3. Subtle Cinema Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-black/60 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />

      {/* 4. Luxury Typography & Calls to Action Overlay (Shown ONLY when no video or image banner) */}
      {showOverlay && (
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-8 w-full flex flex-col items-center justify-center text-center">
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center text-center">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-[#E5A93C]/40 backdrop-blur-md">
                <Flame className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E5A93C]">
                  {badgeText}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
              {headline}
            </h1>

            {subheadline && (
              <p className="text-sm sm:text-base text-[#D4D4E2] font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                {subheadline}
              </p>
            )}

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              {primaryCtaText && (
                <Link
                  href={primaryCtaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4952B] hover:from-[#F3C772] hover:to-[#E5A93C] text-[#08080A] font-bold text-sm tracking-wide shadow-lg shadow-[#E5A93C]/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {primaryCtaText}
                </Link>
              )}

              {secondaryCtaText && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all hover:border-white/40"
                >
                  {secondaryCtaText}
                  <ArrowRight className="w-4 h-4 text-[#E5A93C]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Audio Control (For HTML5 Videos) */}
      {type === "video" && !isYouTube && (
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#9D9DAE]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#E5A93C]" />
          )}
        </button>
      )}
    </section>
  );
};

export default HeroVideo;
