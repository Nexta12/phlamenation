"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { artistService } from "@/services/api";
import { Artist } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import ArtistSocialLinks from "@/components/shared/ArtistSocialLinks";
import {
  Plus,
  Users,
  Trash2,
  Edit2,
  ExternalLink,
  Music,
  Camera,
  Upload,
  X,
  Loader2,
  User,
  Globe,
  Image as ImageIcon,
  Check,
  RotateCcw,
} from "lucide-react";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Edit Artist Full Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<"profile" | "socials" | "media">("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingPhotoIndex, setDeletingPhotoIndex] = useState<number | null>(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    stageName: "",
    bio: "",
    genre: "Afrobeats",
    status: "active",
    isFeatured: false,
    instagram: "",
    twitter: "",
    spotify: "",
    appleMusic: "",
    youtube: "",
    tiktok: "",
  });

  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [editNewPhotos, setEditNewPhotos] = useState<File[]>([]);
  const [isUploadingMorePhotos, setIsUploadingMorePhotos] = useState(false);

  const { addToast } = useUIStore();

  // Create Modal state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    genre: "Afrobeats",
    status: "active",
    isFeatured: false,
    instagram: "",
    twitter: "",
    spotify: "",
    appleMusic: "",
    youtube: "",
    tiktok: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [photosFiles, setPhotosFiles] = useState<File[]>([]);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const res = await artistService.getArtists();
      if (res.data) setArtists(res.data);
    } catch (err) {
      console.error("Failed to load artists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("stageName", formData.name);
      data.append("bio", formData.bio);
      data.append("genre", formData.genre);
      data.append("genres", JSON.stringify([formData.genre]));
      data.append("status", formData.status);
      data.append("isFeatured", String(formData.isFeatured));

      const socialsObj = {
        instagram: formData.instagram,
        twitter: formData.twitter,
        spotify: formData.spotify,
        appleMusic: formData.appleMusic,
        youtube: formData.youtube,
        tiktok: formData.tiktok,
      };

      data.append("socials", JSON.stringify(socialsObj));
      data.append("socialLinks", JSON.stringify(socialsObj));

      if (avatarFile) data.append("avatar", avatarFile);
      if (bannerFile) data.append("banner", bannerFile);
      if (photosFiles.length > 0) {
        photosFiles.forEach((file) => {
          data.append("photos", file);
        });
      }

      await artistService.createArtist(data);
      addToast({
        title: "Artist Onboarded",
        message: `${formData.name} is now officially registered on the label roster with ${photosFiles.length} photos.`,
        type: "success",
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        bio: "",
        genre: "Afrobeats",
        status: "active",
        isFeatured: false,
        instagram: "",
        twitter: "",
        spotify: "",
        appleMusic: "",
        youtube: "",
        tiktok: "",
      });
      setAvatarFile(null);
      setBannerFile(null);
      setPhotosFiles([]);
      loadArtists();
    } catch (err: any) {
      addToast({
        title: "Registration Failed",
        message: err.response?.data?.message || "Failed to onboard artist.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (artist: Artist, initialTab: "profile" | "socials" | "media" = "profile") => {
    setEditingArtist(artist);
    setActiveEditTab(initialTab);

    const socials = artist.socials || artist.socialLinks || {};

    setEditFormData({
      name: artist.name || "",
      stageName: artist.stageName || artist.name || "",
      bio: artist.bio || "",
      genre: artist.genre || (artist.genres && artist.genres[0]) || "Afrobeats",
      status: (artist.status as string) || "active",
      isFeatured: Boolean(artist.isFeatured),
      instagram: socials.instagram || "",
      twitter: socials.twitter || "",
      spotify: socials.spotify || "",
      appleMusic: socials.appleMusic || "",
      youtube: socials.youtube || "",
      tiktok: socials.tiktok || "",
    });

    setEditAvatarFile(null);
    setAvatarPreview(null);
    setEditBannerFile(null);
    setBannerPreview(null);
    setEditNewPhotos([]);
    setIsEditModalOpen(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditBannerFile(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(null);
    }
  };

  const handleUpdateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtist) return;

    try {
      setIsUpdating(true);
      const data = new FormData();
      data.append("name", editFormData.name.trim() || editFormData.stageName.trim());
      data.append("stageName", editFormData.stageName.trim());
      data.append("bio", editFormData.bio);
      data.append("genre", editFormData.genre);
      data.append("genres", JSON.stringify([editFormData.genre]));
      data.append("status", editFormData.status);
      data.append("isFeatured", String(editFormData.isFeatured));

      const socialsObj = {
        instagram: editFormData.instagram.trim(),
        twitter: editFormData.twitter.trim(),
        spotify: editFormData.spotify.trim(),
        appleMusic: editFormData.appleMusic.trim(),
        youtube: editFormData.youtube.trim(),
        tiktok: editFormData.tiktok.trim(),
      };
      data.append("socials", JSON.stringify(socialsObj));
      data.append("socialLinks", JSON.stringify(socialsObj));

      if (editAvatarFile) {
        data.append("avatar", editAvatarFile);
      }
      if (editBannerFile) {
        data.append("banner", editBannerFile);
      }
      if (editNewPhotos.length > 0) {
        editNewPhotos.forEach((file) => {
          data.append("photos", file);
        });
      }

      const res = await artistService.updateArtist(editingArtist._id, data);
      const updatedArtist = res.data;

      if (updatedArtist) {
        setArtists((prev) => prev.map((a) => (a._id === updatedArtist._id ? updatedArtist : a)));
      } else {
        await loadArtists();
      }

      addToast({
        title: "Profile Updated",
        message: `${editFormData.stageName || editFormData.name}'s profile has been updated successfully.`,
        type: "success",
      });

      setIsEditModalOpen(false);
      setEditingArtist(null);
      setEditAvatarFile(null);
      setAvatarPreview(null);
      setEditBannerFile(null);
      setBannerPreview(null);
      setEditNewPhotos([]);
    } catch (err: any) {
      addToast({
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update artist profile.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePhoto = async (indexToDelete: number) => {
    if (!editingArtist) return;
    try {
      setDeletingPhotoIndex(indexToDelete);
      const updatedPhotos = (editingArtist.photos || []).filter((_, idx) => idx !== indexToDelete);
      const data = new FormData();
      data.append("stageName", editingArtist.stageName || editingArtist.name);
      data.append("photos", JSON.stringify(updatedPhotos));

      const res = await artistService.updateArtist(editingArtist._id, data);
      const updatedArtist = res.data || { ...editingArtist, photos: updatedPhotos };

      setEditingArtist(updatedArtist);
      setArtists((prev) => prev.map((a) => (a._id === updatedArtist._id ? updatedArtist : a)));
      addToast({ title: "Photo Removed", message: "Artist photo removed successfully.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete photo.", type: "error" });
    } finally {
      setDeletingPhotoIndex(null);
    }
  };

  const handleUploadPhotosImmediately = async () => {
    if (!editingArtist || editNewPhotos.length === 0) return;
    try {
      setIsUploadingMorePhotos(true);
      const data = new FormData();
      data.append("stageName", editingArtist.stageName || editingArtist.name);
      editNewPhotos.forEach((file) => {
        data.append("photos", file);
      });

      const res = await artistService.updateArtist(editingArtist._id, data);
      const updatedArtist = res.data;
      if (updatedArtist) {
        setEditingArtist(updatedArtist);
        setArtists((prev) => prev.map((a) => (a._id === updatedArtist._id ? updatedArtist : a)));
      } else {
        await loadArtists();
      }
      setEditNewPhotos([]);
      addToast({ title: "Photos Uploaded", message: "New photo(s) added to gallery successfully.", type: "success" });
    } catch (err: any) {
      addToast({ title: "Upload Failed", message: err.response?.data?.message || "Could not upload new photos.", type: "error" });
    } finally {
      setIsUploadingMorePhotos(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this artist? All connected tracks, videos, galleries, events, and photos will also be permanently deleted."
      )
    )
      return;
    try {
      setIsDeleting(id);
      await artistService.deleteArtist(id);
      addToast({
        title: "Artist Deleted",
        message: "Artist and all connected records removed successfully.",
        type: "success",
      });
      setArtists(artists.filter((a) => a._id !== id));
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete artist.", type: "error" });
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
            Exclusive Artist <span className="text-primary">Roster</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage recording artists, official biographies, social channels, and promotional media.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Artist
        </Button>
      </div>

      {/* Artists Roster Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => {
            const bannerUrl =
              artist.banner?.secure_url ||
              artist.banner?.url ||
              artist.bannerImage?.secure_url ||
              artist.bannerImage?.url ||
              artist.photos?.[1]?.secure_url ||
              artist.photos?.[1]?.url;

            const avatarUrl =
              artist.avatar?.secure_url ||
              artist.avatar?.url ||
              artist.photos?.[0]?.secure_url ||
              artist.photos?.[0]?.url ||
              "/images/img4.jpeg";

            return (
              <div
                key={artist._id}
                className="bg-surface border border-border hover:border-primary/50 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full bg-black">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-black" />
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {artist.isFeatured && (
                        <Badge variant="gold" className="text-[10px]">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={artist.status === "active" ? "gold" : "outline"}
                        className="uppercase text-[10px]"
                      >
                        {artist.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 relative">
                    <div className="-mt-12 mb-3">
                      <img
                        src={avatarUrl}
                        alt={artist.name}
                        className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-surface shadow-xl bg-black"
                      />
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {artist.stageName || artist.name}
                    </h3>
                    <p className="text-xs text-primary font-medium">
                      {artist.genre || (artist.genres && artist.genres[0]) || "Afrobeats"}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                      {artist.bio || "No official biography specified."}
                    </p>

                    {/* Socials & Streaming Links */}
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          Social & Streaming
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditModal(artist, "socials")}
                          className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                        >
                          Manage Links
                        </button>
                      </div>
                      {artist.socials && Object.values(artist.socials).some((val) => Boolean(val && val.trim())) ? (
                        <ArtistSocialLinks
                          socials={artist.socials}
                          socialLinks={artist.socialLinks}
                          size="xs"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => openEditModal(artist, "socials")}
                          className="text-[11px] text-muted-foreground hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-primary" />
                          <span>Add social profiles</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/artists/${artist.slug}`}
                    target="_blank"
                    className="text-xs text-muted-foreground hover:text-white flex items-center transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    View Bio
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(artist, "profile")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white hover:bg-white/10 hover:text-primary border border-border transition-all cursor-pointer"
                      title="Edit Full Profile & Media"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => openEditModal(artist, "media")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 transition-all cursor-pointer"
                      title="Manage Photos & Media"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Photos ({artist.photos?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => handleDelete(artist._id)}
                      disabled={isDeleting === artist._id}
                      className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Artist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center text-muted-foreground bg-surface border border-border rounded-2xl">
          <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
          <h3 className="text-base font-bold text-white">No Signed Artists Yet</h3>
          <p className="text-xs text-muted-foreground mt-1">Begin building the Phlame Nation roster.</p>
        </div>
      )}

      {/* Onboard Artist Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Onboard New Recording Artist"
        size="lg"
      >
        <form onSubmit={handleCreateArtist} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Artist Stage Name *"
              placeholder="e.g. Phlame, Rema, Fireboy"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Genre / Sonic Style"
              placeholder="Afrobeats, Afro-Rave, Soul"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Roster Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { label: "Active (Current Roster)", value: "active" },
                { label: "Signed (Under Development)", value: "signed" },
                { label: "Alumni (Legacy)", value: "alumni" },
              ]}
            />
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-[#242430] bg-[#121217] accent-primary cursor-pointer"
                />
                <span>Feature Artist on Spotlight Carousel</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                Headshot / Avatar *
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark cursor-pointer bg-background border border-border rounded-xl p-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                Hero Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Upload Artist Images (Multiple Upload)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotosFiles(Array.from(e.target.files || []))}
              className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
            />
            {photosFiles.length > 0 && (
              <p className="text-[11px] text-primary mt-1 font-medium">
                {photosFiles.length} photo{photosFiles.length > 1 ? "s" : ""} selected for processing
              </p>
            )}
          </div>

          <Textarea
            label="Official Biography"
            rows={4}
            placeholder="Detail artist origins, breakout singles, discography milestones..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Social & Streaming Profiles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Instagram Handle"
                placeholder="https://instagram.com/username"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
              <Input
                label="Twitter / X Handle"
                placeholder="https://x.com/username"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
              <Input
                label="Spotify URL"
                placeholder="https://open.spotify.com/artist/..."
                value={formData.spotify}
                onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
              />
              <Input
                label="Apple Music URL"
                placeholder="https://music.apple.com/artist/..."
                value={formData.appleMusic}
                onChange={(e) => setFormData({ ...formData, appleMusic: e.target.value })}
              />
              <Input
                label="YouTube URL"
                placeholder="https://youtube.com/@channel"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              />
              <Input
                label="TikTok URL"
                placeholder="https://tiktok.com/@username"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Saving Artist...
                </>
              ) : (
                "Onboard Roster Member"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Edit Artist Profile & Media Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Profile — ${editingArtist?.stageName || editingArtist?.name || "Artist"}`}
        size="2xl"
      >
        <form onSubmit={handleUpdateArtist} className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-background border border-border rounded-xl">
            <button
              type="button"
              onClick={() => setActiveEditTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeEditTab === "profile"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Bio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditTab("socials")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeEditTab === "socials"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Socials & Links</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditTab("media")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeEditTab === "media"
                  ? "bg-primary text-black shadow-md font-bold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>
                Photos & Media ({editingArtist?.photos?.length || 0})
              </span>
            </button>
          </div>

          {/* TAB 1: Profile & Bio */}
          {activeEditTab === "profile" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Stage Name *"
                  placeholder="e.g. Phlame"
                  required
                  value={editFormData.stageName}
                  onChange={(e) => setEditFormData({ ...editFormData, stageName: e.target.value })}
                />
                <Input
                  label="Full / Display Name"
                  placeholder="Official legal or display name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Musical Genre"
                  placeholder="e.g. Afrobeats, Afro-Fusion, Soul"
                  value={editFormData.genre}
                  onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
                />
                <Select
                  label="Roster Status"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  options={[
                    { label: "Active (Current Roster)", value: "active" },
                    { label: "Signed (In Studio / Development)", value: "signed" },
                    { label: "Alumni (Legacy Roster)", value: "alumni" },
                  ]}
                />
              </div>

              {/* Featured Toggle Card */}
              <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Spotlight Artist</span>
                  <p className="text-[11px] text-muted-foreground">
                    Display prominently on homepage hero, trending carousel, and discovery sections.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.isFeatured}
                    onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>

              <Textarea
                label="Official Biography"
                rows={5}
                placeholder="Comprehensive artist narrative, background story, breakout records, milestone collaborations, and label journey..."
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
              />
            </div>
          )}

          {/* TAB 2: Socials & Streaming */}
          {activeEditTab === "socials" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <p className="text-xs text-muted-foreground">
                Connect official social handles and verified DSP streaming profiles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Instagram Profile"
                  placeholder="https://instagram.com/artist"
                  value={editFormData.instagram}
                  onChange={(e) => setEditFormData({ ...editFormData, instagram: e.target.value })}
                />
                <Input
                  label="Twitter / X Profile"
                  placeholder="https://x.com/artist"
                  value={editFormData.twitter}
                  onChange={(e) => setEditFormData({ ...editFormData, twitter: e.target.value })}
                />
                <Input
                  label="Spotify Artist Link"
                  placeholder="https://open.spotify.com/artist/..."
                  value={editFormData.spotify}
                  onChange={(e) => setEditFormData({ ...editFormData, spotify: e.target.value })}
                />
                <Input
                  label="Apple Music Link"
                  placeholder="https://music.apple.com/artist/..."
                  value={editFormData.appleMusic}
                  onChange={(e) => setEditFormData({ ...editFormData, appleMusic: e.target.value })}
                />
                <Input
                  label="YouTube Channel"
                  placeholder="https://youtube.com/@channel"
                  value={editFormData.youtube}
                  onChange={(e) => setEditFormData({ ...editFormData, youtube: e.target.value })}
                />
                <Input
                  label="TikTok Handle"
                  placeholder="https://tiktok.com/@artist"
                  value={editFormData.tiktok}
                  onChange={(e) => setEditFormData({ ...editFormData, tiktok: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Photos & Media */}
          {activeEditTab === "media" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Avatar & Banner Dual Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Avatar Card */}
                <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Profile Headshot (Avatar)
                    </span>
                    {editAvatarFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Revert
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-black border-2 border-border shrink-0 shadow-md">
                      <img
                        src={
                          avatarPreview ||
                          editingArtist?.avatar?.secure_url ||
                          editingArtist?.avatar?.url ||
                          editingArtist?.photos?.[0]?.url ||
                          "/images/img4.jpeg"
                        }
                        alt="Avatar Preview"
                        className="w-full h-full object-cover object-top"
                      />
                      {avatarPreview && (
                        <span className="absolute bottom-1 right-1 bg-primary text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        id="edit-avatar-upload"
                        onChange={handleAvatarFileChange}
                        className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark cursor-pointer bg-surface border border-border rounded-xl p-1"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Square 1:1 format recommended for roster card and navigation avatars.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner Card */}
                <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Hero Banner Image
                    </span>
                    {editBannerFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditBannerFile(null);
                          setBannerPreview(null);
                        }}
                        className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Revert
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative h-20 w-full rounded-xl overflow-hidden bg-black border border-border shadow-md">
                      {bannerPreview ||
                      editingArtist?.banner?.secure_url ||
                      editingArtist?.banner?.url ||
                      editingArtist?.bannerImage?.url ? (
                        <img
                          src={
                            bannerPreview ||
                            editingArtist?.banner?.secure_url ||
                            editingArtist?.banner?.url ||
                            editingArtist?.bannerImage?.url
                          }
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-black flex items-center justify-center text-[11px] text-muted-foreground">
                          No Banner Uploaded
                        </div>
                      )}
                      {bannerPreview && (
                        <span className="absolute bottom-1 right-1 bg-primary text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id="edit-banner-upload"
                      onChange={handleBannerFileChange}
                      className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-surface border border-border rounded-xl p-1"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Additional Photos */}
              <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    Upload Gallery Photo(s)
                  </h4>
                  {editNewPhotos.length > 0 && (
                    <span className="text-[11px] text-primary font-semibold">
                      {editNewPhotos.length} new photo(s) selected
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setEditNewPhotos(Array.from(e.target.files || []))}
                    className="flex-1 text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark cursor-pointer bg-surface border border-border rounded-xl p-1.5"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadPhotosImmediately}
                    disabled={editNewPhotos.length === 0 || isUploadingMorePhotos}
                    className="shrink-0"
                  >
                    {isUploadingMorePhotos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-1.5" />
                        <span>Upload Now ({editNewPhotos.length})</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  You can upload photos immediately with the button above, or click &ldquo;Save All Changes&rdquo; below to update profile and photos together.
                </p>
              </div>

              {/* Existing Gallery Photos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                  <span>Current Gallery Images ({editingArtist?.photos?.length || 0})</span>
                  <span className="text-[10px] text-muted-foreground">Hover to delete individual photos</span>
                </h4>

                {editingArtist?.photos && editingArtist.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editingArtist.photos.map((photo, index) => {
                      const photoUrl = photo.url || photo.secure_url;
                      return (
                        <div
                          key={(photo as any)?._id || (photo as any)?.id || photo.url || index}
                          className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-black border border-border"
                        >
                          {photoUrl && (
                            <img
                              src={photoUrl}
                              alt={`Gallery photo ${index + 1}`}
                              className="w-full h-full object-cover object-top"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(index)}
                              disabled={deletingPhotoIndex === index}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600/90 text-white text-xs font-semibold flex items-center gap-1 hover:bg-red-700 transition-all cursor-pointer shadow-lg"
                            >
                              {deletingPhotoIndex === index ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white">
                            #{index + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-background border border-border text-center text-xs text-muted-foreground">
                    No promotional gallery photos found. Upload some above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {activeEditTab === "profile" && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setActiveEditTab("socials")}
                >
                  Socials →
                </Button>
              )}
              {activeEditTab === "socials" && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setActiveEditTab("media")}
                >
                  Media & Photos →
                </Button>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
