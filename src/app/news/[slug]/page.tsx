"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { newsService } from "@/services/api";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, Share2, Tag, Newspaper } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUIStore();

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        const res = await newsService.getArticle(slug);
        if (res.data) setArticle(res.data);
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: "Link Copied",
        message: "Article link copied to clipboard.",
        type: "success",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-24 animate-pulse">
        <div className="h-6 w-32 bg-surface rounded mb-8" />
        <div className="h-12 w-3/4 bg-surface rounded mb-6" />
        <div className="h-80 w-full bg-surface rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-surface rounded w-full" />
          <div className="h-4 bg-surface rounded w-5/6" />
          <div className="h-4 bg-surface rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Newspaper className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The story you are looking for has been archived or relocated.</p>
        <Link href="/news">
          <Button variant="primary">Return to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24">
      {/* Top Bar */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/news" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to All Dispatches
          </Link>
          <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share Story
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge variant="gold">
              {(article.category || "general").replace(/_/g, " ").toUpperCase()}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>
                {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed border-l-2 border-primary pl-4 py-1 italic">
              {article.summary}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="aspect-16/9 w-full rounded-2xl overflow-hidden mb-12 border border-border shadow-2xl bg-black">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed text-base sm:text-lg space-y-6">
          {article.content.split("\n\n").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-10 mt-12 border-t border-border flex items-center flex-wrap gap-2">
            <Tag className="w-4 h-4 text-primary mr-2" />
            {article.tags.map((t: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-surface border border-border px-3 py-1 rounded-full text-zinc-400 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
