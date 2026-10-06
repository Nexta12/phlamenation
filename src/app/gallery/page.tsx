"use client";

import { useEffect, useState } from "react";
import { galleryService } from "@/services/api";
import { GalleryItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Camera, Calendar, User, Eye, X, ZoomIn } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState("");

  const categories = [
    { label: "All Works", value: "all" },
    { label: "Concerts & Live", value: "concerts" },
    { label: "Press Shoots", value: "press" },
    { label: "Behind The Scenes", value: "behind_the_scenes" },
    { label: "Cover Artwork", value: "artwork" },
    { label: "Editorial", value: "editorial" },
  ];

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await galleryService.getGallery({
          category: selectedCategory === "all" ? undefined : selectedCategory,
        });
        if (res.data) setItems(res.data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="relative py-24 bg-surface border-b border-border text-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="gold" className="mb-4">Visual Archives</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
            Press, Moments & <span className="text-primary">Aesthetics</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg font-light leading-relaxed">
            Curated high-resolution imagery documenting stadium tours, album cover creation, intimate studio sessions, and the global cultural footprint of Phlame Nation.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                    : "bg-surface/80 hover:bg-surface border border-border text-muted-foreground hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-square rounded-2xl bg-surface/50 border border-border animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const mainImg = item.images && item.images.length > 0 ? item.images[0].secure_url : null;
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    if (mainImg) {
                      setLightboxImage(mainImg);
                      setLightboxTitle(item.title);
                    }
                  }}
                  className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-surface border border-border cursor-pointer transition-all duration-300 hover:border-primary/50 shadow-lg hover:shadow-2xl"
                >
                  {mainImg ? (
                    <img
                      src={mainImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface/80 text-muted-foreground">
                      <Camera className="w-12 h-12 mb-2 text-primary/40" />
                      <span className="text-xs uppercase tracking-wider font-semibold">Phlame Visual</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Badge variant="gold" className="backdrop-blur-md">
                        {item.category.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-[11px] text-zinc-400">
                        {item.associatedArtist && (
                          <span className="flex items-center text-primary font-medium">
                            <User className="w-3 h-3 mr-1" />
                            {item.associatedArtist.name}
                          </span>
                        )}
                        {item.eventDate && (
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(item.eventDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center bg-surface/30 border border-border/50 rounded-2xl">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Visuals in this Category</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Our creative director is preparing updates for this visual collection. Check back soon or select another category.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="absolute top-6 right-6 z-10 flex items-center space-x-4">
            <span className="text-sm text-zinc-300 font-medium hidden sm:inline">{lightboxTitle}</span>
            <button
              onClick={() => setLightboxImage(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-6xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className="w-full h-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
