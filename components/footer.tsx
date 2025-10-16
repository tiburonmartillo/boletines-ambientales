"use client"

import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-10 sm:py-16 lg:py-20 relative bg-[#1E3A8A]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <h2 className="font-['Poppins:Bold',_sans-serif] text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[80px] text-white mb-6 sm:mb-8 lg:mb-12">
        Contacto
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h3 className="font-['Poppins:Bold',_sans-serif] text-[20px] sm:text-[24px] lg:text-[28px] text-[#F97316] mb-4 sm:mb-6">
              ÚNETE A NUESTRA CAUSA
            </h3>
            <p className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white/90 leading-[1.7] mb-6 sm:mb-8">
              Si compartes nuestra preocupación por el medio ambiente de Aguascalientes y quieres sumarte a nuestras iniciativas, ponte en contacto con nosotros. Juntos podemos construir un futuro más sustentable.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:Bold',_sans-serif] text-[12px] sm:text-[14px] text-white/60 mb-1">Email</p>
                <a 
                  href="mailto:comunica@adn-a.org"
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  comunica@adn-a.org
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" />
              </div>
              <div>
                <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">WhatsApp</p>
                <a 
                  href="https://wa.me/524493433413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  +52 449 343 3413
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="currentColor"></path></svg>
              </div>
              <div>
                <p className="font-['Poppins:Bold',_sans-serif] text-[14px] text-white/60 mb-1">Canal de WhatsApp</p>
                <a 
                  href="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white hover:text-[#F97316] transition-colors duration-200"
                >
                  Únete al canal
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="font-['Poppins:Bold',_sans-serif] text-[14px] sm:text-[16px] text-white/80 mb-3 sm:mb-4">Síguenos en redes sociales:</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <a 
                href="https://instagram.com/adn.ags"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
              >
                Instagram: @adn.ags
              </a>
            </div>
            <div className="flex gap-6 mt-3">
              <a 
                href="https://facebook.com/@adnags"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
              >
                Facebook: @adnags
              </a>
            </div>
            <div className="flex gap-6 mt-3">
              <a 
                href="https://tiktok.com/@adn_ags"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-['Poppins:Medium',_sans-serif] text-[16px] sm:text-[18px] text-white hover:text-[#F97316] transition-colors duration-200"
              >
                TikTok: @adn_ags
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 sm:p-8 border border-white/20">
          <h4 className="font-['Poppins:Bold',_sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-[#F97316] mb-4 sm:mb-6">
            FORMAS DE PARTICIPAR
          </h4>
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[12px]">✓</span>
              </div>
              <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                Asiste a nuestras reuniones y asambleas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[12px]">✓</span>
              </div>
              <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                Participa en jornadas de reforestación y limpieza
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[12px]">✓</span>
              </div>
              <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                Comparte información sobre nuestras campañas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[12px]">✓</span>
              </div>
              <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                Firma y difunde nuestras peticiones
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F97316] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-[12px]">✓</span>
              </div>
              <span className="font-['Poppins:Regular',_sans-serif] text-[16px] sm:text-[18px] text-white/90">
                Contribuye con donaciones para nuestras iniciativas
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  );
}
