'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Package, Shield } from 'lucide-react'

const navLinks = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Urunler', href: '#gallery' },
  { label: 'Yorumlar', href: '#reviews' },
  { label: 'Basvuru', href: '#apply' },
  { label: 'Iletisim', href: '#contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-primary'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="#hero" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Package className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary-foreground">
            ANKA PAKETLEME
          </span>
        </a>

        {/* Maliye Bakanligi Onayli Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 md:flex">
          <Shield className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold text-accent">Maliye Bakanlığı Onaylı</span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-primary-foreground lg:hidden"
          aria-label={open ? 'Menuyu kapat' : 'Menuyu ac'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-foreground/10 bg-primary lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {/* Mobile badge */}
            <div className="flex items-center gap-2 px-3 py-3">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold text-accent">Maliye Bakanlığı Onaylı</span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
