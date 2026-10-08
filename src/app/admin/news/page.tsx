"use client";

import { useEffect, useState } from "react";
import { newsService } from "@/services/api";
import { NewsArticle } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { useConfirmDialog } from "@/stores/useConfirmStore";
import { Plus, Newspaper, Trash2, Zap, Calendar, ExternalLink, Pencil } from "lucide-react";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { addToast } = useUIStore();
  const { confirmDelete } = useConfirmDialog();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "announcement",
    isFlash: false,
    flashText: "",
    status: "published",
    tags: "music, label, release",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit Modal State
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "announcement",
    isFlash: false,
    flashText: "",
    status: "published",
    tags: "music, label, release",
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await newsService.getNews();
      if (res.data) setArticles(res.data);
    } catch (err) {
      console.error("Failed to load news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("summary", formData.summary.trim());
      data.append("content", formData.content.trim());
      data.append("category", formData.category);
      data.append("isFlash", String(formData.isFlash));
      data.append("flashText", formData.flashText);
      data.append("status", formData.status);
      data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim())));
      if (imageFile) {
        data.append("coverImage", imageFile);
        data.append("featuredImage", imageFile);
      }

      await newsService.createNews(data);
      addToast({
        title: "Dispatch Published",
        message: `${formData.title} is now live on the public newsroom.`,
        type: "success",
      });
      setIsModalOpen(false);
      setFormData({
        title: "",
        summary: "",
        content: "",
        category: "announcement",
        isFlash: false,
        flashText: "",
        status: "published",
        tags: "music, label, release",
      });
      setImageFile(null);
      loadNews();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.map((e: any) => `${e.field ? e.field + ": " : ""}${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Failed to publish news dispatch.";
      addToast({
        title: "Publication Error",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setEditFormData({
      title: article.title || "",
      summary: article.summary || "",
      content: article.content || "",
      category: article.category || "announcement",
      isFlash: Boolean(article.isFlash),
      flashText: article.flashText || "",
      status: article.status || "published",
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags || "music, label",
    });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", editFormData.title.trim());
      data.append("summary", editFormData.summary.trim());
      data.append("content", editFormData.content.trim());
      data.append("category", editFormData.category);
      data.append("isFlash", String(editFormData.isFlash));
      data.append("flashText", editFormData.flashText);
      data.append("status", editFormData.status);
      data.append("tags", JSON.stringify(editFormData.tags.split(",").map((t) => t.trim())));
      if (editImageFile) {
        data.append("coverImage", editImageFile);
        data.append("featuredImage", editImageFile);
      }

      await newsService.updateNews(editingArticle._id, data);
      addToast({
        title: "Dispatch Updated",
        message: `${editFormData.title} updated successfully.`,
        type: "success",
      });
      setIsEditModalOpen(false);
      setEditingArticle(null);
      setEditImageFile(null);
      loadNews();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.map((e: any) => `${e.field ? e.field + ": " : ""}${e.message}`).join(", ") ||
        err.response?.data?.message ||
        "Failed to update news dispatch.";
      addToast({
        title: "Update Error",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const targetArticle = articles.find((a) => a._id === id);
    const confirmed = await confirmDelete({
      title: "Delete Dispatch",
      itemName: targetArticle?.title,
      message: "Are you sure you want to delete and unpublish this news dispatch?",
      confirmText: "Delete Dispatch",
    });
    if (!confirmed) return;
    try {
      setIsDeleting(id);
      await newsService.deleteNews(id);
      addToast({ title: "Article Removed", message: "Dispatch deleted.", type: "success" });
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete article.", type: "error" });
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
            News & <span className="text-primary">Dispatches</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Press releases.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Dispatch
        </Button>
      </div>

      {/* Articles Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Headline</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Flash Ticker</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {articles.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white max-w-sm">
                      <div className="truncate">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground font-normal truncate mt-0.5">
                        {item.summary || item.content.slice(0, 80) + "..."}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {(item.category || "general").replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {item.isFlash ? (
                        <span className="inline-flex items-center text-red-400 text-[11px] font-bold">
                          <Zap className="w-3.5 h-3.5 mr-1 fill-red-400" />
                          Live on Ticker
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={item.status === "published" ? "gold" : "default"}
                        className="uppercase text-[10px]"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">
                      {new Date(item.publishedAt || item.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Dispatch"
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={isDeleting === item._id}
                          title="Delete Dispatch"
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
            <Newspaper className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">No Dispatches Written</h3>
            <p className="text-xs text-muted-foreground mt-1">Publish breaking label announcements and tour updates.</p>
          </div>
        )}
      </div>

      {/* Author Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Update"
        size="lg"
      >
        <form onSubmit={handleCreateArticle} className="space-y-4">
          <Input
            label="Headline"
            placeholder="Drop headline"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Article Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { label: "Official Announcement", value: "announcement" },
                { label: "Press Release", value: "press_release" },
                { label: "Tour & Show News", value: "tour" },
                { label: "Executive Interview", value: "interview" },
                { label: "General News", value: "general" },
              ]}
            />
            <Select
              label="Publication State"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { label: "Publish Immediately", value: "published" },
                { label: "Save As Draft", value: "draft" },
              ]}
            />
          </div>

          <Input
            label="Brief Summary / Teaser (Optional)"
            placeholder="1-2 sentences for social shares and previews..."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Featured Header Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Article Content
            </label>
            <textarea
              rows={6}
              required
              placeholder="Write the full news story..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Ticker Checkbox */}
          <div className="p-4 bg-background/50 border border-border rounded-xl">
            <label className="flex items-center text-xs font-bold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFlash}
                onChange={(e) => setFormData({ ...formData, isFlash: e.target.checked })}
                className="mr-2 accent-primary"
              />
              Broadcast in Top Header Scrolling Marquee
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Publishing..." : "Submit Dispatch"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Dispatch"
        size="lg"
      >
        <form onSubmit={handleUpdateArticle} className="space-y-4">
          <Input
            label="Headline"
            placeholder="Drop headline"
            required
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Article Category"
              value={editFormData.category}
              onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
              options={[
                { label: "Official Announcement", value: "announcement" },
                { label: "Press Release", value: "press_release" },
                { label: "Tour & Show News", value: "tour" },
                { label: "Executive Interview", value: "interview" },
                { label: "General News", value: "general" },
              ]}
            />
            <Select
              label="Publication State"
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              options={[
                { label: "Publish Immediately", value: "published" },
                { label: "Save As Draft", value: "draft" },
              ]}
            />
          </div>

          <Input
            label="Brief Summary / Teaser (Optional)"
            placeholder="1-2 sentences for social shares and previews..."
            value={editFormData.summary}
            onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Change Header Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-white file:border file:border-border hover:file:bg-white/10 cursor-pointer bg-background border border-border rounded-xl p-2"
            />
            {editingArticle?.coverImage?.url && !editImageFile && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Current header image is active. Select a new file above to replace it.
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Article Content
            </label>
            <textarea
              rows={6}
              required
              placeholder="Write the full news story..."
              value={editFormData.content}
              onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Ticker Checkbox */}
          <div className="p-4 bg-background/50 border border-border rounded-xl">
            <label className="flex items-center text-xs font-bold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={editFormData.isFlash}
                onChange={(e) => setEditFormData({ ...editFormData, isFlash: e.target.checked })}
                className="mr-2 accent-primary"
              />
              Broadcast in Top Header Scrolling Marquee
            </label>
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
