import React from 'react';
import { Header, Footer } from '@/components/theme/LayoutComponents';
import Link from 'next/link';

const dummyPosts = [
  { slug: 'breaking-news', title: 'Breaking News: AI takes over the world', excerpt: 'In a stunning turn of events...', author: 'Arinadi', date: 'Feb 28, 2026' },
  { slug: 'tech-update', title: 'New Tech Update', excerpt: 'Apple released a new shiny thing...', author: 'Journalist 1', date: 'Feb 27, 2026' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '32px' }}>
          {dummyPosts.map(post => (
            <article key={post.slug} style={{ borderBottom: '1px solid var(--pub-border)', paddingBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </h2>
              <div style={{ color: 'var(--pub-muted)', fontSize: '14px', marginBottom: '16px' }}>
                By {post.author} · {post.date}
              </div>
              <p style={{ color: 'var(--pub-text)' }}>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
