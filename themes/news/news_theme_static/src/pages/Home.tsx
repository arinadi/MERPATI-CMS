import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { HERO_POST, LATEST_POSTS, ESAI_POSTS, LIPUTAN_POSTS, VIDEO_POSTS } from '../data';

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center mb-6">
    <div className="bg-[#3A9D36] text-white px-4 py-1.5 font-bold text-sm tracking-wider">
      {title}
    </div>
    <div className="flex-grow h-px bg-[#3A9D36]"></div>
  </div>
);

const CategoryBlock = ({ title, data }: { title: string, data: typeof ESAI_POSTS }) => (
  <div className="flex flex-col">
    <SectionHeader title={title} />
    <div className="flex flex-col xl:flex-row gap-5">
      {/* Featured */}
      <Link to={`/post/${data.featured.id}`} className="xl:w-1/2 group cursor-pointer block">
        <div className="overflow-hidden rounded-sm mb-3 aspect-[4/3] relative">
          <img 
            src={data.featured.image} 
            alt={data.featured.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 bg-[#3A9D36] text-white px-2 py-1 text-[10px] font-bold">{title}</div>
        </div>
        <h2 className="text-base font-bold leading-tight mb-2 group-hover:text-[#3A9D36] transition-colors line-clamp-3">
          {data.featured.title}
        </h2>
        <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-2">
          <span>OLEH <span className="text-[#3A9D36] font-bold">{data.featured.author}</span></span>
          <span className="w-2 h-2 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[6px]">L</span>
          <span>{data.featured.date}</span>
        </div>
        <p className="text-gray-600 text-xs line-clamp-2">
          {data.featured.excerpt}
        </p>
      </Link>

      {/* List */}
      <div className="xl:w-1/2 flex flex-col gap-4">
        {data.list.slice(0, 3).map((post, index) => (
          <Link to={`/post/${post.id}`} key={index} className="flex gap-3 group cursor-pointer">
            <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col justify-start">
              <h3 className="font-bold text-sm leading-snug group-hover:text-[#3A9D36] transition-colors mb-1 line-clamp-3">
                {post.title}
              </h3>
              <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[6px]">L</span>
                {post.date}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <section className="container mx-auto px-4 mt-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Hero Post */}
          <Link to={`/post/${HERO_POST.id}`} className="lg:w-2/3 group cursor-pointer block">
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] lg:aspect-auto lg:h-[450px]">
              <img 
                src={HERO_POST.image} 
                alt={HERO_POST.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001A33]/90 via-[#001A33]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 lg:p-8 w-full">
                <span className="bg-[#B4F81B] text-[#001A33] px-2 py-1 text-xs font-bold tracking-wider mb-3 inline-block">
                  {HERO_POST.category}
                </span>
                <h1 className="text-white text-2xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-[#B4F81B] transition-colors">
                  {HERO_POST.title}
                </h1>
                <div className="flex items-center text-sm text-gray-300 gap-2">
                  <span>oleh <span className="text-[#B4F81B] font-bold">{HERO_POST.author}</span></span>
                  <span>&mdash;</span>
                  <span>{HERO_POST.date}</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Latest Posts Sidebar */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-[#3A9D36] text-white px-4 py-1.5 font-bold text-sm tracking-wider">
                TERBARU
              </div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <div className="flex flex-col gap-5 flex-grow justify-between">
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
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-12 overflow-hidden">
        <SectionHeader title="LIPUTAN" />
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 animate-marquee w-max">
            {[...LIPUTAN_POSTS, ...LIPUTAN_POSTS, ...LIPUTAN_POSTS, ...LIPUTAN_POSTS].map((post, index) => (
              <Link to={`/post/${post.id}`} key={index} className="group cursor-pointer flex flex-col w-[300px] md:w-[350px] flex-shrink-0">
                <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#3A9D36] text-white px-2 py-1 text-xs font-bold tracking-wider">
                    {post.category}
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-[#3A9D36] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-auto">
                  <span>OLEH <span className="text-[#3A9D36] font-bold">{post.author}</span></span>
                  <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                  <span>{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
          <CategoryBlock title="ESAI" data={ESAI_POSTS} />
          <CategoryBlock title="OTO" data={ESAI_POSTS} />
          <CategoryBlock title="POJOKAN" data={ESAI_POSTS} />
          <CategoryBlock title="KILAS" data={ESAI_POSTS} />
        </div>
      </section>



      <section className="container mx-auto px-4 mb-16">
        <SectionHeader title="VIDEO" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEO_POSTS.map((post, index) => (
            <Link to={`/post/${post.id}`} key={index} className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-sm aspect-video mb-4">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-black/30 text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <PlayCircle size={32} className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl leading-snug mb-2 group-hover:text-[#3A9D36] transition-colors">
                {post.title}
              </h3>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>OLEH <span className="text-[#3A9D36] font-bold">{post.author}</span></span>
                <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/category/video" className="border border-gray-300 text-gray-600 px-8 py-3 text-sm font-bold hover:bg-[#3A9D36] hover:text-white hover:border-[#3A9D36] transition-colors rounded-sm">
            LIHAT SEMUA VIDEO
          </Link>
        </div>
      </section>
    </>
  );
}
