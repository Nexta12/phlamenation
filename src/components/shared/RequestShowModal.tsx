"use client";

import React, { useState } from "react";
import { useUIStore } from "@/stores/useUIStore";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/services/api";

export const RequestShowModal: React.FC = () => {
  const { activeRequestShowModal, closeRequestShowModal, addToast } = useUIStore();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [fanEmail, setFanEmail] = useState("");
  const [fanName, setFanName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!activeRequestShowModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !country || !fanEmail) return;

    setIsLoading(true);
    try {
      await api.post("/events/request-show", {
        artist: activeRequestShowModal._id,
        city,
        country,
        fanEmail,
        fanName,
      });

      addToast(
        `Demand recorded! We will alert you when ${activeRequestShowModal.stageName} books a show in ${city}.`,
        "success"
      );
      closeRequestShowModal();
      setCity("");
      setCountry("");
      setFanEmail("");
      setFanName("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to submit show request";
      addToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!activeRequestShowModal}
      onClose={closeRequestShowModal}
      title={`Request a Show: ${activeRequestShowModal.stageName}`}
      maxWidth="md"
    >
      <p className="text-xs text-[#9D9DAE] mb-5 leading-relaxed">
        Tell management where you want to see{" "}
        <strong className="text-[#F8F8FA]">{activeRequestShowModal.stageName}</strong> perform next.
        We aggregate fan requests when routing tour stops!
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            placeholder="e.g. London"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <Input
            label="Country"
            placeholder="e.g. United Kingdom"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <Input
          label="Your Email"
          type="email"
          placeholder="your.email@example.com"
          value={fanEmail}
          onChange={(e) => setFanEmail(e.target.value)}
          required
          helperText="We'll notify you if a show is booked in your city."
        />

        <Input
          label="Your Name (Optional)"
          placeholder="Your full name"
          value={fanName}
          onChange={(e) => setFanName(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeRequestShowModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Submit Show Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestShowModal;
