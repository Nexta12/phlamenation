import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Disc3, Mic2, ShieldCheck, ArrowRight, Radio } from "lucide-react";

export const metadata = {
  title: "About Us | Phlame Nation Record Label",
  description:
    "Learn about Phlame Nation, an entertainment powerhouse pioneering modern African sound and global music production.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#08080A] text-[#F8F8FA] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A22] border border-[#E5A93C]/30 text-xs font-semibold text-[#E5A93C] mb-6">
            <Radio className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>ABOUT PHLAME NATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8F8FA] font-heading leading-tight max-w-3xl mb-6">
            Pioneering The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F3C772]">African Sound</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9D9DAE] max-w-2xl leading-relaxed">
            Phlame Nation is a premier music company and creative ecosystem dedicated to discovering, cultivating, and amplifying world-class recording talent on the global stage.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#121217] border border-[#242430] flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] mb-5">
              <Disc3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8F8FA] mb-2">Artistic Vision</h3>
            <p className="text-xs sm:text-sm text-[#9D9DAE] leading-relaxed">
              We provide uncompromised creative freedom and strategic global marketing to turn singular voices into generational icons.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#121217] border border-[#242430] flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] mb-5">
              <Mic2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8F8FA] mb-2">Sonic Engineering</h3>
            <p className="text-xs sm:text-sm text-[#9D9DAE] leading-relaxed">
              Our residential suites—Phlame Sound Labs—house Neve consoles, Dolby Atmos integration, and Grammy-winning sound designers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#121217] border border-[#242430] flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8F8FA] mb-2">Global Reach</h3>
            <p className="text-xs sm:text-sm text-[#9D9DAE] leading-relaxed">
              With international distribution, sync licensing, and live touring networks, we bridge African rhythm with global audiences.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#121217] via-[#16161D] to-[#121217] border border-[#242430] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8F8FA] mb-1">
              Collaborate With Phlame Nation
            </h2>
            <p className="text-xs sm:text-sm text-[#9D9DAE]">
              Inquire about sync licensing, artist bookings, or discuss brand partnerships.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/services">
              <Button variant="primary" size="md">
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md">
                <span>Contact Us</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
