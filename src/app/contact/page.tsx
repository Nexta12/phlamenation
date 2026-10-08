"use client";

import { useState } from "react";
import { contactService } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useUIStore } from "@/stores/useUIStore";
import { Mail, Phone, MapPin, Send, CheckCircle2, } from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useUIStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "general",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await contactService.submitMessage(form);
      setSubmitted(true);
      addToast({
        title: "Message Delivered",
        message: "Your inquiry has been routed to the appropriate label department.",
        type: "success",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        type: "general",
        message: "",
      });
    } catch (err: any) {
      addToast({
        title: "Submission Error",
        message: err.response?.data?.message || "Could not send message. Please verify your fields.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="relative py-24 bg-surface border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">Get In Touch</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
            Executive <span className="text-primary">Contact</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg font-light leading-relaxed">
            Inquiries regarding artist bookings, global distribution partnerships, press access, and demo evaluations.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Headquarters & Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Office Locations </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Phlame Nation operates production hubs across key cultural music capitals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-surface border border-border rounded-2xl flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lagos, Nigeria</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lekki, Lagos, Nigeria
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">+234 701 421 4883</p>
                </div>
              </div>

              <div className="p-6 bg-surface border border-border rounded-2xl flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Miami, FLorida, USA</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Miami, FLorida, USA
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">+1 (954) 298-2766</p>
                </div>
              </div>
              <div className="p-6 bg-surface border border-border rounded-2xl flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">California, USA</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    California, USA
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">+1 (954) 298-2766</p>
                </div>
              </div>

              <div className="p-6 bg-surface border border-border rounded-2xl flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Inquiries</h3>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p><span className="text-zinc-400 font-semibold">Email:</span> info@phlamenation.com</p>
                  </div>
                </div>
              </div>
            </div>

          
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
              {submitted ? (
                <div className="py-16 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
                    Thank you for reaching out to Phlame Nation. A dedicated label representative will review your message and reply via email shortly.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-border pb-4 mb-2">
                    <h3 className="text-xl font-bold text-white">Drop A Message</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number (Optional)"
                      placeholder=""
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <Select
                      label="Inquiry Type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      options={[
                        { label: "General Inquiry", value: "general" },
                        { label: "Artist Booking", value: "booking" },
                        { label: "Press / Media Accreditation", value: "press" },
                        { label: "A&R Demo Submission", value: "demo_submission" },
                        { label: "Brand Sponsorship & Sync", value: "sponsorship" },
                      ]}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="Write your subject here..."
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">

                    <div className="flex items-center text-xs text-muted-foreground">
                     
                    </div>

                    <Button variant="primary" type="submit" disabled={submitting}>
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
