import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Globe, Radio, Disc3, Calendar, ArrowRight, ExternalLink, Headphones } from "lucide-react";

export const metadata = {
  title: "Services | Phlame Nation Record Label",
  description:
    "Explore Phlame Nation services: Global Music Distribution, Sync Licensing, Artist Management, Live Concert Staging, and Audio Engineering.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Global Music Distribution & Publishing",
      description:
        "Direct-to-platform digital streaming distribution, rights management, metadata optimization, and global playlist pitching across 150+ territories.",
      link: "/contact",
      cta: "Inquire Distribution",
      icon: Globe,
    },
    {
      title: "Sync & Commercial Licensing",
      description:
        "Premium soundtrack placements, sync licensing, and commercial music curation for film, television, gaming, and brand campaigns.",
      link: "/contact",
      cta: "Inquire for Sync",
      icon: Radio,
    },
    {
      title: "Artist Management & A&R",
      description:
        "Holistic artist development, sonic direction, international brand partnerships, and creative strategy for recording talent.",
      link: "/contact",
      cta: "Contact A&R",
      icon: Disc3,
    },
    {
      title: "Live Concerts & Tour Production",
      description:
        "Global concert tours, festival headlining, and live acoustic staging with full production support across international arenas.",
      link: "/tours",
      cta: "View Tour Dates",
      icon: Calendar,
    },
    {
      title: "Audio Engineering & Post-Production",
      description:
        "Multi-track analog and digital mastering engineered to international broadcast and streaming standards across Spotify, Apple Music, and Dolby Atmos.",
      link: "/contact",
      cta: "Contact Audio Team",
      icon: Headphones,
    },
  ];

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F8F8FA] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col gap-14">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A22] border border-[#E5A93C]/30 text-xs font-semibold text-[#E5A93C] mb-6">
            <Radio className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>LABEL SERVICES & INFRASTRUCTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8F8FA] font-heading leading-tight max-w-3xl mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F3C772]">Services</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9D9DAE] max-w-2xl leading-relaxed">
            From global distribution to sync licensing, explore our suite of entertainment and production services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#121217] border border-[#242430] flex flex-col justify-between hover:border-[#E5A93C]/40 transition-colors group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A24] border border-white/5 flex items-center justify-center text-[#E5A93C] mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F8F8FA] mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#9D9DAE] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <Link href={item.link}>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
