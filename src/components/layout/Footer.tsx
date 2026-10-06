"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/services/api";
import { useUIStore } from "@/stores/useUIStore";
import { Disc3, Send, Radio, Video, Music2, Share2 } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await api.post("/newsletter/subscribe", {
        email,
        source: "footer_newsletter",
      });
      addToast({
        title: "Subscribed",
        message: "Welcome to Phlame Nation! You're subscribed to release alerts.",
        type: "success",
      });
      setEmail("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to subscribe";
      addToast({
        title: "Subscription Error",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#0C0C10] border-t border-[#242430] pt-16 pb-28 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#242430]/60">
          {/* Col 1 & 2: Brand & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center group">
              <div className="relative w-44 sm:w-52 h-12 transition-transform group-hover:scale-105">
                <Image
                  src="/images/p-logo.png"
                  alt="Phlame Nation - From Nothing To Something"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-[#9D9DAE] leading-relaxed max-w-sm">
              An independent entertainment powerhouse pioneering Afro-fusion, global sounds, and talent management.
            </p>
          </div>

          {/* Col 3: Navigation */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F8F8FA]">Explore</h5>
            <Link href="/music" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Music Releases
            </Link>
            <Link href="/artists" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Artists Roster
            </Link>
            <Link href="/videos" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              YouTube Videos
            </Link>
            <Link href="/tours" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Live Tours
            </Link>
          </div>

          {/* Col 4: Studios & Company */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F8F8FA]">Services</h5>
            <Link href="/studios" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Studio Sessions
            </Link>
            <Link href="/gallery" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Press & Gallery
            </Link>
            <Link href="/news" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              News & Updates
            </Link>
            <Link href="/contact" className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors">
              Contact & Booking
            </Link>
          </div>

          {/* Col 5: Socials & Connect */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F8F8FA]">Follow</h5>
            <div className="flex items-center gap-3 mt-1">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#14141A] border border-[#242430] flex items-center justify-center text-[#9D9DAE] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition-colors" title="Instagram">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#14141A] border border-[#242430] flex items-center justify-center text-[#9D9DAE] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition-colors" title="Twitter / X">
                <Radio className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#14141A] border border-[#242430] flex items-center justify-center text-[#9D9DAE] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition-colors" title="YouTube">
                <Video className="w-4 h-4" />
              </a>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#14141A] border border-[#242430] flex items-center justify-center text-[#9D9DAE] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 transition-colors" title="Spotify">
                <Music2 className="w-4 h-4" />
              </a>
            </div>
            <span className="text-[11px] text-[#6B6B7B] mt-2">
              Lagos • London • Atlanta
            </span>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6B7B]">
          <span>© {new Date().getFullYear()} Phlame Nation Entertainment. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#9D9DAE] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#9D9DAE] transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
