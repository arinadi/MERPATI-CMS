import React from "react";
import Link from "next/link";
import { getPaginationUrl } from "@/lib/utils/navigation";
import { FeaturedMedia } from "./featured-media";
import type { ArchiveProps, PostCardData } from "@/lib/themes";
// Import getLatestPosts if possible, but actually we should just rely on props or a server action
import { getLatestPosts, getCachedTaxonomyPosts } from "@/lib/queries/posts";
import { getCachedOptions } from "@/lib/queries/options";

export default async function Archive({ title, description, posts, pagination }: ArchiveProps) {
  let popularPosts: PostCardData[] = [];
  try {
    const optionsRaw = await getCachedOptions(["theme_news_featured_cat"]);
    const popularCat = optionsRaw["theme_news_featured_cat"];
    
    if (popularCat) {
      const taxonomyResult = await getCachedTaxonomyPosts(popularCat, "category", 5, 0);
      if (taxonomyResult) {
         popularPosts = taxonomyResult.hydratedPosts;
      }
    }
    
    // Fallback to latest posts if category is empty or not set
    if (popularPosts.length === 0) {
      popularPosts = await getLatestPosts(5);
    }
  } catch {
    // silently fail if not available
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Taxonomy Header */}
      <div className="mb-10 border-b-2 border-[var(--news-accent)] pb-6 inline-block">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h1>
        {description && (
          <p className="text-gray-600 max-w-3xl mt-4 font-serif text-lg">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Post List */}
        <div className="lg:w-2/3 flex flex-col gap-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold mb-2">Belum ada artikel</h2>
              <p className="text-gray-500">Belum ada artikel yang diterbitkan untuk kategori ini.</p>
            </div>
          ) : (
            posts.map((post) => {
              const primaryImage = post.featuredImage || "";
              const primaryCat = post.categories?.[0]?.name || title;
              const authorName = post.author?.name || "REDAKSI";
              // Format date: dd MMM yyyy or just use raw if standard
              const formattedDate = new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={post.id} className="flex flex-col md:flex-row gap-6 group">
                  <Link href={`/${post.slug}`} className="w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-sm relative block">
                    <FeaturedMedia 
                      src={primaryImage} 
                      alt={post.title} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 text-white px-2 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
                      {primaryCat.toUpperCase()}
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link href={`/${post.slug}`}>
                      <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--news-accent)] transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                      <span>OLEH <span className="font-bold" style={{ color: 'var(--news-accent)' }}>{authorName.toUpperCase()}</span></span>
                      <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                      <span>{formattedDate}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link href={`/${post.slug}`} className="inline-block border border-gray-300 text-gray-600 px-4 py-2 text-xs font-bold transition-colors w-max hover:bg-[var(--news-accent)] hover:border-[var(--news-accent)] hover:text-white">
                      <span className="hover-bg-accent">BACA SELENGKAPNYA</span>
                    </Link>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {pagination.currentPage > 1 && (
                <Link 
                  href={getPaginationUrl(pagination.basePath, pagination.currentPage - 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 font-bold"
                >
                  &laquo; Prev
                </Link>
              )}
              <span className="px-4 py-2 bg-gray-100 rounded font-bold">
                Halaman {pagination.currentPage} / {pagination.totalPages}
              </span>
              {pagination.currentPage < pagination.totalPages && (
                <Link 
                  href={getPaginationUrl(pagination.basePath, pagination.currentPage + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 font-bold"
                >
                  Next &raquo;
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="flex items-center mb-6">
            <div className="font-bold text-lg flex items-center gap-2 uppercase tracking-wide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9.5a2.5 2.5 0 0 0-2.5-2.5H17" /></svg>
              TERPOPULER
            </div>
            <div className="flex-grow h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="flex flex-col gap-6 sticky top-24">
            {popularPosts.length > 0 ? popularPosts.map((post: PostCardData) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <Link href={`/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                    <FeaturedMedia 
                      src={post.featuredImage || ""} 
                      alt={post.title} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-sm leading-snug group-hover:text-[var(--news-accent)] transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                      {formattedDate}
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div className="text-sm text-gray-500">Belum ada artikel.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
