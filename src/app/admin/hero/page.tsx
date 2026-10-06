"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroService } from "@/services/api";
import { HeroConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/stores/useUIStore";
import {
  Video as VideoIcon,
  Image as ImageIcon,
  Flame,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Play,
  Eye,
} from "lucide-react";

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Form states
  const [heroType, setHeroType] = useState<"video" | "image" | "default">("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [primaryCtaText, setPrimaryCtaText] = useState("");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");
  const [showOverlayText, setShowOverlayText] = useState(true);
  const [isMutedDefault, setIsMutedDefault] = useState(true);

  // Upload files
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string>("");

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useUIStore();

  const loadHeroConfig = async () => {
    try {
      setLoading(true);
      const res = await heroService.getHero();
      if (res.data) {
        const data = res.data;
        setHero(data);
        setHeroType(data.type || "video");
        setVideoUrl(data.videoUrl || "");
        setImageUrl(data.imageUrl || "");
        setBadgeText(data.badgeText || "PHLAME NATION ENTERTAINMENT");
        setHeadline(data.headline || "IGNITING GLOBAL SOUNDS");
        setSubheadline(data.subheadline || "The frontline of African sonic excellence, world tours, and platinum artistry.");
        setPrimaryCtaText(data.primaryCtaText || "Listen to Catalogue");
        setPrimaryCtaLink(data.primaryCtaLink || "/music");
        setSecondaryCtaText(data.secondaryCtaText || "Meet the Roster");
        setSecondaryCtaLink(data.secondaryCtaLink || "/artists");
        setShowOverlayText(data.showOverlayText !== false);
        setIsMutedDefault(data.isMutedDefault !== false);
      }
    } catch (err: any) {
      console.error("Failed to load hero config:", err);
      addToast({
        title: "Load Error",
        message: err.message || "Failed to load hero configuration.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroConfig();
  }, []);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        addToast({
          title: "File Too Large",
          message: "Video file must be under 100MB for Cloudinary streaming.",
          type: "error",
        });
        return;
      }
      setVideoFile(file);
      setVideoFilePreview(URL.createObjectURL(file));
      setHeroType("video");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        addToast({
          title: "File Too Large",
          message: "Image banner must be under 15MB.",
          type: "error",
        });
        return;
      }
      setImageFile(file);
      setImageFilePreview(URL.createObjectURL(file));
      setHeroType("image");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("type", heroType);
      if (videoFile) formData.append("video", videoFile);
      else if (videoUrl) formData.append("videoUrl", videoUrl);

      if (imageFile) formData.append("image", imageFile);
      else if (imageUrl) formData.append("imageUrl", imageUrl);

      formData.append("badgeText", badgeText);
      formData.append("headline", headline);
      formData.append("subheadline", subheadline);
      formData.append("primaryCtaText", primaryCtaText);
      formData.append("primaryCtaLink", primaryCtaLink);
      formData.append("secondaryCtaText", secondaryCtaText);
      formData.append("secondaryCtaLink", secondaryCtaLink);
      formData.append("showOverlayText", String(showOverlayText));
      formData.append("isMutedDefault", String(isMutedDefault));

      const res = await heroService.updateHero(formData);
      if (res.data) {
        setHero(res.data);
        setVideoFile(null);
        setVideoFilePreview("");
        setImageFile(null);
        setImageFilePreview("");
        addToast({
          title: "Hero Updated",
          message: "Homepage Hero section updated successfully!",
          type: "success",
        });
      }
    } catch (err: any) {
      console.error("Failed to update hero:", err);
      addToast({
        title: "Update Failed",
        message: err.response?.data?.message || err.message || "Failed to update Hero configuration.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the Hero section to its default showcase?")) return;
    try {
      setResetting(true);
      const res = await heroService.resetHero();
      if (res.data) {
        setHero(res.data);
        setHeroType(res.data.type || "video");
        setVideoUrl(res.data.videoUrl || "");
        setImageUrl(res.data.imageUrl || "");
        setVideoFile(null);
        setVideoFilePreview("");
        setImageFile(null);
        setImageFilePreview("");
        addToast({
          title: "Hero Reset",
          message: "Hero section reset to default.",
          type: "info",
        });
      }
    } catch (err: any) {
      console.error("Failed to reset hero:", err);
      addToast({
        title: "Reset Failed",
        message: err.message || "Could not reset hero.",
        type: "error",
      });
    } finally {
      setResetting(false);
    }
  };

  // Preview video/image resolution
  const activeVideoSrc = videoFilePreview || videoUrl || hero?.videoUrl || "";
  const activeImageSrc = imageFilePreview || imageUrl || hero?.imageUrl || "";
  const isYouTube =
    activeVideoSrc.includes("youtube.com") || activeVideoSrc.includes("youtu.be");

  return (
    <div className="space-y-8 pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242430] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C]">
              HOMEPAGE SHOWCASE
            </span>
            <Badge variant="outline" className="text-[10px] py-0.5">
              Live Control
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hero Section Manager
          </h1>
          <p className="text-sm text-[#9D9DAE] mt-1">
            Seamlessly toggle between cinematic Cloudinary video loops, full-bleed image banners, or minimal brand hero.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A22] text-[#F8F8FA] hover:bg-[#242430] border border-[#242430] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#E5A93C]" />
            View Live Site
            <ExternalLink className="w-3 h-3 text-[#9D9DAE]" />
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            isLoading={resetting}
            className="text-xs text-[#9D9DAE] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Default
          </Button>
        </div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Controls & Uploads (7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div className="p-5 rounded-2xl bg-[#0D0D12] border border-[#242430]">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-3">
              1. Choose Hero Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Video Mode */}
              <button
                type="button"
                onClick={() => setHeroType("video")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  heroType === "video"
                    ? "bg-[#E5A93C]/10 border-[#E5A93C] text-white shadow-lg shadow-[#E5A93C]/5"
                    : "bg-[#14141B] border-[#242430] text-[#9D9DAE] hover:border-[#3E3E50]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <VideoIcon className={`w-5 h-5 ${heroType === "video" ? "text-[#E5A93C]" : ""}`} />
                  {heroType === "video" && (
                    <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                  )}
                </div>
                <div className="font-semibold text-sm">Cinematic Video</div>
                <div className="text-[11px] leading-snug opacity-80">
                  Cloudinary MP4 loop or YouTube embed
                </div>
              </button>

              {/* Image Banner Mode */}
              <button
                type="button"
                onClick={() => setHeroType("image")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  heroType === "image"
                    ? "bg-[#E5A93C]/10 border-[#E5A93C] text-white shadow-lg shadow-[#E5A93C]/5"
                    : "bg-[#14141B] border-[#242430] text-[#9D9DAE] hover:border-[#3E3E50]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <ImageIcon className={`w-5 h-5 ${heroType === "image" ? "text-[#E5A93C]" : ""}`} />
                  {heroType === "image" && (
                    <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                  )}
                </div>
                <div className="font-semibold text-sm">Image Banner</div>
                <div className="text-[11px] leading-snug opacity-80">
                  High-res cover art or campaign poster
                </div>
              </button>

              {/* Default Brand Mode */}
              <button
                type="button"
                onClick={() => setHeroType("default")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  heroType === "default"
                    ? "bg-[#E5A93C]/10 border-[#E5A93C] text-white shadow-lg shadow-[#E5A93C]/5"
                    : "bg-[#14141B] border-[#242430] text-[#9D9DAE] hover:border-[#3E3E50]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Flame className={`w-5 h-5 ${heroType === "default" ? "text-[#E5A93C]" : ""}`} />
                  {heroType === "default" && (
                    <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                  )}
                </div>
                <div className="font-semibold text-sm">Brand Showcase</div>
                <div className="text-[11px] leading-snug opacity-80">
                  Gold crest logo with animated aura
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Media Configuration */}
          {heroType === "video" && (
            <div className="p-5 rounded-2xl bg-[#0D0D12] border border-[#242430] space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C]">
                  2. Video Source
                </span>
                <span className="text-[11px] text-[#9D9DAE]">MP4, WebM, or YouTube</span>
              </div>

              {/* Option A: Direct Video Upload to Cloudinary */}
              <div className="p-4 rounded-xl bg-[#14141B] border border-dashed border-[#2E2E3E] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Upload Video directly to Cloudinary
                      </div>
                      <div className="text-xs text-[#9D9DAE]">
                        Max 100MB • Auto-streams via API
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/mp4,video/webm,video/quicktime,video/mov"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    Select Video
                  </Button>
                </div>
                {videoFile && (
                  <div className="text-xs text-[#E5A93C] flex items-center gap-2 bg-[#E5A93C]/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </div>
                )}
              </div>

              {/* Option B: Video URL input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#9D9DAE] flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Or Paste Video URL (Cloudinary MP4 or YouTube Link)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (videoFile) setVideoFile(null);
                  }}
                  placeholder="https://res.cloudinary.com/.../video.mp4 or https://youtube.com/watch?v=..."
                  className="bg-[#14141B] border-[#242430]"
                />
              </div>

              {/* Audio toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C26]">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-white flex items-center gap-1.5">
                    {isMutedDefault ? (
                      <VolumeX className="w-4 h-4 text-[#9D9DAE]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#E5A93C]" />
                    )}
                    Default Muted Autoplay
                  </div>
                  <div className="text-xs text-[#9D9DAE]">
                    Browsers require autoplay videos to start muted. Visitors can toggle sound on the hero page.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMutedDefault(!isMutedDefault)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isMutedDefault ? "bg-[#E5A93C]" : "bg-[#242430]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isMutedDefault ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {heroType === "image" && (
            <div className="p-5 rounded-2xl bg-[#0D0D12] border border-[#242430] space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C]">
                  2. Image Banner Source
                </span>
                <span className="text-[11px] text-[#9D9DAE]">JPG, PNG, WebP</span>
              </div>

              {/* Option A: Direct Image Upload to Cloudinary */}
              <div className="p-4 rounded-xl bg-[#14141B] border border-dashed border-[#2E2E3E] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Upload Image Banner to Cloudinary
                      </div>
                      <div className="text-xs text-[#9D9DAE]">
                        Recommended 1920x1080 • Max 15MB
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    Select Image
                  </Button>
                </div>
                {imageFile && (
                  <div className="text-xs text-[#E5A93C] flex items-center gap-2 bg-[#E5A93C]/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected: {imageFile.name}
                  </div>
                )}
              </div>

              {/* Option B: Image URL input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#9D9DAE] flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Or Paste High-Res Image URL
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (imageFile) setImageFile(null);
                  }}
                  placeholder="https://res.cloudinary.com/.../banner.jpg"
                  className="bg-[#14141B] border-[#242430]"
                />
              </div>
            </div>
          )}

          {/* Overlay Text & CTA Settings */}
          <div className="p-5 rounded-2xl bg-[#0D0D12] border border-[#242430] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1C26] pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C]">
                  3. Typography & Calls to Action
                </span>
                <p className="text-xs text-[#9D9DAE] mt-0.5">
                  Overlay branding, headline text, and action buttons on the Hero.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9D9DAE]">Show Text</span>
                <button
                  type="button"
                  onClick={() => setShowOverlayText(!showOverlayText)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showOverlayText ? "bg-[#E5A93C]" : "bg-[#242430]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      showOverlayText ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {showOverlayText && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#9D9DAE] mb-1">
                      Badge Label
                    </label>
                    <Input
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="PHLAME NATION ENTERTAINMENT"
                      className="bg-[#14141B] border-[#242430]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#9D9DAE] mb-1">
                      Primary Headline
                    </label>
                    <Input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="IGNITING GLOBAL SOUNDS"
                      className="bg-[#14141B] border-[#242430]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9D9DAE] mb-1">
                    Subheadline Description
                  </label>
                  <Input
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="The frontline of African sonic excellence, world tours, and platinum artistry."
                    className="bg-[#14141B] border-[#242430]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#9D9DAE]">
                      Primary Button (Text & Link)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={primaryCtaText}
                        onChange={(e) => setPrimaryCtaText(e.target.value)}
                        placeholder="Listen to Catalogue"
                        className="bg-[#14141B] border-[#242430] w-1/2"
                      />
                      <Input
                        value={primaryCtaLink}
                        onChange={(e) => setPrimaryCtaLink(e.target.value)}
                        placeholder="/music"
                        className="bg-[#14141B] border-[#242430] w-1/2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#9D9DAE]">
                      Secondary Button (Text & Link)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={secondaryCtaText}
                        onChange={(e) => setSecondaryCtaText(e.target.value)}
                        placeholder="Meet the Roster"
                        className="bg-[#14141B] border-[#242430] w-1/2"
                      />
                      <Input
                        value={secondaryCtaLink}
                        onChange={(e) => setSecondaryCtaLink(e.target.value)}
                        placeholder="/artists"
                        className="bg-[#14141B] border-[#242430] w-1/2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              className="px-8 font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Save & Publish Changes
            </Button>
          </div>
        </form>

        {/* Right Column: Live Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-[#E5A93C] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Live Interactive Preview
            </div>
            <span className="text-[11px] text-[#9D9DAE] font-medium capitalize">
              Mode: {heroType}
            </span>
          </div>

          {/* Simulated Screen Container */}
          <div className="relative w-full aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden bg-black border border-[#242430] shadow-2xl flex items-center justify-center">
            {/* Visual Media Layer */}
            {heroType === "video" && (
              <>
                {isYouTube ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      activeVideoSrc.includes("v=")
                        ? activeVideoSrc.split("v=")[1].split("&")[0]
                        : activeVideoSrc.split("/").pop() || "0-VwN0s9HJU"
                    }?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1`}
                    title="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-125"
                  />
                ) : activeVideoSrc ? (
                  <video
                    src={activeVideoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9D9DAE] text-xs">
                    <VideoIcon className="w-8 h-8 text-[#E5A93C]/40 mb-2" />
                    Upload or paste a video URL above
                  </div>
                )}
              </>
            )}

            {heroType === "image" && (
              <>
                {activeImageSrc ? (
                  <img
                    src={activeImageSrc}
                    alt="Hero Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9D9DAE] text-xs">
                    <ImageIcon className="w-8 h-8 text-[#E5A93C]/40 mb-2" />
                    Upload or paste an image banner URL above
                  </div>
                )}
              </>
            )}

            {heroType === "default" && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#12121A] via-black to-[#08080A] flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-2">
                  <div className="absolute -inset-4 bg-[#E5A93C]/20 rounded-full blur-xl animate-pulse" />
                  <Image
                    src="/images/c-logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Cinema overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

            {/* Overlay Simulated Text */}
            {showOverlayText && (
              <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none z-10">
                {badgeText && (
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#E5A93C] mb-1">
                    {badgeText}
                  </div>
                )}
                <div className="text-base sm:text-lg font-black text-white leading-tight mb-1">
                  {headline || "IGNITING GLOBAL SOUNDS"}
                </div>
                {subheadline && (
                  <div className="text-[11px] text-[#C4C4D4] line-clamp-2 max-w-sm mb-3">
                    {subheadline}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {primaryCtaText && (
                    <span className="px-3 py-1 rounded-md bg-[#E5A93C] text-[#08080A] text-[10px] font-bold shadow">
                      {primaryCtaText}
                    </span>
                  )}
                  {secondaryCtaText && (
                    <span className="px-3 py-1 rounded-md bg-white/10 text-white backdrop-blur text-[10px] font-semibold border border-white/20">
                      {secondaryCtaText}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick tips card */}
          <div className="p-4 rounded-xl bg-[#0D0D12] border border-[#242430] text-xs text-[#9D9DAE] space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              Pro-Tips for Maximum Performance
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
              <li>
                <strong>Cloudinary Videos:</strong> Upload MP4 clips between 5–30 seconds. The API automatically streams and loops them.
              </li>
              <li>
                <strong>Image Banners:</strong> Use 1920x1080 JPEG or WebP images under 2MB for fast mobile loading.
              </li>
              <li>
                <strong>Instant Updates:</strong> Saving updates your MongoDB database immediately. No Vercel redeployment required!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
