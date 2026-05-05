import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./blogger.db')

const seedPosts = [
  {
    title: 'Building Scalable React Apps in 2026',
    excerpt: 'A practical system design guide for component architecture, state, and DX.',
    category: 'Frontend',
    image_url:
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Node.js API Performance Patterns',
    excerpt: 'Caching, queueing, and async workloads that keep APIs fast at scale.',
    category: 'Backend',
    image_url:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Ship Better Products with AI Workflows',
    excerpt: 'How teams integrate LLM-powered assistants into product cycles.',
    category: 'AI',
    image_url:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Database Indexing for Real SaaS Traffic',
    excerpt: 'Use indexes and query plans to keep SQL responsive under load.',
    category: 'Database',
    image_url:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cloud Cost Optimization for Startups',
    excerpt: 'A step-by-step strategy to reduce cloud bills without hurting reliability.',
    category: 'Cloud',
    image_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Type-Safe APIs with End-to-End Validation',
    excerpt: 'Improve reliability with shared contracts and schema validation.',
    category: 'Backend',
    image_url:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Design Systems that Scale with Teams',
    excerpt: 'Token-driven styling and reusable patterns for large frontends.',
    category: 'Frontend',
    image_url:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Production Monitoring That Actually Helps',
    excerpt: 'Set alerts and dashboards that catch issues before users do.',
    category: 'DevOps',
    image_url:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Microservices Communication Patterns',
    excerpt: 'When to choose events, queues, gRPC, or REST between services.',
    category: 'Backend',
    image_url:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Practical Kubernetes for Developers',
    excerpt: 'Deploy apps confidently with health checks, autoscaling, and logs.',
    category: 'DevOps',
    image_url:
      'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Zero-Downtime Database Migrations',
    excerpt: 'Safe migration patterns for high-traffic production systems.',
    category: 'Database',
    image_url:
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Modern CSS Architecture in React',
    excerpt: 'Scalable styling with component-level patterns and design tokens.',
    category: 'Frontend',
    image_url:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'API Security Checklist for Teams',
    excerpt: 'Auth, rate limiting, and validation essentials for public endpoints.',
    category: 'Security',
    image_url:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Edge Functions and Global Performance',
    excerpt: 'Serve dynamic content closer to users with edge compute.',
    category: 'Cloud',
    image_url:
      'https://images.unsplash.com/photo-1451187863213-d1bcbaae3fa3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Prompt Engineering for Product Teams',
    excerpt: 'Reliable prompt patterns and evaluation loops for AI features.',
    category: 'AI',
    image_url:
      'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Web Accessibility that Improves UX',
    excerpt: 'Better contrast, keyboard support, and semantic markup in practice.',
    category: 'Frontend',
    image_url:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Event-Driven Systems with Confidence',
    excerpt: 'Idempotency, retries, and observability for async platforms.',
    category: 'Backend',
    image_url:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Data Modeling for Analytics Pipelines',
    excerpt: 'Design warehouse-friendly schemas for trustworthy metrics.',
    category: 'Database',
    image_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'CI/CD Pipelines that Scale with Teams',
    excerpt: 'Parallel jobs, artifact caching, and release confidence.',
    category: 'DevOps',
    image_url:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Building Real-Time Apps with WebSockets',
    excerpt: 'Patterns for presence, chat, and collaborative experiences.',
    category: 'Backend',
    image_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Server Components and Streaming UI',
    excerpt: 'Improve perceived performance with partial rendering strategies.',
    category: 'Frontend',
    image_url:
      'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80',
  },
]

export const initializeDatabase = () =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          category TEXT NOT NULL,
          image_url TEXT NOT NULL
        )`,
      )

      db.get('SELECT COUNT(*) AS count FROM posts', (countError, row) => {
        if (countError) {
          reject(countError)
          return
        }

        if (row.count > 0) {
          resolve()
          return
        }

        const insert = db.prepare(
          'INSERT INTO posts (title, excerpt, category, image_url) VALUES (?, ?, ?, ?)',
        )
        seedPosts.forEach((post) =>
          insert.run(post.title, post.excerpt, post.category, post.image_url),
        )
        insert.finalize((insertError) => {
          if (insertError) reject(insertError)
          else resolve()
        })
      })
    })
  })

export default db
