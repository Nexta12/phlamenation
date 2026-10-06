"use client";

import { useEffect, useState, useRef } from "react";
import { trackService, artistService } from "@/services/api";
import { Track, Artist } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Music2,
  Download,
  TrendingUp,
  Clock,
  Upload,
  FileAudio,
  CheckCircle,
  Radio,
  Link as LinkIcon,
  Globe,
  Edit2,
} from "lucide-react";
import TrackStreamingLinks from "@/components/shared/TrackStreamingLinks";

export default function AdminTracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [audioSourceType, setAudioSourceType] = useState<"file" | "url">("file");

  // Edit Track State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editAudioSourceType, setEditAudioSourceType] = useState<"keep" | "file" | "url">("keep");
  const [editAudioFile, setEditAudioFile] = useState<File | null>(null);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    artistId: "",
    genre: "Afrobeats",
    releaseDate: new Date().toISOString().split("T")[0],
    lyrics: "",
    isSingle: true,
    isDownloadable: true,
    audioUrl: "",
    spotifyUrl: "",
    appleMusicUrl: "",
    audiomackUrl: "",
    boomplayUrl: "",
    youtubeMusicUrl: "",
  });

  const { addToast } = useUIStore();

  // Headless audio preview engine for Admin (plays audio without mounting FloatingPlayer)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handleTogglePreview = (track: Track) => {
    const audioUrl = track.audioFile?.url || track.audioFile?.secure_url;
    if (!audioUrl) {
      addToast({
        title: "No Direct Audio File",
        message: "This track only has streaming links. Direct preview is available for hosted audio files.",
        type: "info",
      });
      return;
    }

    if (playingTrackId === track._id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => {
            setPlayingTrackId(track._id);
          })
          .catch((err) => {
            console.error("Admin audio preview error:", err);
            addToast({
              title: "Playback Failed",
              message: "Browser blocked or could not stream this audio file.",
              type: "error",
            });
            setPlayingTrackId(null);
          });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    releaseDate: new Date().toISOString().split("T")[0],
    genre: "Afrobeats",
    lyrics: "",
    isSingle: true,
    isDownloadable: true,
    audioUrl: "",
    spotifyUrl: "",
    appleMusicUrl: "",
    audiomackUrl: "",
    boomplayUrl: "",
    youtubeMusicUrl: "",
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tracksRes, artistsRes] = await Promise.all([
        trackService.getTracks(),
        artistService.getArtists(),
      ]);
      if (tracksRes.data) setTracks(tracksRes.data);
      if (artistsRes.data) setArtists(artistsRes.data);
    } catch (err) {
      console.error("Failed to load tracks data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.artistId) {
      addToast({ title: "Validation Error", message: "Please select an artist.", type: "error" });
      return;
    }

    const hasAudioUpload = audioSourceType === "file" && Boolean(audioFile);
    const hasAudioUrl = audioSourceType === "url" && Boolean(formData.audioUrl.trim());
    const hasStreamingLink = Boolean(
      formData.spotifyUrl.trim() ||
      formData.appleMusicUrl.trim() ||
      formData.audiomackUrl.trim() ||
      formData.boomplayUrl.trim() ||
      formData.youtubeMusicUrl.trim()
    );

    if (!hasAudioUpload && !hasAudioUrl && !hasStreamingLink) {
      addToast({
        title: "Audio Asset or Link Required",
        message: "Please upload an audio file, provide a direct audio URL, or enter at least one streaming platform link.",
        type: "error",
      });
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("primaryArtist", formData.artistId);
      data.append("artist", formData.artistId);
      data.append("releaseDate", formData.releaseDate);
      data.append("genre", formData.genre);
      data.append("lyrics", formData.lyrics);
      data.append("isSingle", String(formData.isSingle));
      data.append("isDownloadable", String(formData.isDownloadable));

      if (hasAudioUpload && audioFile) {
        data.append("audio", audioFile);
        data.append("audioFile", audioFile);
      } else if (hasAudioUrl) {
        data.append("audioUrl", formData.audioUrl.trim());
      }

      if (coverFile) {
        data.append("coverArt", coverFile);
      }

      if (formData.spotifyUrl.trim()) data.append("spotifyUrl", formData.spotifyUrl.trim());
      if (formData.appleMusicUrl.trim()) data.append("appleMusicUrl", formData.appleMusicUrl.trim());
      if (formData.audiomackUrl.trim()) data.append("audiomackUrl", formData.audiomackUrl.trim());
      if (formData.boomplayUrl.trim()) data.append("boomplayUrl", formData.boomplayUrl.trim());
      if (formData.youtubeMusicUrl.trim()) data.append("youtubeMusicUrl", formData.youtubeMusicUrl.trim());

      await trackService.createTrack(data);
      addToast({
        title: "Track Published",
        message: `${formData.title} has been added to the master catalogue.`,
        type: "success",
      });
      setIsModalOpen(false);
      setFormData({
        title: "",
        artistId: "",
        releaseDate: new Date().toISOString().split("T")[0],
        genre: "Afrobeats",
        lyrics: "",
        isSingle: true,
        isDownloadable: true,
        audioUrl: "",
        spotifyUrl: "",
        appleMusicUrl: "",
        audiomackUrl: "",
        boomplayUrl: "",
        youtubeMusicUrl: "",
      });
      setAudioFile(null);
      setCoverFile(null);
      loadData();
    } catch (err: any) {
      addToast({
        title: "Upload Failed",
        message: err.response?.data?.message || "Failed to upload track assets.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenEdit = (track: Track) => {
    setEditingTrack(track);
    const artistId =
      typeof track.primaryArtist === "object"
        ? track.primaryArtist?._id
        : track.primaryArtist || (track.artist?._id || track.artist || "");

    setEditFormData({
      title: track.title || "",
      artistId: String(artistId || ""),
      genre: track.genre || "Afrobeats",
      releaseDate: track.releaseDate
        ? new Date(track.releaseDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      lyrics: track.lyrics || "",
      isSingle: track.isSingle !== false,
      isDownloadable: track.isDownloadable !== false,
      audioUrl: track.audioFile?.url || "",
      spotifyUrl: track.streamingPlatforms?.spotify || "",
      appleMusicUrl: track.streamingPlatforms?.appleMusic || "",
      audiomackUrl: track.streamingPlatforms?.audiomack || "",
      boomplayUrl: track.streamingPlatforms?.boomplay || "",
      youtubeMusicUrl: track.streamingPlatforms?.youtubeMusic || "",
    });
    setEditAudioSourceType("keep");
    setEditAudioFile(null);
    setEditCoverFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    if (!editFormData.artistId) {
      addToast({ title: "Validation Error", message: "Please select an artist.", type: "error" });
      return;
    }

    try {
      setIsUpdating(true);
      const data = new FormData();
      data.append("title", editFormData.title);
      data.append("primaryArtist", editFormData.artistId);
      data.append("artist", editFormData.artistId);
      data.append("releaseDate", editFormData.releaseDate);
      data.append("genre", editFormData.genre);
      data.append("lyrics", editFormData.lyrics);
      data.append("isSingle", String(editFormData.isSingle));
      data.append("isDownloadable", String(editFormData.isDownloadable));

      if (editAudioSourceType === "file" && editAudioFile) {
        data.append("audio", editAudioFile);
        data.append("audioFile", editAudioFile);
      } else if (editAudioSourceType === "url" && editFormData.audioUrl.trim()) {
        data.append("audioUrl", editFormData.audioUrl.trim());
      }

      if (editCoverFile) {
        data.append("coverArt", editCoverFile);
      }

      data.append("spotifyUrl", editFormData.spotifyUrl.trim());
      data.append("appleMusicUrl", editFormData.appleMusicUrl.trim());
      data.append("audiomackUrl", editFormData.audiomackUrl.trim());
      data.append("boomplayUrl", editFormData.boomplayUrl.trim());
      data.append("youtubeMusicUrl", editFormData.youtubeMusicUrl.trim());

      await trackService.updateTrack(editingTrack._id, data);
      addToast({
        title: "Track Updated",
        message: `${editFormData.title} has been updated successfully.`,
        type: "success",
      });
      setIsEditModalOpen(false);
      setEditingTrack(null);
      loadData();
    } catch (err: any) {
      addToast({
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update track.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this track from the catalogue?")) return;
    try {
      setIsDeleting(id);
      await trackService.deleteTrack(id);
      addToast({ title: "Track Deleted", message: "Master recording removed from catalogue.", type: "success" });
      setTracks(tracks.filter((t) => t._id !== id));
    } catch (err: any) {
      addToast({ title: "Delete Failed", message: err.response?.data?.message || "Cannot delete track.", type: "error" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Audio <span className="text-primary">Catalogue</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage audio releases, streaming counts etc
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Track
        </Button>
      </div>

      {/* Tracks Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Play</th>
                  <th className="py-3.5 px-4">Track & Artist</th>
                  <th className="py-3.5 px-4">Genre</th>
                  <th className="py-3.5 px-4">Audio / Streams</th>
                  <th className="py-3.5 px-4">Streams</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4">Release Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {tracks.map((track) => {
                  const isCurrent = playingTrackId === track._id;
                  const hasDirectAudio = Boolean(track.audioFile?.url || track.audioFile?.secure_url);
                  return (
                    <tr
                      key={track._id}
                      className={`hover:bg-white/5 transition-colors ${isCurrent ? "bg-primary/5" : ""}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleTogglePreview(track)}
                          disabled={!hasDirectAudio}
                          title={
                            !hasDirectAudio
                              ? "No direct audio file available"
                              : isCurrent
                              ? "Pause preview"
                              : "Play preview"
                          }
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            !hasDirectAudio
                              ? "opacity-30 cursor-not-allowed bg-surface border border-border text-muted-foreground"
                              : isCurrent
                              ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                              : "bg-surface border border-border text-white hover:border-primary hover:text-primary"
                          }`}
                        >
                          {isCurrent ? (
                            <Pause className="w-3.5 h-3.5 fill-black" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={track.coverArt?.secure_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"}
                            alt={track.title}
                            className="w-10 h-10 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{track.title}</span>
                            <span className="text-primary text-[11px]">
                              {track.artist?.name || (typeof track.primaryArtist === "object" ? track.primaryArtist?.name : "Phlame Artist")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        <Badge variant="outline">{track.genre || "Afrobeats"}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            {hasDirectAudio ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <FileAudio className="w-3 h-3" /> Hosted
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                <Globe className="w-3 h-3" /> External
                              </span>
                            )}
                          </div>
                          {track.streamingPlatforms && (
                            <TrackStreamingLinks platforms={track.streamingPlatforms} size="xs" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-200">
                        <span className="flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                          {track.streamCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-200">
                        <span className="flex items-center">
                          <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                          {track.downloadCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        {new Date(track.releaseDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEdit(track)}
                            title="Edit release details"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(track._id)}
                            disabled={isDeleting === track._id}
                            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground">
            <Music2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">No Tracks in Catalogue</h3>
            <p className="text-xs text-muted-foreground mt-1">Upload the label's first master recording asset.</p>
          </div>
        )}
      </div>

      {/* Upload Track Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Track"
        size="lg"
      >
        <form onSubmit={handleCreateTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              placeholder=""
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Select
              label="Artist"
              required
              value={formData.artistId}
              onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
              options={[
                { label: "Select Artist", value: "" },
                ...artists.map((a) => ({ label: a.name, value: a._id })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Genre"
              placeholder=""
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
            <Input
              label="Release Date"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            />
          </div>

          {/* Audio Source Options */}
          <div className="p-3.5 rounded-xl bg-[#14141A] border border-[#242430] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white block">
                  Audio Asset
                </label>
              </div>
              <div className="flex items-center gap-1 bg-[#1A1A22] p-1 rounded-lg border border-[#242430]">
                <button
                  type="button"
                  onClick={() => setAudioSourceType("file")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    audioSourceType === "file"
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSourceType("url")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    audioSourceType === "url"
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {audioSourceType === "file" ? (
              <div>
                <input
                  type="file"
                  accept="audio/*, .mp3, .wav, .m4a, .aac, .ogg, .flac, .wma, .aiff, .mpeg, .mpg, audio/mp3, audio/mpeg"
                  onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark cursor-pointer bg-background border border-border rounded-xl p-2"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Upload MP3, WAV, AAC, M4A, or FLAC
                </p>
              </div>
            ) : (
              <div>
                <Input
                  placeholder="https://your-bucket.com/audio/track.mp3"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Paste Link
                </p>
              </div>
            )}
          </div>

          {/* Cover Artwork */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Cover Picture (.jpg, .png)
            </label>
            <input
              type="file"
              accept="image/*, .jpg, .jpeg, .png, .webp, .avif"
              onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
            />
          </div>

          {/* Streaming Platform URLs (Smart Links) */}
          <div className="p-3.5 rounded-xl bg-[#14141A] border border-[#242430] space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white block">
                Streaming Platform Links (Smart Links)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Optional: direct fans to official streaming apps for royalties and chart placements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Spotify URL"
                placeholder="https://open.spotify.com/track/..."
                value={formData.spotifyUrl}
                onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
              />
              <Input
                label="Apple Music URL"
                placeholder="https://music.apple.com/album/..."
                value={formData.appleMusicUrl}
                onChange={(e) => setFormData({ ...formData, appleMusicUrl: e.target.value })}
              />
              <Input
                label="Audiomack URL"
                placeholder="https://audiomack.com/song/..."
                value={formData.audiomackUrl}
                onChange={(e) => setFormData({ ...formData, audiomackUrl: e.target.value })}
              />
              <Input
                label="Boomplay URL"
                placeholder="https://www.boomplay.com/songs/..."
                value={formData.boomplayUrl}
                onChange={(e) => setFormData({ ...formData, boomplayUrl: e.target.value })}
              />
            </div>
            <Input
              label="YouTube Music / Visualizer URL"
              placeholder="https://music.youtube.com/watch?v=..."
              value={formData.youtubeMusicUrl}
              onChange={(e) => setFormData({ ...formData, youtubeMusicUrl: e.target.value })}
            />
          </div>

          <div className="flex flex-col space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lyrics (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste song lyrics here..."
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDownloadable}
                  onChange={(e) => setFormData({ ...formData, isDownloadable: e.target.checked })}
                  className="mr-2 accent-primary"
                />
                Allow Fan MP3 Downloads
              </label>
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? "Ingesting & Uploading..." : "Publish Release Asset"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Track Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update Track: ${editingTrack?.title || ""}`}
        size="lg"
      >
        <form onSubmit={handleUpdateTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              required
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            />
            <Select
              label="Artist"
              required
              value={editFormData.artistId}
              onChange={(e) => setEditFormData({ ...editFormData, artistId: e.target.value })}
              options={[
                { label: "Select Artist", value: "" },
                ...artists.map((a) => ({ label: a.name, value: a._id })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Genre"
              value={editFormData.genre}
              onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
            />
            <Input
              label="Release Date"
              type="date"
              value={editFormData.releaseDate}
              onChange={(e) => setEditFormData({ ...editFormData, releaseDate: e.target.value })}
            />
          </div>

          {/* Audio Asset in Edit */}
          <div className="p-3.5 rounded-xl bg-[#14141A] border border-[#242430] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white block">
                  Audio Asset
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">Current status:</span>
                  {editingTrack?.audioFile?.url ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <FileAudio className="w-3 h-3" /> Audio File Hosted
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">External / Streaming Links Only</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#1A1A22] p-1 rounded-lg border border-[#242430]">
                <button
                  type="button"
                  onClick={() => setEditAudioSourceType("keep")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    editAudioSourceType === "keep"
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Keep Current
                </button>
                <button
                  type="button"
                  onClick={() => setEditAudioSourceType("file")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    editAudioSourceType === "file"
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Upload New
                </button>
                <button
                  type="button"
                  onClick={() => setEditAudioSourceType("url")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    editAudioSourceType === "url"
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Set URL
                </button>
              </div>
            </div>

            {editAudioSourceType === "file" && (
              <div>
                <input
                  type="file"
                  accept="audio/*, .mp3, .wav, .m4a, .aac, .ogg, .flac, .wma, .aiff, .mpeg, .mpg, audio/mp3, audio/mpeg"
                  onChange={(e) => setEditAudioFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark cursor-pointer bg-background border border-border rounded-xl p-2"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Select new master audio file to replace current recording.
                </p>
              </div>
            )}

            {editAudioSourceType === "url" && (
              <div>
                <Input
                  placeholder="https://your-bucket.com/audio/track.mp3"
                  value={editFormData.audioUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, audioUrl: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  External audio stream link.
                </p>
              </div>
            )}
          </div>

          {/* Cover Artwork in Edit */}
          <div className="p-3.5 rounded-xl bg-[#14141A] border border-[#242430] space-y-2">
            <div className="flex items-center gap-3">
              {editingTrack?.coverArt?.url && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                  <img
                    src={editingTrack.coverArt.url}
                    alt={editingTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-white block mb-1">
                  Cover Picture (.jpg, .png)
                </label>
                <input
                  type="file"
                  accept="image/*, .jpg, .jpeg, .png, .webp, .avif"
                  onChange={(e) => setEditCoverFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
                />
              </div>
            </div>
          </div>

          {/* Streaming Platform URLs (Smart Links) in Edit */}
          <div className="p-3.5 rounded-xl bg-[#14141A] border border-[#242430] space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white block">
                Streaming Platform Links (Smart Links)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Links to official streaming apps for fan discovery and royalties.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Spotify URL"
                placeholder="https://open.spotify.com/track/..."
                value={editFormData.spotifyUrl}
                onChange={(e) => setEditFormData({ ...editFormData, spotifyUrl: e.target.value })}
              />
              <Input
                label="Apple Music URL"
                placeholder="https://music.apple.com/album/..."
                value={editFormData.appleMusicUrl}
                onChange={(e) => setEditFormData({ ...editFormData, appleMusicUrl: e.target.value })}
              />
              <Input
                label="Audiomack URL"
                placeholder="https://audiomack.com/song/..."
                value={editFormData.audiomackUrl}
                onChange={(e) => setEditFormData({ ...editFormData, audiomackUrl: e.target.value })}
              />
              <Input
                label="Boomplay URL"
                placeholder="https://www.boomplay.com/songs/..."
                value={editFormData.boomplayUrl}
                onChange={(e) => setEditFormData({ ...editFormData, boomplayUrl: e.target.value })}
              />
            </div>
            <Input
              label="YouTube Music / Visualizer URL"
              placeholder="https://music.youtube.com/watch?v=..."
              value={editFormData.youtubeMusicUrl}
              onChange={(e) => setEditFormData({ ...editFormData, youtubeMusicUrl: e.target.value })}
            />
          </div>

          <div className="flex flex-col space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lyrics (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste song lyrics here..."
              value={editFormData.lyrics}
              onChange={(e) => setEditFormData({ ...editFormData, lyrics: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editFormData.isDownloadable}
                  onChange={(e) => setEditFormData({ ...editFormData, isDownloadable: e.target.checked })}
                  className="mr-2 accent-primary"
                />
                Allow Fan MP3 Downloads
              </label>
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Headless audio element for silent admin preview without floating player */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingTrackId(null)}
        onError={() => setPlayingTrackId(null)}
        className="hidden"
      />
    </div>
  );
}
