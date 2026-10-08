"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/api";
import { User, UserRole } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import {
  Users,
  UserCheck,
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const { addToast } = useUIStore();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as UserRole,
    isVerified: true,
  });

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
      addToast({
        title: "Error Loading Users",
        message: err.response?.data?.message || "Failed to fetch user list.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "editor",
      isVerified: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (target: User) => {
    setEditingUser(target);
    setFormData({
      fullName: target.fullName || target.name || "",
      email: target.email,
      password: "",
      role: target.role,
      isVerified: target.isVerified ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (editingUser) {
        const payload: any = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          isVerified: formData.isVerified,
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }

        const id = editingUser._id || editingUser.id;
        if (!id) throw new Error("User ID is missing");

        await userService.updateUser(id, payload);
        addToast({
          title: "User Updated",
          message: `${formData.fullName} was updated successfully.`,
          type: "success",
        });
      } else {
        if (!formData.password || formData.password.length < 6) {
          addToast({
            title: "Validation Error",
            message: "Password must be at least 6 characters.",
            type: "error",
          });
          setSubmitting(false);
          return;
        }

        await userService.createUser(formData);
        addToast({
          title: "User Created",
          message: `Account for ${formData.fullName} created successfully.`,
          type: "success",
        });
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      addToast({
        title: editingUser ? "Update Failed" : "Creation Failed",
        message: err.response?.data?.message || err.message || "An error occurred.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const id = userToDelete._id || userToDelete.id;
    if (!id) return;

    try {
      setDeleting(true);
      await userService.deleteUser(id);
      addToast({
        title: "User Deleted",
        message: `Account has been removed successfully.`,
        type: "success",
      });
      setUserToDelete(null);
      loadUsers();
    } catch (err: any) {
      addToast({
        title: "Delete Failed",
        message: err.response?.data?.message || "Failed to delete user.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filter out any superAdmin on client side as an extra safeguard
  const visibleUsers = users.filter((u) => u.role !== "superAdmin");

  // Metrics Calculation
  const totalUsers = visibleUsers.length;
  const adminCount = visibleUsers.filter((u) => u.role === "admin").length;
  const editorCount = visibleUsers.filter((u) => u.role === "editor").length;
  const membersCount = visibleUsers.filter((u) => u.role === "user").length;

  // Filtered list
  const filteredUsers = visibleUsers.filter((u) => {
    const matchesSearch =
      (u.fullName || u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superAdmin":
      case "admin":
        return "warning";
      case "editor":
        return "default";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superAdmin":
      case "admin":
        return "Admin";
      case "editor":
        return "Editor";
      default:
        return "Member";
    }
  };

  const isCurrentLoggedInUser = (u: User) => {
    const currentId = currentUser?._id || (currentUser as any)?.id;
    const targetId = u._id || u.id;
    return currentId && targetId && currentId.toString() === targetId.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Users
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage team member credentials, role permissions, and executive administration.
          </p>
        </div>

        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Users</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{loading ? "..." : totalUsers}</p>
          <span className="text-[10px] text-muted-foreground">All Registered Accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Administrators</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {loading ? "..." : adminCount}
          </p>
          <span className="text-[10px] text-muted-foreground">Executive Staff</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Content Editors</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{loading ? "..." : editorCount}</p>
          <span className="text-[10px] text-muted-foreground">Media & News Editors</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Standard Members</span>
            <UserCheck className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{loading ? "..." : membersCount}</p>
          <span className="text-[10px] text-muted-foreground">Public Authenticated</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: "All Roles", value: "all" },
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Member", value: "user" },
          ].map((tab) => {
            const isActive = selectedRole === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedRole(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-black font-bold shadow-sm"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Users Found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {search || selectedRole !== "all"
                ? "No accounts match your current filters."
                : "No user accounts registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground border-collapse">
              <thead className="bg-[#121217] text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-semibold">
                <tr>
                  <th className="py-3.5 px-6">User Account</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((u) => {
                  const displayName = u.fullName || u.name || "User";
                  const initial = displayName.charAt(0).toUpperCase();
                  const isCurrent = isCurrentLoggedInUser(u);
                  // const isRoot = isRootSuperAdmin(u);

                  return (
                    <tr
                      key={u._id || u.id || u.email}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white truncate">{displayName}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-primary/20 text-primary font-bold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground block truncate">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                          {getRoleLabel(u.role)}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        {u.isVerified !== false ? (
                          <span className="inline-flex items-center gap-1.5 text-green-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-400 text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-muted-foreground whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Legacy"}
                      </td>

                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrent
                                ? "text-zinc-600 cursor-not-allowed"
                                : "hover:bg-red-500/20 text-muted-foreground hover:text-red-400 cursor-pointer"
                            }`}
                            title={
                              isCurrent
                                ? "Cannot delete your own account"
                                : "Delete User"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Account" : "Add New User Account"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Samuel Adekunle"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            icon={<UserIcon className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. samuel@phlamenation.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
          />

          <Select
            label="Role Assignment"
            value={formData.role === "superAdmin" ? "admin" : formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { label: "Member (Standard User)", value: "user" },
              { label: "Editor (Content & News)", value: "editor" },
              { label: "Admin (Executive Operations)", value: "admin" },
            ]}
          />

          <Input
            label={editingUser ? "Reset Password (leave blank to keep current)" : "Password"}
            type="password"
            placeholder={editingUser ? "••••••••" : "Minimum 6 characters"}
            required={!editingUser}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="p-3 bg-background/50 border border-border rounded-xl">
            <label className="flex items-center text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="mr-2.5 accent-primary w-4 h-4 rounded"
              />
              Account Verified (Authorized to Login immediately)
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting
                ? editingUser
                  ? "Saving..."
                  : "Creating..."
                : editingUser
                ? "Save Changes"
                : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Confirm User Deletion"
        itemName={userToDelete ? `${userToDelete.fullName || userToDelete.name} (${userToDelete.email})` : undefined}
        message="Are you sure you want to permanently delete this user? This will revoke all portal access and permissions immediately. This action cannot be undone."
        confirmText="Permanently Delete"
        isLoading={deleting}
      />
    </div>
  );
}
