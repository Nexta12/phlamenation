"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/services/api";
import { Artist, Track, Video, TourEvent, GalleryItem } from "@/types";
import TrackCard from "@/components/shared/TrackCard";
import VideoCard from "@/components/shared/VideoCard";
import EventCard from "@/components/shared/EventCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import ArtistSocialLinks from "@/components/shared/ArtistSocialLinks";
import HomeSidebar from "@/components/home/HomeSidebar";
import {
  Share2,
  Radio,
  Video as VideoIcon,
  Music2,
  Calendar,
  Flame,
  ArrowLeft,
  User,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  ZoomIn,
  X,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";

interface ArtistDetailProps {
  params: Promise<{ slug: string }>;
}

type ArtistTab = "biography" | "audio" | "gallery" | "videos" | "events";

export default function ArtistDetailPage({ params }: ArtistDetailProps) {
  const { slug } = use(params);

  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab State (Default: Biography)
  const [activeTab, setActiveTab] = useState<ArtistTab>("biography");

  // Gallery Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { openRequestShowModal } = useUIStore();

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    api
      .get<Artist>(`/artists/${slug}`)
      .then((res) => {
        const found = res.data;
        setArtist(found);

        if (found?._id) {
          // Fetch associated collections in parallel
          Promise.all([
            api.get<Track[]>("/tracks", { artist: found._id, limit: 50 }),
            api.get<Video[]>("/videos", { artist: found._id, limit: 50 }),
            api.get<TourEvent[]>("/events", { artist: found._id, timeframe: "all", limit: 50 }),
            api.get<GalleryItem[]>("/gallery", { artist: found._id, limit: 50 }),
          ])
            .then(([tracksRes, videosRes, eventsRes, galleryRes]) => {
              setTracks(tracksRes.data || []);
              setVideos(videosRes.data || []);
              setEvents(eventsRes.data || []);
              setGalleries(galleryRes.data || []);
            })
            .catch((err) => console.error("Error loading artist relations:", err));
        }
      })
      .catch((err) => console.error("Error loading artist:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center text-[#9D9DAE]">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium">Loading artist dossier...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-[#F8F8FA] mb-4">Artist Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested artist profile does not exist or has been relocated.
        </p>
        <Link href="/artists">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roster
          </Button>
        </Link>
      </div>
    );
  }

  const artistName = artist.name || (artist as any).stageName || "Artist";
  const avatarUrl = artist.avatar?.secure_url || (artist as any).avatar?.url;
  const bannerUrl = artist.bannerImage?.secure_url || (artist as any).banner?.url;

  // Tab definitions (clean text-only tabs without icons or counts)
  const tabs: { id: ArtistTab; label: string }[] = [
    { id: "biography", label: "Biography" },
    { id: "audio", label: "Audio" },
    { id: "gallery", label: "Gallery" },
    { id: "videos", label: "Videos" },
    { id: "events", label: "Events" },
  ];

  // Extract all photos uploaded directly to the artist profile
  const artistUploadedPhotos: { url: string; caption: string }[] = [];

  if (Array.isArray(artist.photos) && artist.photos.length > 0) {
    artist.photos.forEach((p, idx) => {
      const pUrl = p?.secure_url || p?.url;
      if (pUrl && !artistUploadedPhotos.some((ap) => ap.url === pUrl)) {
        artistUploadedPhotos.push({
          url: pUrl,
          caption: `${artistName} — Photo Shoot #${idx + 1}`,
        });
      }
    });
  }

  if (avatarUrl && !artistUploadedPhotos.some((ap) => ap.url === avatarUrl)) {
    artistUploadedPhotos.push({
      url: avatarUrl,
      caption: `${artistName} — Official Portrait`,
    });
  }

  if (bannerUrl && !artistUploadedPhotos.some((ap) => ap.url === bannerUrl)) {
    artistUploadedPhotos.push({
      url: bannerUrl,
      caption: `${artistName} — Press & Stage Banner`,
    });
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Hero / Banner Section */}
      <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-end overflow-hidden border-b border-[#242430]">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={artistName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#121217] via-[#1A1A22] to-[#121217]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/75 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar thumbnail */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-[#121217] border-2 border-[#E5A93C] shadow-2xl shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={artistName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">
                  {artistName[0]}
                </div>
              )}
            </div>

            <div>
              <Link
                href="/artists"
                className="inline-flex items-center gap-1.5 text-xs text-[#9D9DAE] hover:text-[#E5A93C] mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Roster Overview</span>
              </Link>
              <h1 className="text-3xl md:text-5xl font-black text-[#F8F8FA] font-heading tracking-tight">
                {artistName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="gold" className="text-xs uppercase font-semibold">
                  {artist.genre || "Afrobeats / Global"}
                </Badge>
                {artist.status && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                    {artist.status}
                  </span>
                )}
                {artist.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/30">
                    Label Spotlight
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Socials & City Booking Request */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <ArtistSocialLinks
              socials={artist.socials}
              socialLinks={artist.socialLinks}
              size="md"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => openRequestShowModal(artist)}
              className="shrink-0 hover:border-primary"
            >
              <Flame className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <span>Request In My City</span>
            </Button>
          </div>
        </div>
      </section>

      {/* STICKY TAB NAVIGATION BAR */}
      <section className="sticky top-0 z-30 bg-[#08080A]/95 backdrop-blur-xl border-b border-[#242430]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all duration-300 relative font-curly tracking-wider ${
                    isActive
                      ? "text-primary font-medium drop-shadow-[0_0_8px_rgba(229,169,60,0.3)]"
                      : "text-[#9D9DAE] hover:text-[#F8F8FA] font-light"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full shadow-[0_0_6px_rgba(229,169,60,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAB CONTENT PANELS */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 w-full">
        {/* ========================================================= */}
        {/* TAB 1: BIOGRAPHY */}
        {/* ========================================================= */}
        {activeTab === "biography" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bio Editorial Text */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#121217] border border-[#242430] rounded-2xl p-6 md:p-8 shadow-xl">
                  

                  {artist.bio ? (
                    <div className="text-sm italic md:text-base text-[#D4D4DE] leading-relaxed space-y-4 whitespace-pre-line font-light">
                      {artist.bio}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Official biography is currently being curated by Phlame Nation Editorial.
                    </p>
                  )}
                </div>

                {/* Official Channels Banner */}
                {(artist.socials || artist.socialLinks) && (
                  <div className="bg-[#14141A] border border-[#242430] rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Official Social & Streaming Destinations
                    </h3>
                    <ArtistSocialLinks
                      socials={artist.socials}
                      socialLinks={artist.socialLinks}
                      variant="pill"
                      showLabel
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Official Updates Widget (Live Ticker, News & Newsletter) */}
              <div className="w-full">
                <HomeSidebar />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: AUDIO */}
        {/* ========================================================= */}
        {activeTab === "audio" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242430]">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Audio <span className="text-primary">Catalogue</span>
                </h2>
               
              </div>

              <span className="text-xs text-muted-foreground font-mono">
                {tracks.length} {tracks.length === 1 ? "Track" : "Tracks"}
              </span>
            </div>

            {tracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <TrackCard key={track._id} track={track} queue={tracks} />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-muted-foreground bg-surface border border-border rounded-2xl">
                <Music2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                <h3 className="text-base font-bold text-white">No Audio Releases Catalogued</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Audio tracks for {artistName} will be premiered here once published to the catalogue.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GALLERY */}
        {/* ========================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-300">
           

            {/* Section 1: Photos uploaded directly to the Artist profile */}
            {artistUploadedPhotos.length > 0 && (
              <div className="space-y-4">

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artistUploadedPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage(photo.url)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-black border border-border cursor-pointer transition-all hover:border-primary/50 shadow-md"
                    >
                      <img
                        src={photo.url}
                        alt="Gallery image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Associated Curated Gallery Albums */}
            {galleries.length > 0 && (
              <div className={`space-y-8 ${artistUploadedPhotos.length > 0 ? "pt-6 border-t border-[#242430]" : ""}`}>
                {galleries.map((gal) => (
                  <div key={gal._id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{gal.title}</h3>
                        {gal.description && (
                          <p className="text-xs text-muted-foreground">{gal.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {gal.category?.replace(/_/g, " ") || "Gallery Album"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gal.images && gal.images.length > 0 ? (
                        gal.images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(img.secure_url || img.url || "")}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-black border border-border cursor-pointer transition-all hover:border-primary/50 shadow-md"
                          >
                            <img
                              src={img.secure_url || img.url}
                              alt="Gallery image"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ))
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State if neither artist photos nor gallery albums exist */}
            {artistUploadedPhotos.length === 0 && galleries.length === 0 && (
              <div className="p-16 text-center text-muted-foreground bg-surface border border-border rounded-2xl">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                <h3 className="text-base font-bold text-white">No Photo Archives Found</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  High-resolution photo shoots and moments for {artistName} will be published here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VIDEOS */}
        {/* ========================================================= */}
        {activeTab === "videos" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242430]">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                   Videos
                </h2>
              
              </div>

              <span className="text-xs text-muted-foreground font-mono">
                {videos.length} {videos.length === 1 ? "Video" : "Videos"}
              </span>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-muted-foreground bg-surface border border-border rounded-2xl">
                <VideoIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                <h3 className="text-base font-bold text-white">No Video Releases Listed</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Music videos and visualizer premieres for {artistName} will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: EVENTS */}
        {/* ========================================================= */}
        {activeTab === "events" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242430]">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Tour & <span className="text-primary">Live Dates</span>
                </h2>
      
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => openRequestShowModal(artist)}
              >
                <Flame className="w-3.5 h-3.5 mr-1.5" />
                Request In My City
              </Button>
            </div>

            {events.length > 0 ? (
              <div className="flex flex-col gap-3">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-muted-foreground bg-surface border border-border rounded-2xl space-y-4">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/60" />
                <div>
                  <h3 className="text-base font-bold text-white">No Tour Dates Currently Announced</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Want {artistName} to perform in your city? Submit a city show request directly to our booking department.
                  </p>
                </div>
                <div>
                  <Button variant="primary" size="sm" onClick={() => openRequestShowModal(artist)}>
                    <Flame className="w-3.5 h-3.5 mr-1.5" />
                    Request In My City
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}


      </main>

      {/* GALLERY LIGHTBOX MODAL */}
      <Modal
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        title=""
        size="xl"
      >
        <div className="flex flex-col items-center">
          {lightboxImage && (
            <div className="relative max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={lightboxImage}
                alt="Gallery photo"
                className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
