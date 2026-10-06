"use client";

import { useEffect, useState } from "react";
import { videoService, artistService } from "@/services/api";
import { Video, Artist } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import {
  Plus,
  Video as VideoIcon,
  Trash2,
  ExternalLink,
  Play,
  Edit2,
} from "lucide-react";

function YouTubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// YouTube ID extractor helper
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Video State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createCoverFile, setCreateCoverFile] = useState<File | null>(null);
  const [createCoverPreview, setCreateCoverPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    youtubeUrl: "",
    category: "music_video",
    isFeatured: false,
  });

  // Edit Video State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string>("");
  const [editFormData, setEditFormData] = useState({
    title: "",
    artistId: "",
    youtubeUrl: "",
    category: "music_video",
    isFeatured: false,
  });

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { addToast, openVideoModal } = useUIStore();

  const loadData = async () => {
    try {
      setLoading(true);
      const [videosRes, artistsRes] = await Promise.all([
        videoService.getVideos({ limit: 50 }),
        artistService.getArtists(),
      ]);
      if (videosRes.data) setVideos(videosRes.data);
      if (artistsRes.data) setArtists(artistsRes.data);
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCreateCoverFile(file);
    if (file) {
      setCreateCoverPreview(URL.createObjectURL(file));
    } else {
      setCreateCoverPreview("");
    }
  };

  const handleEditCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditCoverFile(file);
    if (file) {
      setEditCoverPreview(URL.createObjectURL(file));
    } else {
      setEditCoverPreview("");
    }
  };

  // Create Video
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.artistId) {
      addToast({
        title: "Artist Required",
        message: "Please select which artist owns this video.",
        type: "error",
      });
      return;
    }

    const ytId = extractYouTubeId(formData.youtubeUrl);
    if (!ytId) {
      addToast({
        title: "Invalid YouTube URL",
        message: "Please enter a valid YouTube video link.",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("artist", formData.artistId);
      data.append("artists", JSON.stringify([formData.artistId]));
      data.append("youtubeUrl", formData.youtubeUrl.trim());
      data.append("category", formData.category);
      data.append("isFeatured", String(formData.isFeatured));

      if (createCoverFile) {
        data.append("coverPicture", createCoverFile);
        data.append("thumbnail", createCoverFile);
      }

      await videoService.createVideo(data);

      addToast({
        title: "Video Published",
        message: `${formData.title} has been added to the catalogue.`,
        type: "success",
      });

      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        artistId: "",
        youtubeUrl: "",
        category: "music_video",
        isFeatured: false,
      });
      setCreateCoverFile(null);
      setCreateCoverPreview("");
      loadData();
    } catch (err: any) {
      addToast({
        title: "Publication Failed",
        message: err.response?.data?.message || "Failed to publish video.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (video: Video) => {
    setEditingVideo(video);
    const artistId =
      video.artist?._id ||
      (Array.isArray(video.artists) && video.artists.length > 0
        ? typeof video.artists[0] === "object"
          ? (video.artists[0] as any)._id
          : video.artists[0]
        : "");

    setEditFormData({
      title: video.title || "",
      artistId: String(artistId || ""),
      youtubeUrl: video.youtubeUrl || "",
      category: video.category || "music_video",
      isFeatured: Boolean(video.isFeatured),
    });
    setEditCoverFile(null);
    setEditCoverPreview("");
    setIsEditModalOpen(true);
  };

  // Update Video
  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    if (!editFormData.artistId) {
      addToast({
        title: "Artist Required",
        message: "Please select which artist owns this video.",
        type: "error",
      });
      return;
    }

    const ytId = extractYouTubeId(editFormData.youtubeUrl);
    if (!ytId) {
      addToast({
        title: "Invalid YouTube URL",
        message: "Please enter a valid YouTube video link.",
        type: "error",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const data = new FormData();
      data.append("title", editFormData.title);
      data.append("artist", editFormData.artistId);
      data.append("artists", JSON.stringify([editFormData.artistId]));
      data.append("youtubeUrl", editFormData.youtubeUrl.trim());
      data.append("category", editFormData.category);
      data.append("isFeatured", String(editFormData.isFeatured));

      if (editCoverFile) {
        data.append("coverPicture", editCoverFile);
        data.append("thumbnail", editCoverFile);
      }

      await videoService.updateVideo(editingVideo._id, data);

      addToast({
        title: "Video Updated",
        message: `${editFormData.title} updated successfully.`,
        type: "success",
      });

      setIsEditModalOpen(false);
      setEditingVideo(null);
      loadData();
    } catch (err: any) {
      addToast({
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update video.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Video
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this video?")) return;
    try {
      setIsDeleting(id);
      await videoService.deleteVideo(id);
      addToast({ title: "Video Deleted", message: "Video removed from catalogue.", type: "success" });
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err: any) {
      addToast({ title: "Delete Failed", message: err.response?.data?.message || "Could not delete video.", type: "error" });
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
            Videos
          </h1>
       
        </div>

        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Video
        </Button>
      </div>

      {/* Videos List / Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Watch</th>
                  <th className="py-3.5 px-4">Video Title</th>
                  <th className="py-3.5 px-4">Artist / Owner</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Release Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {videos.map((vid) => {
                  const coverSrc =
                    vid.customThumbnail?.url ||
                    vid.thumbnailUrl ||
                    (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : "/images/placeholder.jpg");

                  const owner =
                    vid.artist?.name ||
                    (vid.artist as any)?.stageName ||
                    (Array.isArray(vid.artists) && vid.artists.length > 0 && typeof vid.artists[0] === "object"
                      ? (vid.artists[0] as any).name || (vid.artists[0] as any).stageName
                      : null);

                  return (
                    <tr key={vid._id} className="hover:bg-white/5 transition-colors">
                      {/* Play Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openVideoModal(vid)}
                          title="Play YouTube Video"
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border text-white hover:border-primary hover:text-primary transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>
                      </td>

                      {/* Video Title & Cover */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="relative w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-border group cursor-pointer"
                            onClick={() => openVideoModal(vid)}
                          >
                            <img
                              src={coverSrc}
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm line-clamp-1">{vid.title}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={vid.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-red-400 transition-colors"
                              >
                                <YouTubeIcon className="w-3 h-3 text-red-500" />
                                <span>YouTube</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                              {vid.isFeatured && (
                                <Badge variant="gold" className="text-[9px] px-1.5 py-0">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Artist / Owner */}
                      <td className="py-3 px-4">
                        {owner ? (
                          <span className="text-primary font-semibold text-xs">
                            {owner}
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-xs">Unassigned</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize text-[11px]">
                          {vid.category?.replace(/_/g, " ") || "Music Video"}
                        </Badge>
                      </td>

                      {/* Release Date */}
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        {vid.releaseDate ? new Date(vid.releaseDate).toLocaleDateString() : (vid.createdAt ? new Date(vid.createdAt).toLocaleDateString() : "—")}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEdit(vid)}
                            title="Edit video"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vid._id)}
                            disabled={isDeleting === vid._id}
                            title="Delete video"
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
            <VideoIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">No Visual Releases Found</h3>
            <p className="text-xs text-muted-foreground mt-1">Connect your first YouTube official music video or visualizer.</p>
          </div>
        )}
      </div>

      {/* CREATE VIDEO MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Video"
        size="md"
      >
        <form onSubmit={handleCreateVideo} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Calm Down (Official Music Video)"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            label="Artist / Video Owner"
            required
            value={formData.artistId}
            onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
            options={[
              { label: "Select Artist", value: "" },
              ...artists.map((a) => ({ label: a.name || a.stageName || "Artist", value: a._id })),
            ]}
          />

          <Input
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            required
            value={formData.youtubeUrl}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { label: "Official Music Video", value: "music_video" },
              { label: "Visualizer", value: "visualizer" },
              { label: "Official Lyric Video", value: "lyric_video" },
              { label: "Live Performance", value: "live_performance" },
              { label: "Behind The Scenes", value: "behind_the_scenes" },
              { label: "Interview", value: "interview" },
              { label: "Teaser", value: "teaser" },
            ]}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Cover Picture (.jpg, .png)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*, .jpg, .jpeg, .png, .webp"
                onChange={handleCreateCoverChange}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
              />
              {createCoverPreview && (
                <div className="w-12 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                  <img src={createCoverPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Optional: Leave empty to automatically use the official YouTube thumbnail.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2 accent-primary"
              />
              Featured Video
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Video"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT VIDEO MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Update Video: ${editingVideo?.title || ""}`}
        size="md"
      >
        <form onSubmit={handleUpdateVideo} className="space-y-4">
          <Input
            label="Title"
            required
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          />

          <Select
            label="Artist / Video Owner"
            required
            value={editFormData.artistId}
            onChange={(e) => setEditFormData({ ...editFormData, artistId: e.target.value })}
            options={[
              { label: "Select Artist", value: "" },
              ...artists.map((a) => ({ label: a.name || a.stageName || "Artist", value: a._id })),
            ]}
          />

          <Input
            label="YouTube URL"
            required
            value={editFormData.youtubeUrl}
            onChange={(e) => setEditFormData({ ...editFormData, youtubeUrl: e.target.value })}
          />

          <Select
            label="Category"
            value={editFormData.category}
            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            options={[
              { label: "Official Music Video", value: "music_video" },
              { label: "Visualizer", value: "visualizer" },
              { label: "Official Lyric Video", value: "lyric_video" },
              { label: "Live Performance", value: "live_performance" },
              { label: "Behind The Scenes", value: "behind_the_scenes" },
              { label: "Interview", value: "interview" },
              { label: "Teaser", value: "teaser" },
            ]}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Cover Picture (.jpg, .png)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                <img
                  src={
                    editCoverPreview ||
                    editingVideo?.customThumbnail?.url ||
                    editingVideo?.thumbnailUrl ||
                    (editingVideo?.youtubeId ? `https://img.youtube.com/vi/${editingVideo.youtubeId}/hqdefault.jpg` : "/images/placeholder.jpg")
                  }
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*, .jpg, .jpeg, .png, .webp"
                  onChange={handleEditCoverChange}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Select a new image file to replace cover, or leave untouched to keep current.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={editFormData.isFeatured}
                onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                className="mr-2 accent-primary"
              />
              Featured Video
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
