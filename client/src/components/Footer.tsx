import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="app-footer mt-20">
      <div className="app-container px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.15fr_repeat(3,0.75fr)]">
          <div className="space-y-5">
            <BrandLogo tone="light" size="md" showSubtitle subtitle="Research and Community Service" />
            <p className="max-w-sm text-sm leading-7 text-slate-300">
              Pusat layanan penelitian, pengabdian masyarakat, dan publikasi akademik dengan satu workspace yang konsisten untuk seluruh peran pengguna.
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 shrink-0 text-rose-300" />
              <h4 className="text-sm text-white" style={{ fontWeight: 700 }}>Alamat</h4>
            </div>
            <p className="text-sm text-slate-300" style={{ fontWeight: 600 }}>
              PRADITA UNIVERSITY CAMPUS
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Scientia Business Park Tower I Jl. Boulevard Gading Serpong Blok O/1,
              Summarecon Serpong Gedung Menara Satu Lt. 11, Kec. Klp. Gading
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-300">
              Jl. Boulevard Raya LA 3 No. 1, RT.11/RW.18, Jkt Utara, Daerah Khusus Ibukota Jakarta
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 shrink-0 text-rose-300" />
              <h4 className="text-sm text-white" style={{ fontWeight: 700 }}>Contact Us</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p><span style={{ fontWeight: 600 }}>Phone:</span> 021 5555 9999</p>
              <p><span style={{ fontWeight: 600 }}>Mobile:</span> 0812 3456 7890</p>
              <p><span style={{ fontWeight: 600 }}>Email:</span> lppm@example.com</p>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 shrink-0 text-rose-300" />
              <h4 className="text-sm text-white" style={{ fontWeight: 700 }}>Jam buka</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Mon-Fri: 08AM - 05PM</p>
              <p>Saturday & Sunday: Closed</p>
            </div>
            <div className="mt-5">
              <h4 className="mb-4 text-sm text-white" style={{ fontWeight: 700 }}>Follow Us</h4>
              <a
                href="https://www.instagram.com/praditauniversity/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-slate-300 transition-colors hover:border-rose-300 hover:text-rose-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="app-container px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-sm text-slate-400">
            &copy; Copyright <span style={{ fontWeight: 600 }}>LPPM Pradita University</span>. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
