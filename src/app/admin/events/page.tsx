"use client";

import { useEffect, useState } from "react";
import { eventService, artistService } from "@/services/api";
import { EventItem, Artist } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { Plus, Calendar, MapPin, Trash2, ExternalLink, Ticket, Users, TrendingUp, Pencil } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showRequests, setShowRequests] = useState<any[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeTab, setActiveTab] = useState<"tours" | "demands">("tours");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    venue: "",
    city: "",
    country: "",
    eventDate: "",
    ticketUrl: "",
    status: "upcoming",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    artistId: "",
    venue: "",
    city: "",
    country: "",
    eventDate: "",
    ticketUrl: "",
    status: "upcoming",
  });
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, artistsRes, requestsRes] = await Promise.allSettled([
        eventService.getEvents(),
        artistService.getArtists(),
        eventService.getShowRequests(),
      ]);

      if (eventsRes.status === "fulfilled" && eventsRes.value.data) {
        setEvents(eventsRes.value.data);
      }
      if (artistsRes.status === "fulfilled" && artistsRes.value.data) {
        setArtists(artistsRes.value.data);
      }
      if (requestsRes.status === "fulfilled" && requestsRes.value.data) {
        setShowRequests(requestsRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load events data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      if (formData.artistId) {
        data.append("artist", formData.artistId);
        data.append("artists", formData.artistId);
      }
      data.append("venue", formData.venue.trim());
      data.append("city", formData.city.trim());
      data.append("country", formData.country.trim());
      data.append("date", formData.eventDate);
      data.append("eventDate", formData.eventDate);
      if (formData.ticketUrl.trim()) {
        data.append("ticketUrl", formData.ticketUrl.trim());
      }
      data.append("status", formData.status);
      data.append("ticketStatus", formData.status === "upcoming" ? "available" : formData.status);
      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await eventService.createEvent(data);
      addToast({
        title: "Event Scheduled",
        message: `${formData.title} has been published successfully.`,
        type: "success",
      });
      setIsModalOpen(false);
      setCoverImage(null);
      setFormData({
        title: "",
        artistId: "",
        venue: "",
        city: "",
        country: "",
        eventDate: "",
        ticketUrl: "",
        status: "upcoming",
      });
      loadData();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.map((e: any) => `${e.field ? e.field + ": " : ""}${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Could not schedule event.";
      addToast({
        title: "Scheduling Failed",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    let formattedDate = "";
    const rawDate = (evt as any).eventDate || evt.date;
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        const tzOffset = d.getTimezoneOffset() * 60000;
        formattedDate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      } catch {
        formattedDate = "";
      }
    }

    const artistId =
      (evt.artists && Array.isArray(evt.artists) && evt.artists.length > 0 && typeof evt.artists[0] === "object"
        ? (evt.artists[0] as any)._id
        : typeof evt.artists?.[0] === "string"
        ? evt.artists[0]
        : (evt as any).artist?._id || "") || "";

    setEditFormData({
      title: evt.title || "",
      artistId,
      venue: evt.venue || "",
      city: evt.city || "",
      country: evt.country || "",
      eventDate: formattedDate,
      ticketUrl: evt.ticketUrl || "",
      status: (evt as any).status || (evt as any).ticketStatus || "upcoming",
    });
    setEditCoverImage(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", editFormData.title.trim());
      if (editFormData.artistId) {
        data.append("artist", editFormData.artistId);
        data.append("artists", editFormData.artistId);
      }
      data.append("venue", editFormData.venue.trim());
      data.append("city", editFormData.city.trim());
      data.append("country", editFormData.country.trim());
      if (editFormData.eventDate) {
        data.append("date", editFormData.eventDate);
        data.append("eventDate", editFormData.eventDate);
      }
      data.append("ticketUrl", editFormData.ticketUrl.trim());
      data.append("status", editFormData.status);
      data.append("ticketStatus", editFormData.status === "upcoming" ? "available" : editFormData.status);
      if (editCoverImage) {
        data.append("coverImage", editCoverImage);
      }

      await eventService.updateEvent(editingEvent._id, data);
      addToast({
        title: "Event Updated",
        message: `${editFormData.title} updated successfully.`,
        type: "success",
      });
      setIsEditModalOpen(false);
      setEditingEvent(null);
      setEditCoverImage(null);
      loadData();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.map((e: any) => `${e.field ? e.field + ": " : ""}${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Could not update event.";
      addToast({
        title: "Update Failed",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and remove this tour date?")) return;
    try {
      setIsDeleting(id);
      await eventService.deleteEvent(id);
      addToast({ title: "Event Removed", message: "Tour date deleted.", type: "success" });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete event.", type: "error" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Tour & Live <span className="text-primary">Engagements</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Global tour stops, ticketing links, and crowdsourced fan city demands.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-surface border border-border p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("tours")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "tours" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
            >
              Tour Dates ({events.length})
            </button>
            <button
              onClick={() => setActiveTab("demands")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "demands" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
            >
              Fan City Demands ({showRequests.length})
            </button>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Tour Date
          </Button>
        </div>
      </div>

      {activeTab === "tours" ? (
        /* Tours Table */
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Event & Headliner</th>
                    <th className="py-3.5 px-4">Venue & City</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tickets</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {events.map((evt) => (
                    <tr key={evt._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        <div className="text-sm">{evt.title}</div>
                        <div className="text-xs text-primary font-normal">{evt.artist?.name || "All Stars"}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-primary mr-1 shrink-0" />
                          <span>{evt.venue} — {evt.city}, {evt.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                          <span>{new Date(evt.eventDate || evt.date || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            evt.status === "upcoming"
                              ? "gold"
                              : evt.status === "sold_out"
                              ? "destructive"
                              : "default"
                          }
                          className="uppercase text-[10px]"
                        >
                          {(evt.status || "upcoming").replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {evt.ticketUrl ? (
                          <a
                            href={evt.ticketUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-primary hover:underline font-semibold"
                          >
                            <Ticket className="w-3.5 h-3.5 mr-1" />
                            Live Link
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic">No link</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            title="Edit Event Details"
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(evt._id)}
                            disabled={isDeleting === evt._id}
                            title="Delete Event"
                            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
              <h3 className="text-base font-bold text-white">No Tour Dates Scheduled</h3>
              <p className="text-xs text-muted-foreground mt-1">Publish upcoming concert or festival bookings.</p>
            </div>
          )}
        </div>
      ) : (
        /* Fan City Requests Demands */
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-background/50 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-zinc-300">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Crowdsourced City Touring Intelligence</span>
            </div>
            <span className="text-xs text-muted-foreground">Sorted by fan demand</span>
          </div>

          {showRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Target City & Country</th>
                    <th className="py-3.5 px-4">Requested Artist</th>
                    <th className="py-3.5 px-4">Requester Email</th>
                    <th className="py-3.5 px-4 text-right">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {showRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-primary mr-1.5" />
                          <span>{req.city}, {req.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-primary font-semibold">
                        {req.artist?.name || "Any Phlame Act"}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {req.email}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
              <h3 className="text-base font-bold text-white">No Fan Demands Submitted Yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Fan submissions from the "Request A Show" modal will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Event / Live Tour Date"
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Tour / Event Title"
            placeholder="Enter Event Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Headlining Artist"
              required
              value={formData.artistId}
              onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
              options={[
                { label: "Select Artist", value: "" },
                ...artists.map((a) => ({ label: a.name, value: a._id })),
              ]}
            />

            <Input
              label="Venue"
              placeholder="e.g. The O2 Arena"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="e.g. London"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="e.g. United Kingdom"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Date & Time"
              type="datetime-local"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
            <Select
              label="Booking Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { label: "Upcoming / On Sale", value: "upcoming" },
                { label: "Sold Out", value: "sold_out" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />
          </div>

          <Input
            label="Ticket Purchase URL"
            placeholder="https://ticketmaster.com/..."
            value={formData.ticketUrl}
            onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Event Poster / Cover Picture (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white hover:file:bg-white/10 file:cursor-pointer cursor-pointer border border-border rounded-xl p-1 bg-surface/50"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Schedule Tour Date"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Event / Tour Details"
        size="lg"
      >
        <form onSubmit={handleUpdateEvent} className="space-y-4">
          <Input
            label="Tour / Event Title"
            placeholder="Enter Event Title"
            required
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Headlining Artist"
              value={editFormData.artistId}
              onChange={(e) => setEditFormData({ ...editFormData, artistId: e.target.value })}
              options={[
                { label: "Select Artist", value: "" },
                ...artists.map((a) => ({ label: a.name, value: a._id })),
              ]}
            />

            <Input
              label="Venue"
              placeholder="e.g. The O2 Arena"
              required
              value={editFormData.venue}
              onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="e.g. London"
              required
              value={editFormData.city}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="e.g. United Kingdom"
              required
              value={editFormData.country}
              onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Date & Time"
              type="datetime-local"
              required
              value={editFormData.eventDate}
              onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })}
            />
            <Select
              label="Booking Status"
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              options={[
                { label: "Upcoming / On Sale", value: "upcoming" },
                { label: "Sold Out", value: "sold_out" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />
          </div>

          <Input
            label="Ticket Purchase URL"
            placeholder="https://ticketmaster.com/..."
            value={editFormData.ticketUrl}
            onChange={(e) => setEditFormData({ ...editFormData, ticketUrl: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Change Poster / Cover Picture (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditCoverImage(e.target.files?.[0] || null)}
              className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white hover:file:bg-white/10 file:cursor-pointer cursor-pointer border border-border rounded-xl p-1 bg-surface/50"
            />
            {editingEvent?.coverImage?.url && !editCoverImage && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Current cover photo is active. Select a new file above to replace it.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
