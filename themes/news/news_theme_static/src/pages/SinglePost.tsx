import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { HERO_POST, LATEST_POSTS } from '../data';

export default function SinglePost() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <article className="lg:w-2/3">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 font-bold">
            <Link to="/" className="hover:text-[#3A9D36]">Beranda</Link>
            <span>›</span>
            <Link to="/category/esai" className="hover:text-[#3A9D36]">Malam Jumat</Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {HERO_POST.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" 
              alt="Author" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>oleh <span className="text-[#3A9D36] font-bold">{HERO_POST.author}</span></span>
              <span>&mdash;</span>
              <span>{HERO_POST.date}</span>
            </div>
            <div className="ml-auto text-gray-400 font-serif text-xl">
              A<span className="text-sm">A</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={HERO_POST.image} 
              alt="Featured" 
              className="w-full h-auto rounded-sm"
            />
            <p className="text-xs text-gray-500 text-right mt-2 italic">
              Ilustrasi 19 Tahun Gempa Jogja dan Teror di Bangsal Rumah Sakit. (Mojok.co/Ega Fansuri)
            </p>
          </div>

          {/* Content & Share */}
          <div className="flex gap-6 relative">
            {/* Sticky Share Buttons */}
            <div className="hidden md:flex flex-col gap-2 sticky top-24 h-max">
              <button className="bg-[#25D366] text-white p-3 hover:opacity-90"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></button>
              <button className="bg-black text-white p-3 hover:opacity-90"><Twitter size={20} /></button>
              <button className="bg-[#1877F2] text-white p-3 hover:opacity-90"><Facebook size={20} /></button>
              <button className="bg-gray-200 text-gray-700 p-3 hover:bg-gray-300"><LinkIcon size={20} /></button>
            </div>

            {/* Prose Content */}
            <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed">
              <p><strong>MOJOK.CO</strong> – <em>Di sebuah rumah sakit besar di Jogja, teror yang saya rasakan selepas gempa besar kembali muncul dalam ingatan.</em></p>
              
              <p>Kejadian ini saya alami sekitar 19 tahun lalu, tepat setelah gempa besar mengguncang Jogja pada <a href="#" className="text-[#3A9D36] no-underline hover:underline">27 Mei 2006</a>. Gempa yang berpusat di Bantul itu bukan cuma merobohkan rumah dan bangunan, tapi juga menyisakan trauma panjang bagi banyak orang termasuk saya, yang saat itu masih kelas 1 SMP.</p>
              
              <p>Pagi itu, pukul 05:54, saya sedang mandi. Masih setengah sadar, tubuh belum sepenuhnya bangun, ujian kenaikan kelas memenuhi kepala. Tiba-tiba terdengar suara gemuruh dari atas atap.</p>

              <p>Awalnya saya kira cuma suara tikus yang lagi kejar-kejaran. Ini hal biasa di rumah-rumah di perkampungan. Tapi, beberapa detik kemudian, lantai bergoyang, dinding bergetar, dan suara gemuruh itu berubah menjadi sesuatu yang jauh lebih menakutkan.</p>

              <p><em>Gempa mengguncang Jogja!</em></p>

              <p>Saya reflek lari, keluar dari kamar mandi. Karena panik, saya bahkan lupa kalau tubuh saya masih setengah telanjang. Yang penting selamat dulu, urusan malu belakangan.</p>

              <p>Di luar rumah, orang-orang berteriak, suara benda runtuh bersahut-sahutan. Pagi yang seharusnya biasa di Jogja itu berubah jadi kekacauan.</p>

              <h2 className="font-sans font-bold text-2xl mt-8 mb-4">Demam tinggi</h2>

              <p>Ibu saya seorang PNS di Dinas Kesehatan Jogja. Sejak hari itu, beliau nyaris tidak pernah benar-benar pulang. Bantuan berdatangan dari mana-mana, pemerintah mengerahkan seluruh tenaga medis untuk menangani korban yang membeludak.</p>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-6">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LATEST_POSTS.slice(0, 3).map((post, index) => (
                <Link to={`/post/${post.id}`} key={index} className="group cursor-pointer flex flex-col">
                  <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-bold text-base leading-snug mb-2 group-hover:text-[#3A9D36] transition-colors line-clamp-3">
                    {post.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-auto">
                    {post.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="flex items-center mb-6">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Terpopuler Sepekan
            </div>
            <div className="flex-grow h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="flex flex-col gap-6 mb-12">
            {LATEST_POSTS.map((post, index) => (
              <Link to={`/post/${post.id}`} key={index} className="flex gap-4 group cursor-pointer">
                <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-sm leading-snug group-hover:text-[#3A9D36] transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center mb-6">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Video Terbaru
            </div>
            <div className="flex-grow h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="flex flex-col gap-6">
            {LATEST_POSTS.slice(0,3).map((post, index) => (
              <Link to={`/post/${post.id}`} key={index} className="flex gap-4 group cursor-pointer">
                <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/30 text-white backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-sm leading-snug group-hover:text-[#3A9D36] transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
