import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Edit, 
  X
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#001A33] text-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-[#B4F81B] font-black text-3xl italic tracking-tighter flex items-center">
            <span className="text-white mr-1">⚡</span>MOJOK<span className="text-white ml-1">⚡</span>
          </div>
          <div className="hidden md:block text-xs font-bold tracking-widest mt-1">
            SUARA ORANG BIASA
          </div>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="bg-[#3A9D36] hover:bg-[#2e7d2b] transition-colors text-white px-4 py-2 rounded font-bold flex items-center gap-2 text-sm">
            <Edit size={16} /> KIRIM ARTIKEL
          </button>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="flex items-center gap-3">
            <a href="#" className="bg-[#E1306C] p-1.5 rounded-full hover:opacity-80 transition-opacity"><Instagram size={16} /></a>
            <a href="#" className="bg-black p-1.5 rounded-full hover:opacity-80 transition-opacity"><Twitter size={16} /></a>
            <a href="#" className="bg-[#1877F2] p-1.5 rounded-full hover:opacity-80 transition-opacity"><Facebook size={16} /></a>
            <a href="#" className="bg-black p-1.5 rounded-full hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </a>
            <a href="#" className="bg-[#FF0000] p-1.5 rounded-full hover:opacity-80 transition-opacity"><Youtube size={16} /></a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#001224] border-t border-gray-700 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center py-3">
          <nav className="flex gap-6 font-bold text-sm">
            {['ESAI', 'LIPUTAN', 'TAJUK', 'POJOKAN', 'KILAS', 'CUAN', 'OTOMOJO', 'MALAM JUMAT', 'VIDEO', 'TERMINAL'].map((item) => (
              <Link key={item} to={`/category/${item.toLowerCase()}`} className="hover:text-[#B4F81B] transition-colors relative group">
                {item}
                <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-[#B4F81B] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari..." 
              className="bg-white/10 rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#B4F81B] w-48 transition-all focus:w-64" 
            />
            <Search size={16} className="absolute right-3 top-2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#001224] absolute top-full left-0 w-full border-t border-gray-700 p-4 flex flex-col gap-4 shadow-xl">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Cari artikel..." 
              className="bg-white/10 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B4F81B] w-full" 
            />
            <Search size={18} className="absolute right-4 top-2.5 text-gray-400" />
          </div>
          <nav className="flex flex-col gap-4 font-bold text-sm mt-2">
            {['ESAI', 'LIPUTAN', 'TAJUK', 'POJOKAN', 'KILAS', 'CUAN', 'VIDEO'].map((item) => (
              <Link key={item} to={`/category/${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#B4F81B] border-b border-gray-800 pb-2">{item}</Link>
            ))}
          </nav>
          <button className="bg-[#3A9D36] text-white px-4 py-3 rounded font-bold flex justify-center items-center gap-2 text-sm mt-4">
            <Edit size={16} /> KIRIM ARTIKEL
          </button>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#001A33] text-white pt-12 pb-6 border-t-4 border-[#B4F81B]">
      <div className="container mx-auto px-4">
        {/* Top Footer Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-10 border-b border-gray-700 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
              <div className="bg-blue-500 p-2 rounded text-white font-bold">G<span className="text-red-500">N</span></div>
              <div>
                <div className="text-xs text-gray-400">Ikuti mojok.co di</div>
                <div className="font-bold">Google News</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
              <div className="bg-green-500 p-2 rounded-full text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></div>
              <div>
                <div className="text-xs text-gray-400">Ikuti WA Channel</div>
                <div className="font-bold">Mojok.co</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
              <div className="bg-red-600 p-2 rounded-full text-white"><Youtube size={20} /></div>
              <div>
                <div className="text-xs text-gray-400">Ikuti Youtube Channel</div>
                <div className="font-bold">Mojokdotco</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="flex flex-wrap justify-center gap-8 mb-10 pb-10 border-b border-gray-700">
          <a href="#" className="flex items-center gap-2 hover:text-[#B4F81B] transition-colors font-bold"><Instagram size={20} /> Instagram</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#B4F81B] transition-colors font-bold"><Twitter size={20} /> Twitter</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#B4F81B] transition-colors font-bold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg> TikTok
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#B4F81B] transition-colors font-bold"><Facebook size={20} /> Facebook</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#B4F81B] transition-colors font-bold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn
          </a>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-1">
            <div className="bg-blue-600 inline-flex items-center gap-2 px-3 py-1.5 rounded text-white font-bold mb-6">
              <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
              PROTECTED BY DMCA.com
            </div>
          </div>
          
          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Tentang</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Kru</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Kirim Artikel</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Kontak</a>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Kerjasama</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Pedoman Media Siber</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#B4F81B] transition-colors">Laporan Transparansi</a>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <h4 className="font-bold text-white mb-2">PT NARASI AKAL JENAKA</h4>
            <p>Perum Sukoharjo Indah A8,<br/>Desa Sukoharjo, Ngaglik,<br/>Sleman, D.I. Yogyakarta 55581</p>
            <p className="mt-4">redaksi@mojok.co<br/>+62-851-6282-0147</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-800">
          © 2026 PT Narasi Akal Jenaka. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
