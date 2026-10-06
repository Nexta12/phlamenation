"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  trackService,
  artistService,
  videoService,
  eventService,
  studioService,
  contactService,
  newsletterService,
} from "@/services/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Music2,
  Users,
  Video,
  Calendar,
  Mic,
  Inbox,
  Mail,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Disc3,
  Clock,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    tracks: 0,
    artists: 0,
    videos: 0,
    events: 0,
    bookings: 0,
    inbox: 0,
    subscribers: 0,
    totalStreams: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [
          tracksRes,
          artistsRes,
          videosRes,
          eventsRes,
          bookingsRes,
          inboxRes,
          subscribersRes,
        ] = await Promise.allSettled([
          trackService.getTracks(),
          artistService.getArtists(),
          videoService.getVideos(),
          eventService.getEvents(),
          studioService.getBookings(),
          contactService.getMessages(),
          newsletterService.getSubscribers(),
        ]);

        const tracks = tracksRes.status === "fulfilled" ? tracksRes.value.data || [] : [];
        const artists = artistsRes.status === "fulfilled" ? artistsRes.value.data || [] : [];
        const videos = videosRes.status === "fulfilled" ? videosRes.value.data || [] : [];
        const events = eventsRes.status === "fulfilled" ? eventsRes.value.data || [] : [];
        const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data || [] : [];
        const inbox = inboxRes.status === "fulfilled" ? inboxRes.value.data || [] : [];
        const subscribers = subscribersRes.status === "fulfilled" ? subscribersRes.value.data || [] : [];

        const totalStreams = tracks.reduce((acc: number, t: any) => acc + (t.streamCount || 0), 0);

        setStats({
          tracks: tracks.length,
          artists: artists.length,
          videos: videos.length,
          events: events.length,
          bookings: bookings.length,
          inbox: inbox.length,
          subscribers: subscribers.length,
          totalStreams,
        });

        setRecentInquiries(inbox.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const kpis = [
    {
      title: "Active Catalogue",
      value: stats.tracks,
      label: "Master Recordings",
      icon: Music2,
      href: "/admin/tracks",
      color: "text-amber-400",
    },
    {
      title: "Signed Roster",
      value: stats.artists,
      label: "Exclusive Artists",
      icon: Users,
      href: "/admin/artists",
      color: "text-blue-400",
    },
    {
      title: "Total Audio Streams",
      value: stats.totalStreams.toLocaleString(),
      label: "Across Platform",
      icon: TrendingUp,
      href: "/admin/tracks",
      color: "text-green-400",
    },
    {
      title: "Visual Releases",
      value: stats.videos,
      label: "Official Videos",
      icon: Video,
      href: "/admin/videos",
      color: "text-purple-400",
    },
    {
      title: "Studio Reservations",
      value: stats.bookings,
      label: "Session Bookings",
      icon: Mic,
      href: "/admin/studios",
      color: "text-primary",
    },
    {
      title: "Unread Inquiries",
      value: stats.inbox,
      label: "Direct Submissions",
      icon: Inbox,
      href: "/admin/contacts",
      color: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid - Two Rows, Narrower Boxes, Smaller Texts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-full">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link key={idx} href={kpi.href}>
              <Card className="hover:border-primary/40 transition-all duration-200 group bg-[#0A0A0D] border border-white/[0.06] rounded-xl shadow-lg">
                <CardContent className="p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {kpi.title}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                      <Icon className={`w-3 h-3 ${kpi.color}`} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-base font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                      {loading ? "..." : kpi.value}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Inquiries & Quick Direct Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0A0A0D] border border-white/[0.06] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Latest Submissions & Inquiries</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Direct communications sent via the public contact portal</p>
            </div>
            <Link href="/admin/contacts">
              <Button variant="ghost" size="sm" className="text-xs text-primary h-8 px-2.5">
                View All &rarr;
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-14 bg-background/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[11px] font-medium">
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentInquiries.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-white">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{item.email}</div>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300 max-w-xs truncate">
                        {item.subject}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {item.type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            item.status === "unread"
                              ? "gold"
                              : item.status === "replied"
                              ? "success"
                              : "default"
                          }
                          className="text-[10px] uppercase"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No recent inquiries logged.
            </div>
          )}
        </div>

        {/* Quick Operations Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A0A0D] border border-white/[0.06] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-white mb-3">Master Operations</h3>
            <div className="space-y-2.5">
              <Link href="/admin/tracks" className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1D24] border border-white/[0.05] hover:border-primary/40 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Disc3 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-white">New Audio</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <Link href="/admin/artists" className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1D24] border border-white/[0.05] hover:border-primary/40 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-white">Add Roster Member</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <Link href="/admin/events" className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1D24] border border-white/[0.05] hover:border-primary/40 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-white">Schedule Tour Date</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <Link href="/admin/studios" className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1D24] border border-white/[0.05] hover:border-primary/40 transition-colors">
                <div className="flex items-center space-x-2.5">
                  <Mic className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-white">Review Studio Bookings</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
