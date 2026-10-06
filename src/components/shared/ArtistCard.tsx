import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artist } from "@/types";
import { User, ArrowUpRight } from "lucide-react";

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const artistName = artist.stageName || artist.name || "Artist";
  const avatarUrl = artist.avatar?.url || artist.avatar?.secure_url;

  return (
    <Link
      href={`/artists/${artist.slug || artist._id}`}
      className="group relative block rounded-2xl overflow-hidden bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60"
    >
      <div className="relative aspect-square w-full bg-[#16161D] overflow-hidden">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={artistName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9D9DAE]">
            <User className="w-16 h-16 opacity-30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/20 to-transparent" />

        {/* Status Badge (Alumni / Legend only, no 'signed' or 'active' label) */}
        {artist.status && !["active", "signed"].includes(artist.status) && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[#9D9DAE]">
            {artist.status}
          </span>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors leading-tight">
            {artistName}
          </h3>
          <p className="text-xs text-[#9D9DAE] mt-0.5">
            {artist.genres?.join(" • ") || artist.genre || "Afro-Fusion"}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1A1A22] border border-[#242430] flex items-center justify-center text-[#9D9DAE] group-hover:text-[#E5A93C] group-hover:border-[#E5A93C]/50 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;
