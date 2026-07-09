'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
      <div className="flex justify-between items-center px-lg py-md max-w-container mx-auto">
        <Link href="/" className="text-headline-md font-bold text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
          GO2Cloud
        </Link>

        <nav className="hidden md:flex items-center gap-xl">
          <a href="/#cursos" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">
            Cursos
          </a>
          <a href="/#arquitetura" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">
            Arquitetura
          </a>
          <a href="#" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300">
            Mentoria
          </a>
        </nav>

        <div className="flex items-center gap-md">
          {!mounted ? null : user ? (
            <>
              <span className="text-body-sm text-on-surface-variant hidden sm:inline">Olá, {user.firstName}</span>
              <button onClick={handleLogout} className="text-body-sm text-primary hover:underline">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hidden sm:inline">
                Login
              </Link>
              <Link
                href="/enrollment"
                className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Matricular-se
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
