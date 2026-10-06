import React from "react";
import Image from "next/image";
import { Track } from "@/types";
import TrackPlayButton from "@/components/player/TrackPlayButton";
import { Music, Download, Headphones } from "lucide-react";
import api from "@/services/api";

import TrackStreamingLinks from "./TrackStreamingLinks";

interface TrackCardProps {
  track: Track;
  queue?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, queue }) => {
  const artistName =
    typeof track.primaryArtist === "object"
      ? track.primaryArtist?.stageName || track.primaryArtist?.name
      : "Artist";

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post<{ downloadUrl: string; title: string }>(
        `/tracks/${track._id}/download`
      );
      if (res.data?.downloadUrl) {
        const link = document.createElement("a");
        link.href = res.data.downloadUrl;
        link.setAttribute("download", `${res.data.title || track.title}.mp3`);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hasAudioFile = Boolean(track.audioFile?.url || track.audioFile?.secure_url);

  return (
    <div className="group relative flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#121217] border border-[#242430] hover:border-[#E5A93C]/40 transition-all duration-200">
      <div className="flex items-center gap-3.5 overflow-hidden">
        {/* Artwork */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#16161D] shrink-0 border border-[#242430]">
          {track.coverArt?.url ? (
            <Image
              src={track.coverArt.url}
              alt={track.title}
              fill
              sizes="56px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#E5A93C]">
              <Music className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="truncate">
          <h4 className="text-sm font-bold text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors truncate">
            {track.title}
          </h4>
          <p className="text-xs text-[#9D9DAE] truncate">
            {artistName}
            {track.featuredArtistsText && (
              <span className="text-[#6B6B7B]"> ft. {track.featuredArtistsText}</span>
            )}
          </p>

          <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6B6B7B]">
            {track.genre && <span>{track.genre}</span>}
            {track.streamCount !== undefined && (
              <span className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                {track.streamCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {track.streamingPlatforms && (
          <TrackStreamingLinks platforms={track.streamingPlatforms} size="sm" />
        )}
        {track.isDownloadable !== false && hasAudioFile && (
          <button
            onClick={handleDownload}
            title="Download track"
            className="p-2 text-[#9D9DAE] hover:text-[#E5A93C] hover:bg-[#1A1A22] rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        {hasAudioFile ? (
          <TrackPlayButton track={track} queue={queue} size="md" />
        ) : (
          track.streamingPlatforms?.spotify ? (
            <a
              href={track.streamingPlatforms.spotify}
              target="_blank"
              rel="noopener noreferrer"
              title="Stream on Spotify"
              className="w-10 h-10 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/40 hover:bg-[#1DB954]/30 text-[#1DB954] transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          ) : (
            <TrackPlayButton track={track} queue={queue} size="md" />
          )
        )}
      </div>
    </div>
  );
};

export default TrackCard;
