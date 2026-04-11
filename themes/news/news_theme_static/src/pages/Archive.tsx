import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ESAI_POSTS, LATEST_POSTS } from '../data';

export default function Archive() {
  const { category } = useParams();
  const title = category ? category.toUpperCase() : 'ESAI';

  // Combine featured and list for display
  const posts = [ESAI_POSTS.featured, ...ESAI_POSTS.list];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Taxonomy Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 max-w-3xl">
          Esai berisi tulisan menarik tentang apa saja, bisa mengenai peristiwa atau isu yang sedang diperbincangkan maupun hal lain yang dianggap perlu untuk dituliskan. Bisa tema sosial, agama, politik, seni, pokoknya terserah.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Post List */}
        <div className="lg:w-2/3 flex flex-col gap-10">
          {posts.map((post, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 group">
              <Link to={`/post/${post.id}`} className="w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-sm relative block">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-[#3A9D36] text-white px-2 py-1 text-xs font-bold">
                  {title}
                </div>
              </Link>
              <div className="flex flex-col justify-center">
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-[#3A9D36] transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <span>OLEH <span className="text-[#3A9D36] font-bold">{post.author || "REDAKSI"}</span></span>
                  <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                  <span>{post.date}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/post/${post.id}`} className="inline-block border border-gray-300 text-gray-600 px-4 py-2 text-xs font-bold hover:bg-[#3A9D36] hover:text-white hover:border-[#3A9D36] transition-colors w-max">
                  BACA SELENGKAPNYA
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="flex items-center mb-6">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-2.5-2.5H17" /></svg>
              Artikel Terbaru
            </div>
            <div className="flex-grow h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="flex flex-col gap-6">
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
    </div>
  );
}
