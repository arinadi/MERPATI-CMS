import React from "react";
import Link from "next/link";
import { FeaturedMedia } from "./featured-media";
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

const CategoryBlock = ({ title, posts }: { title: string, posts: PostCardData[] }) => {
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
            <FeaturedMedia 
                  interactive={false}
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
              <div className="w-28 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-sm relative">
                <FeaturedMedia 
                  interactive={false}
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
  const featuredCatSlug = themeOptions?.theme_news_featured_cat as string;
  const videoCatSlug = themeOptions?.theme_news_video_cat as string;

  // Parse category-multi (JSON array of slugs)
  let gridCategorySlugs: string[] = [];
  try {
    const raw = themeOptions?.theme_news_home_categories;
    if (typeof raw === "string") {
      gridCategorySlugs = JSON.parse(raw);
    } else if (Array.isArray(raw)) {
      gridCategorySlugs = raw as string[];
    }
  } catch {
    gridCategorySlugs = [];
  }

  // Execute Parallel Queries
  const [
    heroPostData,
    latestPosts,
    featuredCatRes,
    videoCatRes,
    ...gridCatResults
  ] = await Promise.all([
    heroPostId ? getCachedPostById(heroPostId) : null,
    getLatestPosts(30),
    featuredCatSlug ? getCachedTaxonomyPosts(featuredCatSlug, "category", 8, 0) : null,
    videoCatSlug ? getCachedTaxonomyPosts(videoCatSlug, "category", 4, 0) : null,
    ...gridCategorySlugs.map(slug => getCachedTaxonomyPosts(slug, "category", 4, 0)),
  ]);

  // Smart Defaults
  const heroPost = heroPostData || latestPosts[0];
  const sideLatest = latestPosts.filter(p => p.id !== heroPost?.id).slice(0, 5);

  const adImage = themeOptions?.theme_news_ad_image as string;
  const adUrl = themeOptions?.theme_news_ad_url as string;

  const finalFeatured = featuredCatRes || (latestPosts.length > 5 ? { term: { name: "Sorotan", slug: "sorotan" }, hydratedPosts: latestPosts.slice(5, 13) } : null);
  const finalVideo = videoCatRes || (latestPosts.length > 13 ? { term: { name: "Video", slug: "video" }, hydratedPosts: latestPosts.slice(13, 17) } : null);

  // Filter valid grid categories
  const gridCategories = gridCatResults.filter(Boolean) as NonNullable<typeof featuredCatRes>[];

  return (
    <>
      <section className="container mx-auto px-4 mt-6 md:mt-8 mb-8 md:mb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Hero Post */}
          {heroPost && (
            <Link href={`/${heroPost.slug}`} className="lg:w-2/3 group cursor-pointer block">
              <div className="relative overflow-hidden rounded-sm aspect-[4/3] w-full">
                <FeaturedMedia 
                  interactive={false}
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
            {/* Ad/Banner Space */}
            {adImage ? (
              <div className="w-full mb-6">
                <Link href={adUrl || "#"} target="_blank" rel="noopener noreferrer">
                   <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm group">
                      <FeaturedMedia 
                        interactive={false}
                        src={adImage} 
                        alt="Advertisement" 
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                   </div>
                </Link>
              </div>
            ) : (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-sm mb-6 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mb-2">Advertisement</span>
                <p className="text-xs text-slate-400 text-center px-4">Ruang Iklan / Banner</p>
                {/* Subtle design element */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-full"></div>
              </div>
            )}

            <div className="flex items-center mb-4">
              <div className="text-white px-4 py-1.5 font-bold text-sm tracking-wider uppercase" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
                TERBARU
              </div>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <div className="flex flex-col gap-5 flex-grow justify-between">
              {sideLatest.map((post) => (
                <Link href={`/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-28 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-sm relative">
                    <FeaturedMedia 
                  interactive={false}
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

      {/* Marquee Section (Featured Category) */}
      {finalFeatured && finalFeatured.hydratedPosts.length > 0 && (
        <section className="container mx-auto px-4 mb-8 md:mb-12 overflow-hidden">
          <SectionHeader title={finalFeatured.term.name} />
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-6 animate-marquee w-max hover:pause">
              {/* Duplicate array for endless marquee illusion */}
              {[...finalFeatured.hydratedPosts, ...finalFeatured.hydratedPosts].map((post, index) => (
                <Link href={`/${post.slug}`} key={`${post.id}-${index}`} className="group cursor-pointer flex flex-col w-[300px] md:w-[350px] flex-shrink-0">
                  <div className="relative overflow-hidden rounded-sm aspect-[4/3] mb-4">
                    <FeaturedMedia 
                  interactive={false}
                      src={post.featuredImage || ""} 
                      alt={post.title} 
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-bold tracking-wider uppercase" style={{ backgroundColor: 'var(--news-accent)', color: 'var(--news-primary)' }}>
                      {finalFeatured.term.name}
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

      {/* Grid Categories Section (Dynamic from checkbox selection) */}
      {gridCategories.length > 0 && (
        <section className="container mx-auto px-4 mb-8 md:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
            {gridCategories.map((cat) => (
              <CategoryBlock key={cat.term.slug} title={cat.term.name} posts={cat.hydratedPosts} />
            ))}
          </div>
        </section>
      )}

      {/* Video Category Section */}
      {finalVideo && finalVideo.hydratedPosts.length > 0 && (
        <section className="container mx-auto px-4 mb-10 md:mb-16">
          <SectionHeader title={finalVideo.term.name} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {finalVideo.hydratedPosts.map((post) => (
              <Link href={`/${post.slug}`} key={post.id} className="group cursor-pointer block">
                <div className="relative overflow-hidden rounded-sm aspect-video mb-4">
                  <FeaturedMedia 
                  interactive={false}
                    src={post.featuredImage || ""} 
                    alt={post.title}
                    fill 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
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
