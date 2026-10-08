"use client";

import { useEffect, useState } from "react";
import { contactService } from "@/services/api";
import { ContactMessage } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/stores/useUIStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useConfirmDialog } from "@/stores/useConfirmStore";
import { Inbox, Mail, Phone, Calendar, Trash2, CheckCircle2, MessageSquare } from "lucide-react";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [status, setStatus] = useState<string>("read");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { addToast } = useUIStore();
  const { fetchUnreadCount } = useNotificationStore();
  const { confirmDelete } = useConfirmDialog();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getMessages();
      if (res.data) setMessages(res.data);
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setStatus(msg.status || "read");
    setAdminNotes(msg.adminNotes || "");
    if (msg.status === "unread") {
      try {
        await contactService.getMessage(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m))
        );
        fetchUnreadCount();
      } catch {
        // ignore
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      setUpdating(true);
      await contactService.updateStatus(selectedMessage._id, {
        status: status as any,
        adminNotes,
      });

      addToast({
        title: "Status Updated",
        message: `Inquiry marked as ${status}.`,
        type: "success",
      });
      setSelectedMessage(null);
      loadMessages();
    } catch (err: any) {
      addToast({
        title: "Update Failed",
        message: err.response?.data?.message || "Could not update status.",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const targetMsg = messages.find((m) => m._id === id);
    const confirmed = await confirmDelete({
      title: "Delete Inquiry",
      itemName: targetMsg ? `${targetMsg.name} ("${targetMsg.subject}")` : undefined,
      message: "Are you sure you want to permanently delete this message from the record?",
      confirmText: "Delete Inquiry",
    });
    if (!confirmed) return;
    try {
      setIsDeleting(id);
      await contactService.deleteMessage(id);
      addToast({ title: "Inquiry Deleted", message: "Message removed from inbox.", type: "success" });
      setMessages(messages.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
      fetchUnreadCount();
    } catch (err: any) {
      addToast({ title: "Error", message: err.response?.data?.message || "Could not delete inquiry.", type: "error" });
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
            Inbox <span className="text-primary">Messages</span>
          </h1>
        
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject & Preview</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-white/5 transition-colors cursor-pointer ${
                      msg.status === "unread" ? "bg-primary/5" : ""
                    }`}
                    onClick={() => openMessage(msg)}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{msg.name}</div>
                      <div className="text-[10px] text-muted-foreground font-normal">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-white truncate">{msg.subject}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{msg.message}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {msg.type.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          msg.status === "unread"
                            ? "gold"
                            : msg.status === "replied"
                            ? "success"
                            : "default"
                        }
                        className="uppercase text-[10px]"
                      >
                        {msg.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] mr-2"
                        onClick={() => openMessage(msg)}
                      >
                        View
                      </Button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        disabled={isDeleting === msg._id}
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
            <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-white">Inbox Clean</h3>
            <p className="text-xs text-muted-foreground mt-1">No pending inquiries or communications in the queue.</p>
          </div>
        )}
      </div>

      {/* Message Detail & Triage Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={`Inquiry from ${selectedMessage.name}`}
          size="lg"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="p-4 bg-background border border-border rounded-xl space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Sender</span>
                  <span className="text-white font-bold text-sm">{selectedMessage.name}</span>
                  <span className="text-muted-foreground block">{selectedMessage.email} {selectedMessage.phone ? `(${selectedMessage.phone})` : ""}</span>
                </div>
                <div className="text-right">
                  <Badge variant="gold" className="uppercase text-[10px]">
                    {selectedMessage.type.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-muted-foreground block text-[10px] mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">Subject</span>
                <p className="text-white font-semibold text-sm">{selectedMessage.subject}</p>
              </div>

              <div className="pt-2">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">Message Content</span>
                <div className="bg-surface p-3.5 rounded-lg border border-border/70 text-zinc-200 leading-relaxed text-xs max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read / In Review</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on who handled this reply..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="danger"
                type="button"
                size="sm"
                onClick={() => handleDelete(selectedMessage._id)}
              >
                Delete Message
              </Button>
              <div className="flex space-x-3">
                <Button variant="ghost" type="button" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={updating}>
                  {updating ? "Saving..." : "Update Status"}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
