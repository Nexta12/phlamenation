import { describe, it, expect, beforeEach } from "vitest";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Track } from "@/types";

const mockTrack1: Track = {
  _id: "t1",
  title: "Overload",
  artist: { _id: "a1", name: "Phlame Star", slug: "phlame-star", status: "active", createdAt: "2026-01-01" },
  audioFile: { url: "https://example.com/audio1.mp3", duration: 180 },
  streamCount: 100,
  downloadCount: 20,
  releaseDate: "2026-01-01",
  isSingle: true,
  isDownloadable: true,
  createdAt: "2026-01-01",
};

const mockTrack2: Track = {
  _id: "t2",
  title: "Aura",
  artist: { _id: "a2", name: "Diva", slug: "diva", status: "active", createdAt: "2026-01-01" },
  audioFile: { url: "https://example.com/audio2.mp3", duration: 200 },
  streamCount: 50,
  downloadCount: 5,
  releaseDate: "2026-02-01",
  isSingle: true,
  isDownloadable: true,
  createdAt: "2026-02-01",
};

describe("usePlayerStore", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentTrack: null,
      isPlaying: false,
      volume: 0.8,
      queue: [],
      queueIndex: -1,
      progress: 0,
      duration: 0,
    });
  });

  it("plays a track and updates currentTrack and isPlaying", () => {
    usePlayerStore.getState().playTrack(mockTrack1, [mockTrack1, mockTrack2]);
    const state = usePlayerStore.getState();
    expect(state.currentTrack?._id).toBe("t1");
    expect(state.isPlaying).toBe(true);
    expect(state.queue.length).toBe(2);
    expect(state.queueIndex).toBe(0);
  });

  it("toggles play state between true and false", () => {
    usePlayerStore.getState().playTrack(mockTrack1);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);

    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it("navigates forward and backward in playlist queue", () => {
    usePlayerStore.getState().playTrack(mockTrack1, [mockTrack1, mockTrack2]);
    expect(usePlayerStore.getState().queueIndex).toBe(0);

    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().currentTrack?._id).toBe("t2");
    expect(usePlayerStore.getState().queueIndex).toBe(1);

    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState().currentTrack?._id).toBe("t1");
    expect(usePlayerStore.getState().queueIndex).toBe(0);
  });

  it("updates volume within bounded limits", () => {
    usePlayerStore.getState().setVolume(0.5);
    expect(usePlayerStore.getState().volume).toBe(0.5);
  });
});
