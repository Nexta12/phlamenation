"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { News } from "@/types";
import api from "@/services/api";
import {
  Flame,
  ArrowRight,
  Mail,
  CheckCircle2,
  Clock,
  Radio,
  ExternalLink,
} from "lucide-react";

export const HomeSidebar: React.FC = () => {
  const [flashNews, setFlashNews] = useState<News[]>([]);
  const [recentNews, setRecentNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<News[]>("/news/flash").catch(() => ({ data: [] })),
      api.get<News[]>("/news", { limit: 6 }).catch(() => ({ data: [] })),
    ])
      .then(([flashRes, newsRes]) => {
        setFlashNews(flashRes.data || []);
        setRecentNews(newsRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setNewsletterError("Please enter a valid email address");
      return;
    }
    setNewsletterError("");
    setSubscribing(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setNewsletterError(
        err?.response?.data?.message || "Failed to subscribe. Please try again."
      );
    } finally {
      setSubscribing(false);
    }
  };

  // Combine items for the vertical feed
  const hasItems = flashNews.length > 0 || recentNews.length > 0;

  const renderUpdateItems = (keyPrefix: string) => (
    <div className="flex flex-col gap-3 py-1">
      {/* 1. Breaking / Flash Updates */}
      {flashNews.map((flash) => (
        <Link
          key={`${keyPrefix}-flash-${flash._id}`}
          href={`/news/${flash.slug || flash._id}`}
          className="group block p-3.5 rounded-2xl bg-[#181822] border border-[#2B2B3A] hover:border-[#E5A93C]/50 transition-colors"
        >
          <div className="flex items-start gap-2.5">
            <Flame className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Flash
                </span>
                <span className="text-[10px] text-[#6B6B7B]">
                  {flash.publishedAt
                    ? new Date(flash.publishedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "Today"}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors leading-snug line-clamp-2">
                {flash.flashText || flash.title}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* 2. Published Articles & News Feed */}
      {recentNews.map((article) => {
        const coverUrl =
          article.coverImage?.url ||
          article.coverImage?.secure_url ||
          article.featuredImage;
        return (
          <Link
            key={`${keyPrefix}-article-${article._id}`}
            href={`/news/${article.slug || article._id}`}
            className="group p-3 rounded-2xl bg-[#16161E] border border-[#242430] hover:border-[#E5A93C]/40 transition-colors flex gap-3 items-start"
          >
            {coverUrl && (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#1A1A22] shrink-0 border border-[#242430]">
                <Image
                  src={coverUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1A1A24] text-[#E5A93C] border border-[#E5A93C]/20 mb-1 inline-block">
                {article.category?.replace("_", " ") || "News"}
              </span>
              <h4 className="text-xs font-medium text-[#F8F8FA] group-hover:text-[#E5A93C] transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>
              <p className="text-[10px] text-[#6B6B7B] mt-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="w-full">
      {/* The Single "Updates" Sticky Widget */}
      <div className="rounded-3xl bg-[#121217] border border-[#242430] p-5 shadow-2xl flex flex-col h-[680px] max-h-[calc(100vh-7.5rem)] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-[#242430] shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F8F8FA] font-heading flex items-center gap-1.5">
              <span>Updates</span>
            </h3>
          </div>

          <Link
            href="/news"
            className="text-[11px] font-semibold text-[#E5A93C] hover:underline flex items-center gap-1"
          >
            <span>All News</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Content: Vertical Scrolling News Stream */}
        <div className="flex-1 overflow-hidden relative group">
          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-[#1A1A22] animate-pulse" />
              ))}
            </div>
          ) : !hasItems ? (
            <div className="p-8 text-center text-xs text-[#9D9DAE] flex flex-col items-center justify-center h-full">
              <Radio className="w-6 h-6 text-[#E5A93C] opacity-40 mb-2" />
              <p>No active updates right now. Check back soon.</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-1 select-none scroll-smooth">
              {/* Continuous vertical scroll animation container that pauses on mouse hover */}
              <div className="animate-marquee-vertical flex flex-col gap-3">
                {renderUpdateItems("primary")}
                {renderUpdateItems("repeat")}
              </div>
            </div>
          )}

          {/* Fade overlays for smooth vertical ticker look */}
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#121217] to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#121217] to-transparent pointer-events-none z-10" />
        </div>

        {/* Widget Footer: Compact Newsletter Form */}
        <div className="pt-3 mt-2 border-t border-[#242430] shrink-0">
          {subscribed ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Subscribed to official updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Get email alerts..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribing}
                  className="w-full px-3 py-2 rounded-xl bg-[#181822] border border-[#2B2B3A] text-xs text-[#F8F8FA] placeholder-[#6B6B7B] focus:outline-none focus:border-[#E5A93C]"
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                aria-label="Subscribe"
                className="px-3.5 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#F3C772] text-[#08080A] font-bold text-xs transition-colors shrink-0 flex items-center justify-center disabled:opacity-50"
              >
                <span>{subscribing ? "..." : "Join"}</span>
              </button>
            </form>
          )}
          {newsletterError && (
            <p className="text-[10px] text-rose-400 mt-1">{newsletterError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
