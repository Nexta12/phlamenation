"use client";

import { useEffect, useState } from "react";
import { widgetService } from "@/services/api";
import { Widget } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { Plus, LayoutTemplate, Trash2, Eye, ExternalLink } from "lucide-react";

export default function AdminWidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    title: "",
    type: "banner",
    content: "",
    ctaText: "",
    ctaLink: "",
    position: "hero_bottom",
    isActive: true,
  });

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const res = await widgetService.getWidgets();
      if (res.data) setWidgets(res.data);
    } catch (err) {
      console.error("Failed to load widgets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWidgets();
  }, []);

  const handleCreateWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("content", formData.content);
      data.append("ctaText", formData.ctaText);
      data.append("ctaLink", formData.ctaLink);
      data.append("position", formData.position);
      data.append("isActive", String(formData.isActive));

      await widgetService.createWidget(data);
      addToast({
        title: "Widget Published",
        message: `${formData.title} promo campaign is now configured.`,
        type: "success",
      });
      setIsModalOpen(false);
      setFormData({
        title: "",
        type: "banner",
        content: "",
        ctaText: "",
        ctaLink: "",
        position: "hero_bottom",
        isActive: true,
      });
      loadWidgets();
    } catch (err: any) {
      addToast({
        title: "Error",
        message: err.response?.data?.message || "Failed to create widget.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo widget?")) return;
    try {
      setIsDeleting(id);
      await widgetService.deleteWidget(id);
      addToast({ title: "Widget Deleted", message: "Widget removed.", type: "success" });
      setWidgets(widgets.filter((w) => w._id !== id));
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete widget.", type: "error" });
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
            Marketing & Promo <span className="text-primary">Widgets</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure dynamic album launch banners, tour alerts, and homepage promotional callouts.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Widget
        </Button>
      </div>

      {/* Widgets Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : widgets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Campaign Title</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Placement</th>
                  <th className="py-3.5 px-4">Call-To-Action</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {widgets.map((w) => (
                  <tr key={w._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{w.title}</div>
                      <div className="text-[10px] text-muted-foreground font-normal truncate max-w-xs">
                        {w.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {(w.type || "banner").replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-mono text-[11px]">
                      {w.position}
                    </td>
                    <td className="py-3 px-4">
                      {w.ctaLink ? (
                        <a
                          href={w.ctaLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-primary font-semibold hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          {w.ctaText || "Visit"}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={w.isActive ? "gold" : "default"} className="uppercase text-[10px]">
                        {w.isActive ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(w._id)}
                        disabled={isDeleting === w._id}
                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">No Promo Widgets Configured</h3>
            <p className="text-xs text-muted-foreground mt-1">Design promotional callouts for album drops and special merchandise.</p>
          </div>
        )}
      </div>

      {/* Create Widget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Marketing Campaign Widget"
        size="md"
      >
        <form onSubmit={handleCreateWidget} className="space-y-4">
          <Input
            label="Campaign / Widget Title"
            placeholder="e.g. Rave & Roses Deluxe Edition Out Now"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Widget Format"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { label: "Promo Banner", value: "banner" },
                { label: "Modal Popup Alert", value: "modal_popup" },
                { label: "Flash Sale Ticker", value: "flash_sale" },
                { label: "Tour Spotlight Alert", value: "tour_alert" },
              ]}
            />
            <Select
              label="Placement Area"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              options={[
                { label: "Hero Bottom Banner", value: "hero_bottom" },
                { label: "Top Notification Bar", value: "top_bar" },
                { label: "Floating Bottom Corner", value: "floating_corner" },
                { label: "Footer Section Banner", value: "footer_banner" },
              ]}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Promotional Content / Pitch
            </label>
            <textarea
              rows={3}
              placeholder="Stream the brand new chart-topping record across all international DSPs."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Button Text (CTA)"
              placeholder="e.g. Listen Now, Buy Tickets"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            />
            <Input
              label="Destination URL"
              placeholder="https://..."
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2 accent-primary"
              />
              Activate Immediately on Public Portal
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Launch Widget"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
