import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { FeaturedMedia } from "./featured-media";
import { ShareButtons } from "./share-buttons";
import { getFeaturedImageAlt } from "@/lib/utils/featured-image";
import type { SinglePostProps, PostCardData } from "@/lib/themes";
import { getCachedTaxonomyPosts, getLatestPosts } from "@/lib/queries/posts";
import { getCachedOptions } from "@/lib/queries/options";

export default async function SinglePost({ post, relatedPosts }: SinglePostProps) {
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
    
    if (popularPosts.length === 0) {
      popularPosts = await getLatestPosts(5);
    }
  } catch {
    popularPosts = await getLatestPosts(5);
  }
  const authorName = post.author?.name || "REDAKSI";
  const authorImage = post.author?.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName) + "&background=random";
  const primaryCat = post.categories?.[0] || { name: "UMUM", slug: "umum" };
  const formattedDate = new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <article className="lg:w-2/3">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-[var(--news-accent)]">BERANDA</Link>
            <span>›</span>
            <Link href={`/category/${primaryCat.slug}`} className="hover:text-[var(--news-accent)]">{primaryCat.name}</Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5 md:mb-8">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-6 md:mb-8">
              <div className="relative aspect-[4/3]">
                <FeaturedMedia 
                  src={post.featuredImage} 
                  alt="Featured" 
                  fill
                  className="w-full h-full rounded-sm object-cover"
                  priority
                />
              </div>
              {getFeaturedImageAlt(post.featuredImage) && (
                <p className="text-xs text-gray-400 text-right mt-2 italic">
                  {getFeaturedImageAlt(post.featuredImage)}
                </p>
              )}
            </div>
          )}

          {/* Meta & Share Row (Default style) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10 py-4 border-y border-gray-100">
            <div className="flex items-center gap-4">
              <SafeImage 
                src={authorImage} 
                alt="Author" 
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="text-sm text-gray-500 flex flex-col justify-center">
                <div className="font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--news-accent)' }}>{authorName}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">{formattedDate}</div>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <ShareButtons 
                title={post.title} 
                excerpt={post.excerpt || ""} 
              />
            </div>
          </div>

          {/* Content & Share */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Sticky Share Buttons */}
            <div className="hidden md:flex flex-col gap-2 sticky top-[140px] h-max z-30">
              <ShareButtons 
                title={post.title} 
                excerpt={post.excerpt || ""} 
                orientation="vertical"
              />
            </div>

            {/* Prose Content */}
            <div 
               className="prose prose-lg max-w-none flex-1 min-w-0 text-gray-800 font-serif leading-relaxed prose-a:text-[var(--news-accent)] prose-a:font-bold prose-iframe:aspect-video prose-iframe:w-full prose-iframe:rounded-lg"
               dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-10 pt-6 md:mt-12 md:pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold mb-6 italic tracking-tighter">ARTIKEL TERKAIT</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.slice(0, 3).map((related) => {
                  const relDate = new Date(related.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <Link href={`/${related.slug}`} key={related.id} className="group cursor-pointer flex flex-col">
                      <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                        <FeaturedMedia 
                          src={related.featuredImage || ""} 
                          alt={related.title} 
                          fill
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-bold text-base leading-snug mb-2 group-hover:text-[var(--news-accent)] transition-colors line-clamp-3">
                        {related.title}
                      </h4>
                      <div className="text-xs text-gray-500 mt-auto uppercase tracking-widest">
                        {relDate}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="flex items-center mb-6">
            <div className="font-bold text-lg flex items-center gap-2 uppercase tracking-wide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              TERPOPULER
            </div>
            <div className="flex-grow h-px bg-gray-200 ml-4"></div>
          </div>
          
          <div className="flex flex-col gap-6 mb-8 md:mb-12">
            {popularPosts.length > 0 ? popularPosts.slice(0, 5).map((sidebarPost) => {
              const relDate = new Date(sidebarPost.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <Link href={`/${sidebarPost.slug}`} key={sidebarPost.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                    <FeaturedMedia 
                      src={sidebarPost.featuredImage || ""} 
                      alt={sidebarPost.title} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-sm leading-snug group-hover:text-[var(--news-accent)] transition-colors line-clamp-3">
                      {sidebarPost.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                      {relDate}
                    </div>
                  </div>
                </Link>
              );
            }) : (
               <div className="text-sm text-gray-500">Belum ada saran artikel.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
