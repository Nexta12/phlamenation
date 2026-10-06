"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { News } from "@/types";

export const FlashTicker: React.FC = () => {
  const [items, setItems] = useState<News[]>([]);

  useEffect(() => {
    api
      .get<News[]>("/news/flash")
      .then((res) => setItems(res.data || []))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-[#121217] border-b border-[#242430] py-2 overflow-hidden flex items-center select-none">
      <div className="overflow-hidden w-full px-4">
        <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
          {items.concat(items).map((item, idx) => (
            <Link
              key={`${item._id}-${idx}`}
              href={`/news/${item.slug || item._id}`}
              className="text-xs text-[#9D9DAE] hover:text-[#E5A93C] transition-colors flex items-center gap-2"
            >
              <span className="font-semibold text-[#F8F8FA]">
                {item.title}
              </span>
              <span className="text-[#6B6B7B]">•</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashTicker;
