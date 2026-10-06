"use client";

import { useEffect, useState } from "react";
import { studioService } from "@/services/api";
import { StudioBooking, StudioRoom } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { Mic, Calendar, User, Mail, Phone, Clock, CheckCircle, XCircle } from "lucide-react";

export default function AdminStudiosPage() {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [rooms, setRooms] = useState<StudioRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<StudioBooking | null>(null);
  const [status, setStatus] = useState<string>("confirmed");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const { addToast } = useUIStore();

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes] = await Promise.all([
        studioService.getBookings(),
        studioService.getRooms(),
      ]);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (roomsRes.data) setRooms(roomsRes.data);
    } catch (err) {
      console.error("Failed to load studio bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openUpdateModal = (b: StudioBooking) => {
    setSelectedBooking(b);
    setStatus(b.status || "confirmed");
    setAdminNotes(b.adminNotes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      await studioService.updateBookingStatus(selectedBooking._id, {
        status,
        adminNotes,
      });

      addToast({
        title: "Booking Updated",
        message: `Reservation marked as ${status}.`,
        type: "success",
      });
      setSelectedBooking(null);
      loadData();
    } catch (err: any) {
      addToast({
        title: "Update Error",
        message: err.response?.data?.message || "Failed to update reservation.",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Sound Lab <span className="text-primary">Reservations</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review studio booking requests, allocate sound engineers, and update session schedules.
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Client & Contact</th>
                  <th className="py-3.5 px-4">Acoustic Room</th>
                  <th className="py-3.5 px-4">Requested Session</th>
                  <th className="py-3.5 px-4">Scope</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{booking.clientName}</div>
                      <div className="text-[10px] text-muted-foreground font-normal flex items-center space-x-2">
                        <span>{booking.clientEmail}</span>
                        <span>&bull;</span>
                        <span>{booking.clientPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-primary font-bold">
                      {booking.studioRoom?.name || "Main Soundstage"}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      <div>{new Date(booking.requestedDate).toLocaleDateString()}</div>
                      <div className="text-[10px] text-muted-foreground">{booking.sessionHours} Hours Booked</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                      {booking.projectDescription}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "cancelled"
                            ? "destructive"
                            : "gold"
                        }
                        className="uppercase text-[10px]"
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px]"
                        onClick={() => openUpdateModal(booking)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground">
            <Mic className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">No Studio Reservations Yet</h3>
            <p className="text-xs text-muted-foreground mt-1">Public booking requests from artists and producers will appear here.</p>
          </div>
        )}
      </div>

      {/* Update Booking Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Manage Session: ${selectedBooking.clientName}`}
          size="md"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="p-4 bg-background border border-border rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span className="text-white font-bold">{selectedBooking.studioRoom?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-white font-mono">{new Date(selectedBooking.requestedDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hours:</span>
                <span className="text-white">{selectedBooking.sessionHours} hrs</span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <span className="text-muted-foreground block mb-1">Project Description:</span>
                <p className="text-zinc-300 italic">{selectedBooking.projectDescription}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed & Locked</option>
                <option value="completed">Completed Session</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Internal Engineer Notes
              </label>
              <textarea
                rows={3}
                placeholder="Microphones prepared, engineer assigned, payment terms..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={updating}>
                {updating ? "Saving..." : "Update Booking"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
