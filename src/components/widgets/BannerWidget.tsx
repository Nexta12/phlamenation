"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Widget } from "@/types";
import api from "@/services/api";
import { ExternalLink } from "lucide-react";

interface BannerWidgetProps {
  placement?: "header_banner" | "sidebar_widget" | "in_feed" | "footer_sponsor";
  className?: string;
}

export const BannerWidget: React.FC<BannerWidgetProps> = ({
  placement = "header_banner",
  className = "",
}) => {
  const [widget, setWidget] = useState<Widget | null>(null);

  useEffect(() => {
    api
      .get<Widget[]>("/widgets/active", { placement })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setWidget(res.data[0]); // Pick highest priority active widget
        }
      })
      .catch(() => {});
  }, [placement]);

  if (!widget) return null;

  const handleClick = () => {
    if (widget._id) {
      api.post(`/widgets/${widget._id}/click`).catch(() => {});
    }
  };

  return (
    <a
      href={widget.targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`relative group block w-full rounded-2xl overflow-hidden border border-[#242430] hover:border-[#E5A93C]/50 transition-all shadow-lg ${className}`}
    >
      <div className="relative aspect-[21/9] sm:aspect-[24/7] w-full bg-[#121217]">
        {widget.image?.url && (
          <Image
            src={widget.image.url}
            alt={widget.altText || widget.title}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-6 sm:p-8">
          <div className="max-w-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5A93C] mb-1 block">
              Sponsored
            </span>
            {widget.headline && (
              <h3 className="text-base sm:text-xl font-extrabold text-[#F8F8FA] mb-1">
                {widget.headline}
              </h3>
            )}
            {widget.description && (
              <p className="text-xs text-[#9D9DAE] line-clamp-2 mb-3">
                {widget.description}
              </p>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5A93C] group-hover:underline">
              <span>{widget.buttonText || "Learn More"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BannerWidget;
