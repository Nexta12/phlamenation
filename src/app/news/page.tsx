"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { newsService } from "@/services/api";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Newspaper, Calendar, ArrowRight, Search, Zap } from "lucide-react";

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    { label: "All Stories", value: "all" },
    { label: "Press Releases", value: "press_release" },
    { label: "Announcements", value: "announcement" },
    { label: "Tour News", value: "tour" },
    { label: "Interviews", value: "interview" },
  ];

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const res = await newsService.getNews({
          status: "published",
          category: category === "all" ? undefined : category,
          search: search || undefined,
        });
        if (res.data) setArticles(res.data);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [category, search]);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-surface border-b border-border text-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="gold" className="mb-4">Official Dispatch</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
            News, Press & <span className="text-primary">Dispatches</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg font-light leading-relaxed">
            Direct announcements from Phlame Nation executive leadership: signings, album milestones, global chart certifications, and upcoming tour tickets.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="max-w-2xl mx-auto mt-10 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles, press releases, artist milestones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background/80 backdrop-blur-md border border-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors shadow-inner"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    category === cat.value
                      ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
                      : "bg-surface/80 hover:bg-surface border border-border text-muted-foreground hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-surface/50 border border-border animate-pulse" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className="group flex flex-col bg-surface border border-border hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-black/60">
                  {item.featuredImage ? (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface/90 text-muted-foreground">
                      <Newspaper className="w-12 h-12 mb-2 text-primary/40" />
                      <span className="text-xs uppercase tracking-wider font-semibold">Phlame Editorial</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" className="backdrop-blur-md">
                      {(item.category || "general").replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </div>
                  {item.isFlash && (
                    <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center">
                      <Zap className="w-3 h-3 mr-1 fill-white" />
                      Breaking
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.publishedAt || item.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {item.summary || item.content.slice(0, 150) + "..."}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-surface/30 border border-border/50 rounded-2xl">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Dispatches Found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              No articles match your query. Try resetting your search or selecting a different category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
