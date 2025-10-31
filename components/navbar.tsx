"use client"

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
          fill="currentColor"
        />
      );
    }
  };

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#000000] hover:text-[#F97316] transition-colors duration-200"
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
        {getIcon()}
      </svg>
    </a>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  // All navigation items
  const navItems = useMemo(() => [
    { id: 'home', label: 'Inicio', href: '/', type: 'page' },
    // Secciones de landing
    { id: 'about', label: 'Nosotros', href: '/#about', type: 'section', group: 'secciones' },
    { id: 'initiatives', label: 'Iniciativas', href: '/#initiatives', type: 'section', group: 'secciones' },
    { id: 'impact', label: 'Logros', href: '/#impact', type: 'section', group: 'secciones' },
    { id: 'contact', label: 'Contacto', href: '/#contact', type: 'section', group: 'secciones' },
    { id: 'subscription', label: 'Suscríbete', href: '/#subscription', type: 'section', group: 'secciones' },
    // Herramientas
    { id: 'boletines', label: 'Boletines Ambientales', href: '/boletines-ssmaa', type: 'page', group: 'herramientas' },
    // { id: 'email-generator', label: 'Generador Email', href: '/email-generator', type: 'page', group: 'herramientas' }
  ], []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleNavClick = (item: any) => {
    if (item.type === 'section') {
      // Si estamos en la landing page, hacer scroll
      if (pathname === '/') {
        scrollToSection(item.id);
        // Actualizar URL con hash para que sea compartible
        window.history.pushState(null, '', `/#${item.id}`);
      } else {
        // Si estamos en otra página, ir a la landing page con hash
        window.location.href = item.href;
      }
    } else {
      // Para páginas, solo navegar
      setActiveSection(item.id);
    }
  };

  // Scroll to section on mount or hash change
  useEffect(() => {
    if (pathname !== '/') return;

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash) {
        // Try multiple times in case element isn't rendered yet
        const attemptScroll = (attempts = 0) => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 80; // Navbar height offset
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: attempts === 0 ? 'auto' : 'smooth' // Instant on first load, smooth on hash change
            });
            setActiveSection(hash);
          } else if (attempts < 10) {
            // Retry up to 10 times (1 second max wait)
            setTimeout(() => attemptScroll(attempts + 1), 100);
          }
        };
        
        // Start scrolling attempt
        setTimeout(() => attemptScroll(), 50);
      }
    };

    // Scroll on initial load or when navigating to landing with hash
    scrollToHash();

    // Listen for hash changes
    const handleHashChange = () => {
      setTimeout(() => scrollToHash(), 50);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = navItems.filter(item => item.type === 'section').map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      let currentActive = 'home';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            currentActive = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, navItems]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1E3A8A]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* Logo SVG en pantallas chicas */}
              <svg 
                width="96" 
                height="96" 
                viewBox="0 0 1583 365" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="block sm:hidden w-24 h-24 flex-shrink-0"
              >
                <path d="M145.88 325.284C169.202 321.533 197.527 306.315 220.731 312.719C258.767 323.219 271.574 346.506 320.903 337.488C335.749 334.772 348.921 321.76 364.056 317.161C367.349 316.16 370.574 318.763 370.384 322.202C369.475 338.675 373.915 351.512 354.672 359.171C317.315 374.039 267.531 357.353 228.18 343.794C216.276 339.689 203.398 339.214 191.305 342.723C177.112 346.847 163.192 352.257 148.419 352.096C145.797 352.067 143.591 350.272 143.051 347.706C141.477 340.248 141.558 327.888 145.88 325.284Z" fill="#86CDE3"/>
                <path d="M88.4131 265.212C92.6049 265.212 96.0049 268.616 96.0049 272.813C96.0049 277.009 92.6048 280.413 88.4131 280.413C84.2215 280.412 80.8224 277.009 80.8223 272.813C80.8223 268.616 84.2214 265.212 88.4131 265.212Z" fill="#8CC059"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M82.7989 253.272C99.0072 251.495 103.007 263.851 112.284 268.637C117.696 271.426 129.083 270.042 129.551 278.365C129.997 286.295 114.26 292.086 108.571 298.319C96.4263 311.623 89.9814 331.902 93.0193 349.885C93.3589 351.906 91.6318 353.675 89.5944 353.478L83.6092 352.897C76.6392 352.217 71.0011 346.919 69.8911 339.996L68.7814 333.087L54.0519 341.769C56.6006 346.781 64.038 339.042 66.9921 345.216C72.6481 357.032 50.5795 356.436 42.7762 356.385C31.7893 356.312 19.2868 355.737 12.5647 345.589C-7.76555 314.906 32.5447 271.859 62.3108 267.387C65.6686 266.883 69.3409 269.125 69.6102 268.867C72.0341 266.527 68.8081 254.808 82.7989 253.272ZM97.5307 263.472C86.9198 255.097 67.3087 269.511 78.2077 281.1C81.9722 285.099 94.1089 286.021 97.8116 282.317C100.798 279.331 101.302 266.452 97.5307 263.472Z" fill="#8CC059"/>
                <path d="M199.465 274.831C222.48 271.34 220.377 276.198 237.297 283.974C267.297 297.752 303.611 290.54 335.568 287.973C344.167 287.282 352.861 288.141 361.252 286.434C364.735 285.728 368.247 287.549 369.478 290.891C376.536 310.076 362.227 313.751 343.4 318.372C318.049 324.597 283.897 326.465 258.447 320.06C231.657 313.322 221.106 300.173 190.515 305.777C181.298 307.466 155.977 316.96 148.557 315.725C140.489 314.379 140.714 294.657 142.635 291.658C144.238 289.16 193.427 275.749 199.465 274.831Z" fill="#86CDE3"/>
                <path d="M222.864 249.846C260.962 248.538 305.342 268.948 339.979 259.403C349.907 256.665 356.896 246.77 368.927 252.772C373.973 255.287 375.397 274.224 372.556 275.551C334.209 293.453 283.9 284.032 256.712 278.409C244.786 275.941 229.183 268.799 217.736 268.715C192.034 268.529 166.032 283.462 140.648 282.742C139.432 277.328 141.021 260.07 147.093 258.412C153.691 256.614 174.95 257.878 184.688 256.555C197.073 254.873 209.157 250.318 222.864 249.846Z" fill="#86CDE3"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M42.7427 201.22C43.4802 201.187 46.0698 192.788 52.8278 194.447C60.5645 196.344 58.405 210.051 59.4962 211.329C60.3061 212.28 71.6031 213.758 69.4125 222.512C68.7549 227.926 56.3083 228.384 55.8008 228.972C54.6921 230.268 60.2618 241.508 52.3065 245.42C42.7073 250.139 37.324 239.348 30.6348 239.457C26.0708 239.531 21.4042 246.589 16.1064 238.294C7.52251 224.856 25.4131 218.969 26.195 215.734C26.9613 212.561 17.0014 204.024 27.4214 197.893C36.2023 192.724 38.5078 201.413 42.7427 201.22ZM47.609 211.974C34.7196 205.277 29.6083 225.581 40.5442 228.699C50.8263 231.634 54.5429 215.575 47.609 211.974Z" fill="#F69650"/>
                <path d="M330.854 199.019C342.341 199.019 351.652 208.342 351.652 219.843C351.652 231.344 342.341 240.666 330.854 240.667C319.367 240.666 310.055 231.344 310.055 219.843C310.055 208.342 319.367 199.02 330.854 199.019Z" fill="#F69650"/>
                <path d="M318.643 55.7883C359.287 48.5535 353.259 84.6252 332.994 104.644C287.498 149.585 260.959 133.913 263.661 157.759C268.466 162.607 283.524 148.905 291.185 141.937C293.814 139.543 296.75 137.455 300.047 136.132C316.486 129.523 336.074 135.427 328.666 159.551C319.964 194.029 255.046 172.848 236.11 190.242C231.076 194.871 234.914 203.717 241.566 202.157C242.413 201.959 243.231 201.619 243.976 201.141C245.955 199.857 248.288 199.217 250.577 198.65C275.622 192.461 302.292 199.155 287.836 216.308C280.829 224.621 270.091 228.877 259.232 228.628C222.035 227.78 204.314 205.568 164.919 237.6C163.612 227.444 172.982 228.54 177.981 222.062C190.745 205.523 170.904 179.647 168.494 163.737C163.379 129.983 194.656 108.421 205.307 149.542C207.107 156.868 203.753 174.44 211.328 173.739C214.57 173.44 216.852 170.428 217.024 167.171C217.689 154.426 212.618 121.369 212.643 112.358C214.042 28.2304 328.582 44.737 245.027 132.418C244.045 134.399 243.476 136.41 244.607 136.933C252.702 140.669 270.623 111.426 282.863 89.6634C290.877 75.4169 300.083 61.1515 315.755 56.5521C316.744 56.2634 317.709 56.0076 318.643 55.7883Z" fill="#023923"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M119.419 163.254C134.325 160.582 135.832 178.555 138.052 178.562C138.694 178.562 142.328 173.089 149.835 175.446C163.17 179.632 150.065 193.748 149.528 197.144C149.091 199.897 159.836 205.648 151.851 214.977C144.573 223.484 131.826 212.25 128.606 215.112C127.482 216.112 129.317 225.489 118.879 227.104C101.214 229.842 104.331 213.336 98.2404 208.075C92.9598 203.517 76.4533 209.99 82.525 190.659C86.7823 177.1 105.572 182.483 109.594 179.585C112.638 177.39 109.229 165.083 119.419 163.254ZM123.64 184.251C109.499 184.679 109.991 206.628 124.807 205.843C139.563 205.06 137.643 183.828 123.64 184.251Z" fill="#F69650"/>
                <path d="M48.9209 108.187C55.0112 105.314 64.1468 102.821 67.0464 105.628C69.858 108.352 81.9043 147.045 79.7208 150.544C79.2771 151.248 69.5059 155.749 63.2493 156.794C60.6973 157.218 58.2402 155.687 57.4734 153.216L45.77 115.309C44.8975 112.476 46.2451 109.452 48.9209 108.187Z" fill="#F69650"/>
                <path d="M31.1572 110.871C34.2317 110.889 36.7112 113.389 36.7113 116.467V147.929C36.7113 150.719 34.8598 153.198 32.1906 153.995C8.21621 161.16 8.57291 153.04 8.90518 129.044C8.949 125.984 9.03665 119.466 9.89462 114.987C10.3692 112.531 12.4949 110.75 14.9956 110.764L31.1572 110.871Z" fill="#F69650"/>
                <path d="M78.2932 96.2761C83.7154 92.9933 89.8718 88.7828 94.8121 91.6886C98.4562 93.8313 114.663 116.955 115.691 121.329C116.808 126.082 113.833 129.278 110.583 132.842C110.024 133.457 107.427 135.661 104.835 137.675C101.954 139.911 97.7953 139.386 95.6374 136.443C88.0973 126.174 79.115 116.328 75.2116 104.187C74.2442 101.179 75.5916 97.914 78.2932 96.2761Z" fill="#F69650"/>
                <path d="M115.983 64.3384C123.848 62.9829 136.289 84.142 145.227 89.3301C146.721 90.1964 147.608 91.8707 147.524 93.5924C147.334 97.537 144.154 101.442 142.814 105.533C141.97 108.114 139.217 109.528 136.566 108.947C123.428 106.073 102.068 87.5677 102.911 79.0533C103.255 75.5692 112.193 64.9902 115.983 64.3384Z" fill="#F69650"/>
                <path d="M51.9517 0.340243C71.1469 -0.445751 88.4848 0.0954087 107.37 2.80064C113.19 3.63394 116.206 -0.847702 119.043 10.1957C129.541 51.0716 89.4077 90.3763 52.6891 100.013C40.2301 103.281 14.0315 109.268 6.53908 96.8756C0.313857 86.5763 -0.657676 47.2743 0.335416 33.7987C0.711498 28.7209 2.40617 11.4034 4.188 8.02465C8.37237 0.0917544 42.0259 0.749615 51.9517 0.340243Z" fill="#F69650"/>
                <path d="M125.225 34.7199C126.389 32.0111 129.596 30.5557 132.243 31.8567C135.507 33.4616 137.994 36.7992 141.163 38.3676C152.209 43.8293 163.302 44.2026 175.18 45.3322C178.283 45.6249 180.518 48.5424 179.909 51.6059C178.485 58.7667 172.684 69.7067 171.916 70.2614C167.209 73.6418 156.416 60.3919 152.045 58.7093C136.983 52.908 113.537 61.8523 125.225 34.7199Z" fill="#F7964F"/>
                <path d="M281.129 0C292.612 1.39642e-05 301.926 9.32211 301.927 20.8231C301.927 32.3244 292.612 41.6509 281.129 41.6509C269.642 41.6505 260.326 32.3241 260.326 20.8231C260.326 9.32232 269.642 0.000356757 281.129 0Z" fill="#86CDE3"/>
                <path d="M133.718 5.88945C150.27 -10.2761 168.644 12.2798 188.57 9.44349C190.852 9.11836 193.031 10.752 193.035 13.0623C193.06 29.8132 175.26 31.2979 161.034 25.4048C153.787 22.4033 154.443 15.4571 141.649 17.2448C136.307 17.9912 128.395 25.8826 128.57 14.3782C128.643 9.62962 130.721 8.8138 133.718 5.88945Z" fill="#F7964F"/>
                <path d="M1537.68 310.935C1516.06 310.935 1504.38 307.456 1502.64 300.498L1490.34 252.41H1431.07L1420.26 298.634C1418.77 306.338 1406.84 310.19 1384.47 310.19C1372.54 310.19 1363.72 309.568 1358 308.326C1352.29 306.835 1349.43 305.716 1349.43 304.971L1415.41 52.6026C1415.41 50.6145 1432.43 49.6204 1466.48 49.6204C1500.53 49.6204 1517.55 50.6145 1517.55 52.6026L1582.04 305.344C1582.04 307.083 1576.32 308.45 1564.89 309.444C1553.46 310.438 1544.39 310.935 1537.68 310.935ZM1440.39 205.067H1479.53L1462.75 127.903H1460.52L1440.39 205.067Z" fill="#023923"/>
                <path d="M1319.46 239.363H1172.22C1167.74 239.363 1164.51 235.76 1162.52 228.553C1161.53 224.825 1161.03 221.221 1161.03 217.742C1161.03 214.263 1161.53 210.659 1162.52 206.932C1164.51 199.725 1167.74 196.121 1172.22 196.121H1319.46C1323.93 196.121 1327.17 199.725 1329.15 206.932C1330.15 210.659 1330.64 214.263 1330.64 217.742C1330.64 221.221 1330.15 224.825 1329.15 228.553C1327.17 235.76 1323.93 239.363 1319.46 239.363Z" fill="#023923"/>
                <path d="M1129.18 301.99C1129.18 307.209 1117.5 309.818 1094.14 309.818C1070.78 309.818 1058.11 307.954 1056.12 304.227L993.866 187.921V303.854C993.866 308.327 982.31 310.564 959.198 310.564C936.334 310.564 924.902 308.327 924.902 303.854V54.4676C924.902 50.7398 934.719 48.876 954.351 48.876C962.055 48.876 971.002 49.6215 981.191 51.1126C991.629 52.3552 997.966 54.8404 1000.2 58.5681L1059.85 173.383V56.3315C1059.85 51.6097 1071.4 49.2487 1094.51 49.2487C1117.63 49.2487 1129.18 51.6097 1129.18 56.3315V301.99Z" fill="#023923"/>
                <path d="M695.195 293.041V69.3764C695.195 63.1635 696.686 58.3174 699.668 54.8382C702.899 51.1104 706.999 49.2466 711.97 49.2466H774.223C813.737 49.2466 843.684 59.1872 864.062 79.0686C884.689 98.9499 895.002 130.263 895.002 173.008C895.002 264.462 855.985 310.189 777.951 310.189H714.207C701.532 310.189 695.195 304.473 695.195 293.041ZM766.768 120.074V231.533C766.768 236.752 767.14 240.107 767.886 241.598C768.632 242.841 770.868 243.462 774.596 243.462C788.264 243.462 798.578 238.368 805.536 228.178C812.743 217.989 816.347 201.09 816.347 177.481C816.347 153.623 812.619 138.091 805.163 130.884C797.957 123.677 786.401 120.074 770.495 120.074H766.768Z" fill="#023923"/>
                <path d="M626.13 310.935C604.509 310.935 592.828 307.456 591.089 300.498L578.787 252.41H519.516L508.706 298.634C507.214 306.338 495.286 310.19 472.919 310.19C460.99 310.19 452.168 309.568 446.452 308.326C440.736 306.835 437.878 305.716 437.878 304.971L503.859 52.6026C503.859 50.6145 520.883 49.6204 554.93 49.6204C588.976 49.6204 606 50.6145 606 52.6026L670.49 305.344C670.49 307.083 664.774 308.45 653.342 309.444C641.91 310.438 632.839 310.935 626.13 310.935ZM528.835 205.067H567.977L551.202 127.903H548.965L528.835 205.067Z" fill="#023923"/>
              </svg>
              {/* Logo completo en pantallas grandes */}
              <img 
                src="/assets/Logo ADN-A completo.svg" 
                alt="ADN-Aguascalientes" 
                className="hidden sm:block sm:h-16 sm:w-auto"
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            <a
              href="https://adnags.notion.site/29c2b8101e5c80fdbd89f8c03728e80d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-full transition-all duration-300 font-medium text-[14px] whitespace-nowrap flex-shrink-0"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Recibir Boletín</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <SocialIcon type="instagram" url="https://instagram.com/adn.ags" />
            <SocialIcon type="facebook" url="https://facebook.com/@adnags" />
            <SocialIcon type="tiktok" url="https://tiktok.com/@adn_ags" />
            <SocialIcon type="whatsapp" url="https://whatsapp.com/channel/0029Vb2Z1vg6RGJ9l9v0ok2U" />
            </div>

            {/* Hamburger - siempre visible */}
            <button
              className="inline-flex p-1.5 sm:p-2 rounded-md border text-[#000000] hover:bg-gray-50 flex-shrink-0"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile dropdown - siempre visible cuando está abierto */}
        {mobileOpen && (
          <div className="mt-3 border-t pt-3">
            <div className="grid gap-2">
              <Link href="/" className={`block px-2 py-2 rounded hover:bg-gray-50 ${pathname === '/' ? 'text-[#1E3A8A] underline' : 'text-[#000000]/80'}`} onClick={() => setMobileOpen(false)}>Inicio</Link>
              <div>
                <div className="px-2 py-2 text-xs uppercase tracking-wide text-gray-500">Secciones</div>
                <div className="grid">
                  {navItems.filter(i => i.group === 'secciones').map(item => (
                    <button
                      key={item.id}
                      onClick={() => { handleNavClick(item); setMobileOpen(false); }}
                      className="text-left px-3 py-2 rounded hover:bg-gray-50 text-[#000000]/80"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="px-2 py-2 text-xs uppercase tracking-wide text-gray-500">Herramientas</div>
                <div className="grid">
                  {navItems.filter(i => i.group === 'herramientas').map(item => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 rounded hover:bg-gray-50 text-[#000000]/80"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}