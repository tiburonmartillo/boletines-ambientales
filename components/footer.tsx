"use client"

import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0D5850] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="font-['Poppins:Bold',_sans-serif] text-[28px] text-[#F5A962] mb-6">
                CONTACTO
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[18px] text-white/90 leading-[1.7] mb-8">
                Si compartes nuestra preocupación por el medio ambiente de Aguascalientes y quieres sumarte a nuestras iniciativas, ponte en contacto con nosotros.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7DC9D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">Email</p>
                  <a 
                    href="mailto:comunica@adn-a.org"
                    className="font-['Poppins:Medium',_sans-serif] text-[18px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                  >
                    comunica@adn-a.org
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#7DC9D1]" />
                </div>
                <div>
                  <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">WhatsApp</p>
                  <a 
                    href="https://wa.me/524493433413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Poppins:Medium',_sans-serif] text-[18px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                  >
                    +52 449 343 3413
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <p className="font-['Poppins:Bold',_sans-serif] text-[16px] text-white/80 mb-4">Síguenos en redes sociales:</p>
              <div className="flex gap-6">
                <a 
                  href="https://instagram.com/adn.ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  Instagram: @adn.ags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://facebook.com/adnags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  Facebook: adnags
                </a>
              </div>
              <div className="flex gap-6 mt-3">
                <a 
                  href="https://tiktok.com/@adn_ags"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] text-white hover:text-[#7DC9D1] transition-colors duration-200"
                >
                  TikTok: @adn_ags
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
            <h4 className="font-['Poppins:Bold',_sans-serif] text-[24px] text-[#7DC9D1] mb-6">
              ADN-Aguascalientes
            </h4>
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] text-white/90 leading-[1.7] mb-6">
              Coalición ciudadana comprometida con la defensa del derecho humano a un medio ambiente sano, limpio y equilibrado en Aguascalientes.
            </p>
            <div className="pt-6 border-t border-white/20">
              <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/80 mb-4">© 2024 ADN-Aguascalientes</p>
              <p className="font-['Poppins:Regular',_sans-serif] text-[14px] text-white/70">
                Un ambiente sano es nuestro derecho
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
