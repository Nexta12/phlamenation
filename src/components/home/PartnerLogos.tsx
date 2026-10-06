"use client";

import React from "react";

interface Partner {
  name: string;
  url: string;
  hoverClass: string;
  svg: React.ReactNode;
}

const PARTNERS: Partner[] = [
  {
    name: "Spotify",
    url: "https://open.spotify.com",
    hoverClass: "hover:text-[#1DB954] hover:drop-shadow-[0_0_12px_rgba(29,185,84,0.4)]",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.31c-.217.355-.678.47-1.033.253-2.83-1.728-6.392-2.119-10.587-1.161-.406.094-.805-.16-.897-.565-.094-.405.16-.805.565-.897 4.59-1.047 8.528-.608 11.699 1.337.355.217.47.678.253 1.033zm1.467-3.264c-.273.444-.853.587-1.297.315-3.24-1.99-8.18-2.568-12.012-1.404-.502.152-1.032-.132-1.184-.633-.152-.501.132-1.032.633-1.184 4.385-1.33 9.824-.69 13.545 1.609.444.272.587.852.315 1.297zm.126-3.41c-3.885-2.307-10.297-2.519-14.019-1.39-.597.18-1.229-.158-1.41-.755-.18-.598.158-1.23.755-1.41 4.275-1.298 11.35-1.047 15.82 1.608.536.318.712 1.01.394 1.546-.317.536-1.009.712-1.54.394z" />
      </svg>
    ),
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com",
    hoverClass: "hover:text-[#FA243C] hover:drop-shadow-[0_0_12px_rgba(250,36,60,0.4)]",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-1.06 1.71-.92 2.73 1 .08 2-.48 2.62-1.23z" />
      </svg>
    ),
  },
  {
    name: "YouTube Music",
    url: "https://music.youtube.com",
    hoverClass: "hover:text-[#FF0000] hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-2.5-10.5v7l6-3.5-6-3.5z" />
      </svg>
    ),
  },
  {
    name: "Tidal",
    url: "https://tidal.com",
    hoverClass: "hover:text-[#00FFFF] hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]",
    svg: (
      <svg className="h-7 sm:h-8 md:h-9 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M4.004 7.996l3.998 4-3.998 4-4.004-4 4.004-4zm8.002 0l3.998 4-3.998 4-4.004-4 4.004-4zm8.002 0l3.998 4-3.998 4-4.004-4 4.004-4zm-8.002-8l3.998 4-3.998 4-4.004-4 4.004-4z" />
      </svg>
    ),
  },
  {
    name: "Audiomack",
    url: "https://audiomack.com",
    hoverClass: "hover:text-[#FFA200] hover:drop-shadow-[0_0_12px_rgba(255,162,0,0.4)]",
    svg: (
      <svg className="h-7 sm:h-8 md:h-9 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M22.84 13.917c-.365 2.87-2.616 5.083-5.385 5.083-2.99 0-5.415-2.42-5.415-5.41 0-2.99 2.424-5.414 5.415-5.414 1.75 0 3.296.83 4.29 2.115l-1.848 1.15c-.56-.76-1.44-1.245-2.442-1.245-1.87 0-3.39 1.52-3.39 3.394 0 1.874 1.52 3.395 3.39 3.395 1.54 0 2.83-1.025 3.25-2.443h-3.25v-2.025h5.385v1.395zm-14.77-5.742h2.025v10.825H8.07V8.175zm-4.05 3.245h2.025v7.58H4.02v-7.58zm-4.02 4.33h2.025v3.25H0v-3.25z" />
      </svg>
    ),
  },
  {
    name: "Boomplay",
    url: "https://www.boomplay.com",
    hoverClass: "hover:text-[#00B2FE] hover:drop-shadow-[0_0_12px_rgba(0,178,254,0.4)]",
    svg: (
      <svg className="h-7 sm:h-8 md:h-9 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M3 4v16l14-8L3 4zm16 0v16h2V4h-2z" />
      </svg>
    ),
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com",
    hoverClass: "hover:text-[#FF5500] hover:drop-shadow-[0_0_12px_rgba(255,85,0,0.4)]",
    svg: (
      <svg className="h-7 sm:h-8 md:h-9 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M11.56 8.87V17h9.09c1.85 0 3.35-1.5 3.35-3.35 0-1.78-1.39-3.24-3.14-3.34-.33-2.45-2.42-4.31-4.96-4.31-1.89 0-3.53 1.04-4.34 2.87zm-1.88 1.34V17H11v-7.51c-.48.21-.92.46-1.32.72zm-1.88 1.05V17h1.25v-6.02c-.41.22-.84.47-1.25.76zm-1.87 1.48V17h1.25v-3.48c-.4.27-.82.52-1.25.74zm-1.88 1.15V17H5.3v-1.22c-.43.27-.85.51-1.25.68zm-1.88 1.12V17h1.25v-.19c-.43.2-.84.34-1.25.43zM0 15.6V17h1.25v-.73c-.41.04-.84.09-1.25.13v-.8z" />
      </svg>
    ),
  },
  {
    name: "Vevo",
    url: "https://www.youtube.com/@vevo",
    hoverClass: "hover:text-[#ED1C24] hover:drop-shadow-[0_0_12px_rgba(237,28,36,0.4)]",
    svg: (
      <svg className="h-6 sm:h-7 md:h-8 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M2.5 5.5l5.5 13h3.5l5.5-13h-3.8l-3.4 9-3.4-9H2.5zm16.5 0v13h3.5V5.5H19z" />
      </svg>
    ),
  },
];

export default function PartnerLogos() {
  // Duplicate array for an infinite loop with CSS marquee
  const loopedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="relative w-full py-10 sm:py-12 md:py-14 border-t border-[#242430]/50 overflow-hidden bg-[#08080A]/60">
      {/* Left & Right gradient edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-[#08080A] via-[#08080A]/90 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-[#08080A] via-[#08080A]/90 to-transparent z-10" />

      {/* Infinite scrolling track */}
      <div className="flex animate-marquee items-center gap-12 sm:gap-18 md:gap-24">
        {loopedPartners.map((partner, index) => (
          <a
            key={`${partner.name}-${index}`}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Visit ${partner.name}`}
            className={`flex items-center justify-center shrink-0 text-[#7E7E92] ${partner.hoverClass} opacity-65 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer`}
          >
            {partner.svg}
          </a>
        ))}
      </div>
    </section>
  );
}
