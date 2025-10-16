"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function SocialIcon({ type, url }: { type: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp'; url: string }) {
  const getIcon = () => {
    if (type === 'instagram') {
      return (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </>
      );
    } else if (type === 'facebook') {
      return (
        <path
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    } else if (type === 'tiktok') {
      return (
        <path
          d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    } else {
      return (
        <path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none"
        />
      );
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#0D5850] hover:text-[#2B8FA6] transition-colors duration-200"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        {getIcon()}
      </svg>
    </a>
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#0D5850]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image src="/assets/logocompleto.png" alt="ADN-Aguascalientes" width={200} height={80} />
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-['Poppins:Regular',_sans-serif] text-[16px] transition-colors duration-200 text-[#0D5850]/70 hover:text-[#0D5850]"
              >
                Inicio
              </Link>
              <Link
                href="/boletines-ssmaa"
                className="font-['Poppins:Regular',_sans-serif] text-[16px] transition-colors duration-200 text-[#0D5850]/70 hover:text-[#0D5850]"
              >
                Boletines Ambientales
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
            <SocialIcon type="facebook" url="https://facebook.com/adnags" />
            <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
            <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />
          </div>
        </div>
      </div>
    </nav>
  );
}
