"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Lock, Mail, ArrowRight, ShieldCheck, Flame } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useUIStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      addToast({
        title: "Access Granted",
        message: "Welcome to Phlame Nation Executive Command Center.",
        type: "success",
      });
      router.push("/admin");
    } catch (err: any) {
      addToast({
        title: "Authentication Failed",
        message: err.response?.data?.message || "Invalid email or master security key.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#08080A]">
      {/* Top Left Return to Frontpage */}
   

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-4">
            <div className="relative w-48 sm:w-56 h-14 mx-auto transition-transform group-hover:scale-105">
              <Image
                src="/images/p-logo.png"
                alt="Phlame Nation"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
         
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Login
          </h1>
          
        </div>

        <div className="bg-[#0A0A0D] border border-white/[0.08] rounded-2xl p-7 sm:p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-muted-foreground" />}
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 font-bold"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
