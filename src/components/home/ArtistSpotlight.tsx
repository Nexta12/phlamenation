"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artist, Track } from "@/types";
import Button from "@/components/ui/Button";
import TrackPlayButton from "@/components/player/TrackPlayButton";
import ArtistSocialLinks from "@/components/shared/ArtistSocialLinks";
import {
  CheckCircle2,
  Disc3,
  Calendar,
  Radio,
  ArrowRight,
  User,
} from "lucide-react";

interface ArtistSpotlightProps {
  artist: Artist | null;
  featuredTracks?: Track[];
}

export const ArtistSpotlight: React.FC<ArtistSpotlightProps> = ({
  artist,
  featuredTracks = [],
}) => {
  if (!artist) {
    return (
      <div className="p-8 rounded-3xl bg-[#121217] border border-[#242430] text-center text-sm text-[#9D9DAE]">
        Artist profile will appear here once published.
      </div>
    );
  }

  const artistName = artist.stageName || artist.name;
  const avatarUrl = artist.avatar?.url || artist.avatar?.secure_url;
  const bannerUrl =
    artist.banner?.url ||
    artist.banner?.secure_url ||
    artist.bannerImage?.url ||
    avatarUrl;

  const socials = artist.socials || artist.socialLinks || {};
  const leadTrack = featuredTracks[0];

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-[#121217] border border-[#242430] p-6 sm:p-10">
      {/* Background Banner Backdrop */}
      {bannerUrl && (
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <Image
            src={bannerUrl}
            alt={artistName}
            fill
            className="object-cover blur-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Left: Artist Photo */}
        <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#242430] bg-[#16161D] shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={artistName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9D9DAE]">
              <User className="w-16 h-16 opacity-30" />
            </div>
          )}

          {/* Quick Play Lead Track Overlay */}
          {leadTrack && (
            <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-[#08080A]/90 border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#E5A93C] block truncate">
                  Latest Release
                </span>
                <span className="text-xs font-semibold text-[#F8F8FA] block truncate">
                  {leadTrack.title}
                </span>
              </div>
              <TrackPlayButton track={leadTrack} queue={featuredTracks} size="sm" />
            </div>
          )}
        </div>

        {/* Right: Artist Info & Links */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8F8FA] font-heading">
              {artistName}
            </h2>
            <CheckCircle2 className="w-5 h-5 text-[#E5A93C] shrink-0" />
          </div>

          {artist.name && artist.name !== artist.stageName && (
            <p className="text-xs sm:text-sm text-[#9D9DAE] mb-3">
              {artist.name}
            </p>
          )}

          {/* Genres */}
          {artist.genres && artist.genres.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-4">
              {artist.genres.map((g, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-[#1A1A22] text-[#9D9DAE] border border-[#242430]"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Real Biography from DB */}
          {artist.bio && (
            <p className="text-xs sm:text-sm text-[#9D9DAE] leading-relaxed max-w-xl mb-6 line-clamp-4">
              {artist.bio}
            </p>
          )}

          {/* Official Socials & Streaming Links */}
          <div className="mb-6">
            <ArtistSocialLinks
              socials={artist.socials}
              socialLinks={artist.socialLinks}
              size="md"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link href={`/artists/${artist.slug || artist._id}`}>
              <Button variant="primary" size="md">
                <span>View Full Profile</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/music">
              <Button variant="secondary" size="md">
                <span>Music Catalog</span>
              </Button>
            </Link>
            <Link href="/tours">
              <Button variant="outline" size="md">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Tour Passes</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistSpotlight;
