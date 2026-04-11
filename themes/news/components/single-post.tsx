import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Facebook, Twitter, MessageCircle } from "lucide-react";
import { getSocialShareLinks } from "@/lib/utils/social";
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
  
  // Note: we'd ideally pass the canonical URL. For this theme, we'll assume relative slug is enough for getSocialShareLinks or we leave the URL empty to let it fallback if possible.
  const shareLinks = getSocialShareLinks(post.title, `/${post.slug}`, post.excerpt || "", { facebook: true, twitter: true, whatsapp: true, telegram: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <article className="lg:w-2/3">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-[var(--news-accent)]">BERANDA</Link>
            <span>›</span>
            <Link href={`/category/${primaryCat.slug}`} className="hover:text-[var(--news-accent)]">{primaryCat.name}</Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <SafeImage 
              src={authorImage} 
              alt="Author" 
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>oleh <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--news-accent)' }}>{authorName}</span></span>
              <span>&mdash;</span>
              <span>{formattedDate}</span>
            </div>
            <div className="ml-auto text-gray-400 font-serif text-xl hidden sm:block" title="Reading Focus">
              A<span className="text-sm">A</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <div className="relative aspect-[21/9]">
                <SafeImage 
                  src={post.featuredImage} 
                  alt="Featured" 
                  fill
                  className="w-full h-full rounded-sm object-cover"
                  priority
                />
              </div>
              {getFeaturedImageAlt(post.featuredImage) && (
                <p className="text-xs text-gray-500 text-right mt-2 italic">
                  {getFeaturedImageAlt(post.featuredImage)}
                </p>
              )}
            </div>
          )}

          {/* Content & Share */}
          <div className="flex gap-6 relative">
            {/* Sticky Share Buttons */}
            <div className="hidden md:flex flex-col gap-2 sticky top-28 h-max">
              {shareLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-white hover:opacity-90 transition-opacity bg-[var(--news-primary)]"
                  title={`Share on ${link.name}`}
                >
                  {link.id === 'facebook' && <Facebook size={20} />}
                  {link.id === 'twitter' && <Twitter size={20} />}
                  {(link.id === 'whatsapp' || link.id === 'telegram') && <MessageCircle size={20} />}
                </a>
              ))}
            </div>

            {/* Prose Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed prose-a:text-[var(--news-accent)] prose-a:font-bold prose-iframe:aspect-video prose-iframe:w-full prose-iframe:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold mb-6 italic tracking-tighter">ARTIKEL TERKAIT</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.slice(0, 3).map((related) => {
                  const relDate = new Date(related.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <Link href={`/${related.slug}`} key={related.id} className="group cursor-pointer flex flex-col">
                      <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                        <SafeImage 
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
          
          <div className="flex flex-col gap-6 mb-12">
            {popularPosts.length > 0 ? popularPosts.slice(0, 5).map((sidebarPost) => {
              const relDate = new Date(sidebarPost.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <Link href={`/${sidebarPost.slug}`} key={sidebarPost.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                    <SafeImage 
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
