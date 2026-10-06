"use client";

import React from "react";
import { useUIStore } from "@/stores/useUIStore";
import Modal from "@/components/ui/Modal";

export const VideoModal: React.FC = () => {
  const { activeVideoModal, closeVideoModal } = useUIStore();

  if (!activeVideoModal) return null;

  const embedSrc =
    activeVideoModal.embedUrl ||
    (activeVideoModal.youtubeId
      ? `https://www.youtube.com/embed/${activeVideoModal.youtubeId}`
      : "");

  const fullEmbedUrl = embedSrc
    ? `${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1&rel=0`
    : "";

  return (
    <Modal
      isOpen={!!activeVideoModal}
      onClose={closeVideoModal}
      title={activeVideoModal.title}
      size="2xl"
      className="p-5 bg-[#0D0D12] border border-[#242430]"
    >
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#242430]">
        {fullEmbedUrl ? (
          <iframe
            src={fullEmbedUrl}
            title={activeVideoModal.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Unable to stream video. Please verify the YouTube link.
          </div>
        )}
      </div>
      {activeVideoModal.description && (
        <p className="mt-4 text-xs text-[#9D9DAE] leading-relaxed">
          {activeVideoModal.description}
        </p>
      )}
    </Modal>
  );
};

export default VideoModal;
