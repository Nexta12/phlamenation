import React from "react";

export interface ArtistSocialLinksProps {
  socials?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    tiktok?: string;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    tiktok?: string;
  };
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "ghost" | "solid" | "pill";
  showLabel?: boolean;
  className?: string;
}

function formatUrl(platform: string, input?: string): string | null {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@/, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "twitter":
      return `https://x.com/${clean}`;
    case "tiktok":
      return `https://tiktok.com/@${clean}`;
    case "youtube":
      return clean.startsWith("@") ? `https://youtube.com/${clean}` : `https://youtube.com/@${clean}`;
    case "spotify":
      return `https://open.spotify.com/artist/${clean}`;
    case "appleMusic":
      return `https://music.apple.com/artist/${clean}`;
    default:
      return `https://${clean}`;
  }
}

export const ArtistSocialLinks: React.FC<ArtistSocialLinksProps> = ({
  socials,
  socialLinks,
  size = "sm",
  variant = "ghost",
  showLabel = false,
  className = "",
}) => {
  const merged = socials || socialLinks || {};

  const platforms = [
    {
      key: "spotify",
      name: "Spotify",
      url: formatUrl("spotify", merged.spotify),
      hoverColor: "hover:text-[#1DB954] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      key: "appleMusic",
      name: "Apple Music",
      url: formatUrl("appleMusic", merged.appleMusic),
      hoverColor: "hover:text-[#FC3C44] hover:border-[#FC3C44]/50 hover:bg-[#FC3C44]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.15c.66-.8 1.11-1.92.99-3.04-1 .04-2.15.65-2.83 1.45-.58.67-1.1 1.82-.96 2.93 1.12.09 2.14-.54 2.8-1.34z" />
        </svg>
      ),
    },
    {
      key: "youtube",
      name: "YouTube",
      url: formatUrl("youtube", merged.youtube),
      hoverColor: "hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      name: "Instagram",
      url: formatUrl("instagram", merged.instagram),
      hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      key: "twitter",
      name: "Twitter / X",
      url: formatUrl("twitter", merged.twitter),
      hoverColor: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: "tiktok",
      name: "TikTok",
      url: formatUrl("tiktok", merged.tiktok),
      hoverColor: "hover:text-[#25F4EE] hover:border-[#25F4EE]/50 hover:bg-[#25F4EE]/10",
      icon: (
        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  const activePlatforms = platforms.filter((p) => Boolean(p.url));

  if (activePlatforms.length === 0) {
    return null;
  }

  const sizeClasses = {
    xs: "w-6 h-6 p-1 text-[11px]",
    sm: "w-8 h-8 p-1.5 text-xs",
    md: "w-9 h-9 p-2 text-sm",
    lg: "w-10 h-10 p-2.5 text-base",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`flex items-center flex-wrap gap-1.5 ${className}`}>
      {activePlatforms.map((p) => {
        if (variant === "pill") {
          return (
            <a
              key={p.key}
              href={p.url!}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16161D] text-[#9D9DAE] border border-[#242430] ${p.hoverColor} transition-all duration-200 text-[11px] font-medium`}
              title={`${p.name}: ${p.url}`}
            >
              <span className={iconSizes[size]}>{p.icon}</span>
              {showLabel && <span>{p.name}</span>}
            </a>
          );
        }

        return (
          <a
            key={p.key}
            href={p.url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-xl bg-[#14141A] text-[#9D9DAE] border border-[#242430] ${p.hoverColor} transition-all duration-200 shadow-sm ${sizeClasses[size]}`}
            title={`${p.name}: ${p.url}`}
            aria-label={p.name}
          >
            <span className={iconSizes[size]}>{p.icon}</span>
          </a>
        );
      })}
    </div>
  );
};

export default ArtistSocialLinks;
