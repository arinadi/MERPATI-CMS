import React from "react";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { getCachedTaxonomyPosts, getLatestPosts, getCachedPostById } from "@/lib/queries/posts";
import type { HomeProps, PostCardData } from "@/lib/themes";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center mb-6">
    <div className="text-white px-4 py-1.5 font-bold text-sm tracking-wider uppercase" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
      {title}
    </div>
    <div className="flex-grow h-px" style={{ backgroundColor: 'var(--news-accent)' }}></div>
  </div>
);

const CategoryBlock = ({ title, posts, slug }: { title: string, posts: PostCardData[], slug: string }) => {
  if (!posts || posts.length === 0) return null;
  const featured = posts[0];
  const list = posts.slice(1, 4);

  return (
    <div className="flex flex-col">
      <SectionHeader title={title} />
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Featured */}
        <Link href={`/${featured.slug}`} className="xl:w-1/2 group cursor-pointer block">
          <div className="overflow-hidden rounded-sm mb-3 aspect-[4/3] relative">
            <SafeImage 
              src={featured.featuredImage || ""} 
              alt={featured.title} 
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 text-white px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
              {title.toUpperCase()}
            </div>
          </div>
          <h2 className="text-base font-bold leading-tight mb-2 group-hover:text-[var(--news-accent)] transition-colors line-clamp-3">
            {featured.title}
          </h2>
          <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-2">
            <span>OLEH <span className="font-bold" style={{ color: 'var(--news-accent)' }}>{featured.author?.name?.toUpperCase() || "REDAKSI"}</span></span>
            <span className="w-2 h-2 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[6px]">L</span>
            <span>{new Date(featured.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <p className="text-gray-600 text-xs line-clamp-2">
            {featured.excerpt}
          </p>
        </Link>

        {/* List */}
        <div className="xl:w-1/2 flex flex-col gap-4">
          {list.map((post) => (
            <Link href={`/${post.slug}`} key={post.id} className="flex gap-3 group cursor-pointer">
              <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                <SafeImage 
                  src={post.featuredImage || ""} 
                  alt={post.title} 
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-start">
                <h3 className="font-bold text-sm leading-snug group-hover:text-[var(--news-accent)] transition-colors mb-1 line-clamp-3">
                  {post.title}
                </h3>
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[6px]">L</span>
                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default async function Home({ themeOptions }: HomeProps) {
  // Fetch Theme Options
  const heroPostId = themeOptions?.theme_news_hero_post as string;
  const catSlug1 = themeOptions?.theme_news_home_cat_1 as string;
  const catSlug2 = themeOptions?.theme_news_home_cat_2 as string;
  const catSlug3 = themeOptions?.theme_news_home_cat_3 as string;
  const catSlug4 = themeOptions?.theme_news_home_cat_4 as string;
  const videoCatSlug = themeOptions?.theme_news_home_video_cat as string;

  // Execute Parallel Queries
  const [
    heroPostData,
    latestPosts,
    cat1Res,
    cat2Res,
    cat3Res,
    cat4Res,
    videoCatRes
  ] = await Promise.all([
    heroPostId ? getCachedPostById(heroPostId) : null,
    getLatestPosts(30), // We fetch 30 to serve as a smart default pool
    catSlug1 ? getCachedTaxonomyPosts(catSlug1, "category", 8, 0) : null,
    catSlug2 ? getCachedTaxonomyPosts(catSlug2, "category", 4, 0) : null,
    catSlug3 ? getCachedTaxonomyPosts(catSlug3, "category", 4, 0) : null,
    catSlug4 ? getCachedTaxonomyPosts(catSlug4, "category", 4, 0) : null,
    videoCatSlug ? getCachedTaxonomyPosts(videoCatSlug, "category", 4, 0) : null,
  ]);

  // Smart Defaults
  const heroPost = heroPostData || latestPosts[0];
  const sideLatest = latestPosts.filter(p => p.id !== heroPost?.id).slice(0, 5);

  const finalCat1 = cat1Res || (latestPosts.length > 5 ? { term: { name: "PILIHAN REDAKSI", slug: "pilihan" }, hydratedPosts: latestPosts.slice(5, 13) } : null);
  const finalCat2 = cat2Res || (latestPosts.length > 13 ? { term: { name: "ARTIKEL 1", slug: "artikel-1" }, hydratedPosts: latestPosts.slice(13, 17) } : null);
  const finalCat3 = cat3Res || (latestPosts.length > 17 ? { term: { name: "ARTIKEL 2", slug: "artikel-2" }, hydratedPosts: latestPosts.slice(17, 21) } : null);
  const finalCat4 = cat4Res || (latestPosts.length > 21 ? { term: { name: "ARTIKEL 3", slug: "artikel-3" }, hydratedPosts: latestPosts.slice(21, 25) } : null);
  const finalVideo = videoCatRes || (latestPosts.length > 25 ? { term: { name: "VIDEO/SOROTAN", slug: "sorotan" }, hydratedPosts: latestPosts.slice(25, 29) } : null);

  return (
    <>
      <section className="container mx-auto px-4 mt-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Hero Post */}
          {heroPost && (
            <Link href={`/${heroPost.slug}`} className="lg:w-2/3 group cursor-pointer block">
              <div className="relative overflow-hidden rounded-sm aspect-[16/9] lg:aspect-auto lg:h-[450px]">
                <SafeImage 
                  src={heroPost.featuredImage || ""} 
                  alt={heroPost.title} 
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001A33]/90 via-[#001A33]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 lg:p-8 w-full">
                  <span className="text-[var(--news-primary)] px-2 py-1 text-xs font-bold tracking-wider mb-3 inline-block uppercase" style={{ backgroundColor: 'var(--news-accent)' }}>
                    {heroPost.categories?.[0]?.name || "SOROTAN"}
                  </span>
                  <h1 className="text-white text-2xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-[var(--news-accent)] transition-colors">
                    {heroPost.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-300 gap-2">
                    <span>oleh <span className="font-bold uppercase" style={{ color: 'var(--news-accent)' }}>{heroPost.author?.name || "REDAKSI"}</span></span>
                    <span>&mdash;</span>
                    <span>{new Date(heroPost.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Latest Posts Sidebar */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="text-white px-4 py-1.5 font-bold text-sm tracking-wider uppercase" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
                TERBARU
              </div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <div className="flex flex-col gap-5 flex-grow justify-between">
              {sideLatest.map((post) => (
                <Link href={`/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-sm relative">
                    <SafeImage 
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
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section (Category 1) */}
      {finalCat1 && finalCat1.hydratedPosts.length > 0 && (
        <section className="container mx-auto px-4 mb-12 overflow-hidden">
          <SectionHeader title={finalCat1.term.name} />
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-6 animate-marquee w-max hover:pause">
              {/* Duplicate array for endless marquee illusion */}
              {[...finalCat1.hydratedPosts, ...finalCat1.hydratedPosts].map((post, index) => (
                <Link href={`/${post.slug}`} key={`${post.id}-${index}`} className="group cursor-pointer flex flex-col w-[300px] md:w-[350px] flex-shrink-0">
                  <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                    <SafeImage 
                      src={post.featuredImage || ""} 
                      alt={post.title} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-bold tracking-wider uppercase" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
                      {finalCat1.term.name}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-[var(--news-accent)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-auto">
                    <span>OLEH <span className="font-bold uppercase" style={{ color: 'var(--news-accent)' }}>{post.author?.name || "REDAKSI"}</span></span>
                    <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid Categories Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
          {finalCat2 && finalCat2.hydratedPosts.length > 0 && <CategoryBlock title={finalCat2.term.name} posts={finalCat2.hydratedPosts} slug={finalCat2.term.name} />}
          {finalCat3 && finalCat3.hydratedPosts.length > 0 && <CategoryBlock title={finalCat3.term.name} posts={finalCat3.hydratedPosts} slug={finalCat3.term.name} />}
          {finalCat4 && finalCat4.hydratedPosts.length > 0 && <CategoryBlock title={finalCat4.term.name} posts={finalCat4.hydratedPosts} slug={finalCat4.term.name} />}
        </div>
      </section>

      {/* Video Category Section */}
      {finalVideo && finalVideo.hydratedPosts.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <SectionHeader title={finalVideo.term.name} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {finalVideo.hydratedPosts.map((post) => (
              <Link href={`/${post.slug}`} key={post.id} className="group cursor-pointer block">
                <div className="relative overflow-hidden rounded-sm aspect-video mb-4">
                  <SafeImage 
                    src={post.featuredImage || ""} 
                    alt={post.title}
                    fill 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-black/30 text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <PlayCircle size={32} className="ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-xl leading-snug mb-2 group-hover:text-[var(--news-accent)] transition-colors">
                  {post.title}
                </h3>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>OLEH <span className="font-bold uppercase" style={{ color: 'var(--news-accent)' }}>{post.author?.name || "REDAKSI"}</span></span>
                  <span className="w-3 h-3 inline-block rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href={`/category/${finalVideo.term.slug}`} className="border border-gray-300 text-gray-600 px-8 py-3 text-sm font-bold transition-colors rounded-sm uppercase tracking-wider hover:bg-[var(--news-accent)] hover:text-[var(--news-primary)]">
              <span className="hover-bg-accent">LIHAT SEMUA {finalVideo.term.name}</span>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
