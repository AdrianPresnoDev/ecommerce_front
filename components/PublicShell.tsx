"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { Mail, Phone, MapPin } from "lucide-react";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <footer id="contacto" className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mb-4">Inma Álvarez</h3>
              <p className="text-sm mb-4">Arte contemporáneo que transforma espacios en experiencias únicas</p>
              <div className="flex gap-4">
                {/* Instagram */}
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                {/* X / Twitter */}
                <a href="#" className="hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#galeria" className="hover:text-white transition-colors">Galería</a></li>
                <li><a href="/#sobre" className="hover:text-white transition-colors">Sobre Mí</a></li>
                <li><a href="/#colecciones" className="hover:text-white transition-colors">Colecciones</a></li>
                <li><a href="/#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Obras a Medida</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consultoría Artística</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Envío Internacional</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certificado de Autenticidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:inma@inmaalvarez.com" className="hover:text-white transition-colors">inma@inmaalvarez.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+34600000000" className="hover:text-white transition-colors">+34 600 000 000</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Madrid, España</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} Inma Álvarez. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
