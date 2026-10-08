export type UserRole = "superAdmin" | "admin" | "editor" | "user";

export interface User {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Artist {
  _id: string;
  name: string;
  stageName?: string;
  slug: string;
  bio?: string;
  avatar?: { url?: string; secure_url?: string; publicId?: string };
  banner?: { url?: string; secure_url?: string; publicId?: string };
  bannerImage?: { url?: string; secure_url?: string; publicId?: string };
  photos?: { _id?: string; id?: string; url?: string; secure_url?: string; publicId?: string }[];
  genre?: string;
  genres?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
    tiktok?: string;
  };
  socials?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
    tiktok?: string;
  };
  status?: "active" | "alumni" | "signed" | "legend" | string;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface StreamingPlatforms {
  spotify?: string;
  appleMusic?: string;
  audiomack?: string;
  boomplay?: string;
  youtubeMusic?: string;
}

export interface Track {
  _id: string;
  title: string;
  slug?: string;
  artist?: Artist | any;
  artistName?: string;
  primaryArtist?: Artist | string;
  featuredArtists?: (Artist | string)[];
  featuredArtistsText?: string;
  coverArt?: { url?: string; secure_url?: string; publicId?: string };
  audioFile?: {
    url?: string;
    secure_url?: string;
    publicId?: string;
    duration?: number;
    bytes?: number;
    format?: string;
  };
  streamingPlatforms?: StreamingPlatforms;
  releaseType?: "single" | "ep" | "album";
  albumTitle?: string;
  releaseDate: string;
  genre?: string;
  lyrics?: string;
  streamCount: number;
  downloadCount: number;
  isSingle?: boolean;
  isDownloadable?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Video {
  _id: string;
  title: string;
  slug?: string;
  youtubeUrl: string;
  youtubeId?: string;
  embedUrl?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  customThumbnail?: { url: string; publicId: string };
  artist?: Artist | any;
  artists?: (Artist | string)[];
  artistsText?: string;
  category: "music_video" | "visualizer" | "lyric_video" | "live_performance" | "behind_the_scenes" | "teaser" | "interview" | string;
  description?: string;
  viewsCount?: number;
  releaseDate?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface GalleryImage {
  _id?: string;
  url?: string;
  secure_url?: string;
  publicId?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface Gallery {
  _id: string;
  title: string;
  description?: string;
  category: "concerts" | "press" | "behind_the_scenes" | "artwork" | "editorial" | "events" | string;
  coverImage?: { url?: string; secure_url?: string; publicId?: string };
  images: GalleryImage[];
  associatedArtist?: Artist | any;
  tags?: string[];
  eventDate?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export type GalleryItem = Gallery;

export interface News {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  coverImage?: { url?: string; secure_url?: string; publicId?: string };
  category?: "press_release" | "announcement" | "tour" | "interview" | "general" | string;
  isFlash?: boolean;
  flashText?: string;
  status: "draft" | "published";
  author?: User | string;
  tags?: string[];
  viewsCount?: number;
  publishedAt?: string;
  createdAt?: string;
}

export type NewsArticle = News;

export interface TourEvent {
  _id: string;
  title: string;
  tourName?: string;
  artist?: Artist | any;
  artists?: (Artist | string)[];
  venue: string;
  city: string;
  country: string;
  date?: string;
  eventDate?: string;
  time?: string;
  ticketUrl?: string;
  ticketStatus?: "available" | "selling_fast" | "sold_out" | "free" | "cancelled" | string;
  status?: "upcoming" | "sold_out" | "completed" | "cancelled" | string;
  coverImage?: { url?: string; secure_url?: string; publicId?: string };
  description?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export type EventItem = TourEvent;

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  type: "general" | "booking" | "press" | "demo_submission" | "sponsorship" | string;
  message: string;
  status: "unread" | "read" | "replied" | "archived" | string;
  adminNotes?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  source?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount?: number;
  };
}

export interface HeroConfig {
  _id?: string;
  type: "video" | "image" | "default";
  videoUrl?: string;
  videoPublicId?: string;
  videoType?: "cloudinary" | "mp4" | "youtube";
  imageUrl?: string;
  imagePublicId?: string;
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  showOverlayText?: boolean;
  isMutedDefault?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

