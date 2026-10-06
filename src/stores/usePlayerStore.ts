import { create } from "zustand";
import { Track } from "@/types";
import api from "@/services/api";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  queueIndex: number;
  volume: number;
  progress: number;
  duration: number;
  audioRef: HTMLAudioElement | null;

  setAudioRef: (ref: HTMLAudioElement | null) => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  setDuration: (dur: number) => void;
  downloadCurrentTrack: () => Promise<void>;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  queueIndex: 0,
  volume: 0.8,
  progress: 0,
  duration: 0,
  audioRef: null,

  setAudioRef: (ref) => set({ audioRef: ref }),

  playTrack: (track, newQueue) => {
    const queue = newQueue || get().queue;
    const existingIndex = queue.findIndex((t) => t._id === track._id);
    const updatedQueue = existingIndex >= 0 ? queue : [...queue, track];
    const index = existingIndex >= 0 ? existingIndex : updatedQueue.length - 1;

    set({
      currentTrack: track,
      isPlaying: true,
      queue: updatedQueue,
      queueIndex: index,
      progress: 0,
    });

    // Record stream asynchronously to backend
    if (track._id) {
      api.post(`/tracks/${track._id}/stream`).catch(() => {});
    }

    const audio = get().audioRef;
    const audioUrl = track.audioFile?.url || track.audioFile?.secure_url || "";
    if (audio && audioUrl) {
      audio.src = audioUrl;
      audio.play().catch(() => {});
    }
  },

  togglePlay: () => {
    const { isPlaying, audioRef, currentTrack } = get();
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef?.pause();
      set({ isPlaying: false });
    } else {
      audioRef?.play().catch(() => {});
      set({ isPlaying: true });
    }
  },

  pause: () => {
    get().audioRef?.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    get().audioRef?.play().catch(() => {});
    set({ isPlaying: true });
  },

  next: () => {
    const { queue, queueIndex, playTrack } = get();
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  },

  prev: () => {
    const { queue, queueIndex, playTrack } = get();
    if (queue.length === 0) return;
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  },

  setVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    const audio = get().audioRef;
    if (audio) audio.volume = clamped;
    set({ volume: clamped });
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  downloadCurrentTrack: async () => {
    const track = get().currentTrack;
    if (!track || !track._id) return;

    try {
      const res = await api.post<{ downloadUrl: string; title: string }>(
        `/tracks/${track._id}/download`
      );
      if (res.data?.downloadUrl) {
        const link = document.createElement("a");
        link.href = res.data.downloadUrl;
        link.setAttribute("download", `${res.data.title || "track"}.mp3`);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error("Failed to download track:", err);
    }
  },

  closePlayer: () => {
    const audio = get().audioRef;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    set({
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    });
  },
}));

export default usePlayerStore;
