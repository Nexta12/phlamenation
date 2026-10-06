"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/services/api";
import { Artist } from "@/types";
import HomeSidebar from "@/components/home/HomeSidebar";
import HeroVideo from "@/components/home/HeroVideo";
import PartnerLogos from "@/components/home/PartnerLogos";
import { ArrowRight, User } from "lucide-react";



export default function HomePage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);
  const [isGalleryInView, setIsGalleryInView] = useState(false);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsGalleryInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [artists]);

  useEffect(() => {
    api
      .get<Artist[]>("/artists", { limit: 6 })
      .then((res) => {
        setArtists(res.data || []);
      })
      .catch((err) => console.warn("Could not load artists:", err?.message || err))
      .finally(() => setIsLoading(false));
  }, []);



  const isSingleArtist = artists.length <= 1;
  const primaryArtist = artists[0];
  const singleArtistHref = primaryArtist
    ? `/artists/${primaryArtist.slug || primaryArtist._id}`
    : "/artists";

  // Pull up to 6 photos dynamically from the singular artist's DB record
  const singleArtistPhotos: string[] =
    primaryArtist?.photos && primaryArtist.photos.length > 0
      ? primaryArtist.photos
          .map((p) => p.url || p.secure_url)
          .filter((url): url is string => Boolean(url))
          .slice(0, 6)
      : [
          primaryArtist?.banner?.url || primaryArtist?.banner?.secure_url,
          primaryArtist?.avatar?.url || primaryArtist?.avatar?.secure_url,
        ].filter((url): url is string => Boolean(url));

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* 1. Full-Screen Video Hero (Mavin-Style with Logo Preloader) */}
      <HeroVideo />

      {/* 2. Main Two-Column Layout: Feed + Dedicated News & Updates Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed: 8 Columns on Large Screens */}
          <main className="lg:col-span-8 flex flex-col gap-14">
            {/* A. Image Gallery of Artists (3 rows, 2 columns - 6 Images) */}
            <section className="w-full">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C] block mb-1">
                    THE ROSTER
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8F8FA]">
                    {isSingleArtist && primaryArtist
                      ? primaryArtist.stageName || primaryArtist.name || "Artist"
                      : "Artists"}
                  </h2>
                </div>
                <Link
                  href={isSingleArtist && primaryArtist ? singleArtistHref : "/artists"}
                  className="text-xs font-semibold text-[#9D9DAE] hover:text-[#E5A93C] transition-colors flex items-center gap-1"
                >
                  <span>{isSingleArtist ? "View Profile" : "View All"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 sm:h-72 lg:h-80 rounded-2xl bg-[#121217] animate-pulse border border-[#242430]"
                    />
                  ))}
                </div>
              ) : isSingleArtist && primaryArtist ? (
                /* SINGLE ARTIST MODE:
                   Displays 6 curated dynamic photos of the artist pulled from the DB.
                   No artist name, no music genre, and no visible link icon.
                   Clicking ANY of the 6 images navigates directly to this artist's profile.
                */
                <div ref={galleryRef} className="grid grid-cols-2 gap-4 sm:gap-6">
                  {singleArtistPhotos.map((photoUrl, idx) => (
                    <Link
                      key={`artist-photo-${idx}`}
                      href={singleArtistHref}
                      style={{
                        transitionDelay: `${idx * 100}ms`,
                      }}
                      className={`group relative block h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/60 transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-[#E5A93C]/10 transform ${
                        isGalleryInView
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 -translate-y-12 scale-[0.96] pointer-events-none"
                      }`}
                    >
                      <Image
                        src={photoUrl}
                        alt={primaryArtist?.stageName || primaryArtist?.name || "Featured Artist"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Subtle hover vignette overlay for refined feel (no text or visible link icon) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>
              ) : artists.length > 0 ? (
                /* MULTI-ARTIST MODE (activated when multiple artists exist) */
                <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {artists.slice(0, 6).map((artist, idx) => {
                    const artistName = artist.stageName || artist.name || "Artist";
                    const avatarUrl =
                      artist.banner?.url ||
                      artist.banner?.secure_url ||
                      artist.bannerImage?.url ||
                      artist.bannerImage?.secure_url ||
                      artist.avatar?.url ||
                      artist.avatar?.secure_url;
                    return (
                      <Link
                        key={artist._id}
                        href={`/artists/${artist.slug || artist._id}`}
                        style={{
                          transitionDelay: `${idx * 100}ms`,
                        }}
                        className={`group relative block h-56 sm:h-64 lg:h-72 rounded-2xl overflow-hidden bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/50 transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-black/70 transform ${
                          isGalleryInView
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 -translate-y-12 scale-[0.96] pointer-events-none"
                        }`}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={artistName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9D9DAE]">
                            <User className="w-14 h-14 opacity-30" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                          <h3 className="text-base sm:text-lg font-bold text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors truncate">
                            {artistName}
                          </h3>
                          <p className="text-xs text-[#9D9DAE] truncate">
                            {artist.genres?.join(" • ") || artist.genre || "Recording Artist"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#121217] border border-[#242430] text-center">
                  <p className="text-sm text-[#9D9DAE]">No artists added to the roster yet.</p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar: 4 Columns on Large Screens (Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 w-full">
            <HomeSidebar />
          </aside>
        </div>
      </div>

      {/* 3. Partner Logos Infinite Marquee (Last Section before Footer) */}
      <PartnerLogos />
    </div>
  );
}
