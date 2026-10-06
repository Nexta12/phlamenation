"use client";

import { useEffect, useState } from "react";
import { studioService } from "@/services/api";
import { StudioRoom } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { Mic, Headphones, Music2, Clock, Calendar, CheckCircle2, Sliders, ShieldCheck } from "lucide-react";

export default function StudiosPage() {
  const [rooms, setRooms] = useState<StudioRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<StudioRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { addToast } = useUIStore();

  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    producerName: "",
    projectDescription: "",
    requestedDate: "",
    sessionHours: "4",
  });

  useEffect(() => {
    async function loadRooms() {
      try {
        setLoading(true);
        const res = await studioService.getRooms();
        if (res.data) setRooms(res.data);
      } catch (err) {
        console.error("Failed to load studio rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  const openBooking = (room: StudioRoom) => {
    setSelectedRoom(room);
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      setSubmitting(true);
      await studioService.bookSession({
        studioRoom: selectedRoom._id,
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        producerName: bookingForm.producerName,
        projectDescription: bookingForm.projectDescription,
        requestedDate: bookingForm.requestedDate,
        sessionHours: parseInt(bookingForm.sessionHours, 10) || 4,
      });

      setSuccess(true);
      addToast({
        title: "Session Requested",
        message: "Our studio management team will review and confirm availability within 24 hours.",
        type: "success",
      });
      setBookingForm({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        producerName: "",
        projectDescription: "",
        requestedDate: "",
        sessionHours: "4",
      });
    } catch (err: any) {
      addToast({
        title: "Booking Failed",
        message: err.response?.data?.message || "Failed to submit reservation. Please verify your details.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-surface border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Sonic Engineering</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
            Phlame Nation <span className="text-primary">Sound Labs</span>
          </h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg sm:text-xl font-light leading-relaxed">
            World-class analog warmth combined with cutting-edge Dolby Atmos acoustics. Our suites have engineered global multi-platinum records, chart-topping hits, and soundtrack masterpieces.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Recording & Production Suites</h2>
            <p className="text-muted-foreground text-sm">Select an acoustic space to view outboard hardware and book studio time.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-surface/50 border border-border animate-pulse" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="group relative flex flex-col bg-surface border border-border hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0].secure_url}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface/80 text-muted-foreground">
                      <Mic className="w-12 h-12 mb-2 text-primary/40" />
                      <span className="text-xs uppercase tracking-wider font-semibold">Phlame Sound Lab</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold" className="backdrop-blur-md">
                      {room.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  {room.hourlyRate ? (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">
                      ${room.hourlyRate}/hr
                    </div>
                  ) : null}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                      {room.description || "Fully isolated acoustic control room equipped with premium microphone lockers, outboard Neve preamps, and SSL console summing."}
                    </p>

                    {room.features && room.features.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-1.5">
                        {room.features.slice(0, 4).map((f, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[11px] font-medium bg-black/40 border border-white/5 px-2.5 py-1 rounded-md text-zinc-300"
                          >
                            <Sliders className="w-3 h-3 text-primary mr-1.5" />
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => openBooking(room)}
                    variant="primary"
                    className="w-full"
                  >
                    Reserve Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-surface/30 border border-border/50 rounded-2xl">
            <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Studio Rooms Being Configured</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Our live recording suites and mastering facilities are currently taking bespoke executive reservations. Contact our management office directly.
            </p>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRoom ? `Book Session: ${selectedRoom.name}` : "Studio Reservation"}
        size="lg"
      >
        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Reservation Request Received</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Thank you for choosing Phlame Nation Studios. An audio engineer and booking coordinator will confirm your session timetable and gear rider via email.
            </p>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your Full Name"
                placeholder="e.g. David Adeleke"
                required
                value={bookingForm.clientName}
                onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="artist@example.com"
                required
                value={bookingForm.clientEmail}
                onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+234 801 234 5678"
                required
                value={bookingForm.clientPhone}
                onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
              />
              <Input
                label="Assigned Producer / Engineer (Optional)"
                placeholder="e.g. Masterkraft, Sarz, Self"
                value={bookingForm.producerName}
                onChange={(e) => setBookingForm({ ...bookingForm, producerName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred Date & Time"
                type="datetime-local"
                required
                value={bookingForm.requestedDate}
                onChange={(e) => setBookingForm({ ...bookingForm, requestedDate: e.target.value })}
              />
              <Select
                label="Estimated Session Hours"
                value={bookingForm.sessionHours}
                onChange={(e) => setBookingForm({ ...bookingForm, sessionHours: e.target.value })}
                options={[
                  { label: "2 Hours (Vocal Demo / Tracking)", value: "2" },
                  { label: "4 Hours (Half Day Session)", value: "4" },
                  { label: "8 Hours (Full Day Production)", value: "8" },
                  { label: "12 Hours (Lockout / EP Sprint)", value: "12" },
                ]}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Project Scope & Technical Rider
              </label>
              <textarea
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                placeholder="Describe your session goals (tracking vocals, live drums, mix review, Dolby Atmos stem delivery, instruments needed)..."
                required
                value={bookingForm.projectDescription}
                onChange={(e) => setBookingForm({ ...bookingForm, projectDescription: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-1 text-primary" />
                <span>Zero upfront charge until schedule is approved</span>
              </div>
              <div className="flex space-x-3">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Reservation"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
