import { useEffect, useMemo, useState, useRef } from 'react'
import './App.css'

const fallbackPosts = [
  {
    id: 'f1',
    title: 'Create Better Developer Habits',
    excerpt: 'Simple routines that improve coding speed and code quality every week.',
    category: 'Personal',
    image_url:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'f2',
    title: 'My Learning Notes on System Design',
    excerpt: 'How I break down scalability topics while building side projects.',
    category: 'Personal',
    image_url:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'f3',
    title: 'Weekly AI Tools I Actually Use',
    excerpt: 'A practical list of tools that save real development time.',
    category: 'Personal',
    image_url:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
]

// Track locally-published post IDs so we can show them in the personal section
const localPostIds = new Set()

// Default placeholder — only used if user publishes without picking an image
const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'

function App() {
  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [undoPost, setUndoPost] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false) // mobile nav toggle
  const [personalForm, setPersonalForm] = useState({
    title: '',
    excerpt: '',
    category: '',
    author: '',
    // FIX: Start with empty string — no random image preset
    image_url: '',
  })

  // FIX: Track the preview URL separately (could be a local blob URL or uploaded base64)
  const [imagePreview, setImagePreview] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts')
        if (!response.ok) throw new Error('API error')
        const data = await response.json()
        setPosts(Array.isArray(data) && data.length ? data : fallbackPosts)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        setPosts(fallbackPosts)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && !e.target.closest('.topbar')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [menuOpen])

  const categories = useMemo(() => {
    const unique = new Set(posts.map((post) => post.category))
    return ['All', ...unique]
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [posts, activeCategory])

  const featuredPost = filteredPosts[0]
  const sidePosts = filteredPosts.slice(1, 4)
  const latestPosts = filteredPosts.slice(4)

  const personalPosts = posts.filter(
    (post) =>
      localPostIds.has(post.id) ||
      String(post.category).toLowerCase().includes('personal'),
  )

  const editorPicks = filteredPosts.slice(0, 5)

  const formatDate = (dateValue) => {
    const value = dateValue ? new Date(dateValue) : new Date()
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // FIX: Image select — show preview immediately in UI before publish
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create a live object URL for instant preview display
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)

    // Also read as base64 for storage/posting
    const reader = new FileReader()
    reader.onload = () => {
      setPersonalForm((current) => ({
        ...current,
        image_url: String(reader.result || ''),
      }))
    }
    reader.readAsDataURL(file)
  }

  const handlePersonalPostSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const postedAt = new Date().toISOString()
    const localId = `local-${Date.now()}`

    // FIX: Use user-selected image or fall back to a consistent default, never random
    const resolvedImage = personalForm.image_url || DEFAULT_PLACEHOLDER

    const newPost = {
      id: localId,
      ...personalForm,
      image_url: resolvedImage,
      author: personalForm.author || 'SruthySaravanan',
      published_at: postedAt,
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...personalForm, image_url: resolvedImage, published_at: postedAt }),
      })
      if (response.ok) {
        const data = await response.json()
        newPost.id = data.id || localId
      }
    } catch {
      // Server down — still publish locally
    }

    localPostIds.add(newPost.id)
    setPosts((prev) => [newPost, ...prev])
    setActiveCategory('All')

    // FIX: Reset form AND preview after publish
    setPersonalForm({
      title: '',
      excerpt: '',
      category: '',
      author: '',
      image_url: '',
    })
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''

    alert('Post published successfully ✅')
    setIsSubmitting(false)
  }

  const handleDeletePost = (postId) => {
    const postToDelete = posts.find((p) => p.id === postId)
    if (!postToDelete) return

    setPosts((prev) => prev.filter((p) => p.id !== postId))
    localPostIds.delete(postId)

    setUndoPost(postToDelete)
    const timer = setTimeout(async () => {
      setUndoPost(null)
      try {
        await fetch(`http://localhost:5000/api/posts/${postId}`, { method: 'DELETE' })
      } catch {
        // Server unavailable — already removed from UI
      }
    }, 5000)

    postToDelete._undoTimer = timer
  }

  const handleUndoDelete = () => {
    if (!undoPost) return
    clearTimeout(undoPost._undoTimer)
    localPostIds.add(undoPost.id)
    setPosts((prev) => [undoPost, ...prev])
    setUndoPost(null)
  }

  return (
    <main className="page">
      {/* FIX: Mobile-responsive topbar with hamburger menu */}
      <header className="topbar">
        <h1 className="topbar-logo">Blogger Site</h1>

        {/* Hamburger button — visible only on mobile */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav — collapses into dropdown on mobile */}
        <nav className={`topbar-nav ${menuOpen ? 'nav-open' : ''}`}>
          <a href="#featured" onClick={() => setMenuOpen(false)}>Featured</a>
          <a href="#latest" onClick={() => setMenuOpen(false)}>Latest</a>
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>Newsletter</a>
          <a href="#personal-blog" className="topbar-cta" onClick={() => setMenuOpen(false)}>
            Create Post
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="hero-badge">Technology Insights</p>
          <h2>Explore the future of software, AI, cloud, and product innovation.</h2>
          <p>
            A modern blogging experience inspired by your Figma direction, with smooth
            interactions and curated tech stories.
          </p>
          <div className="hero-actions">
            <a href="#latest">Explore Articles</a>
            <a href="#personal-blog" className="ghost">
              Write My Blog
            </a>
          </div>
        </div>
        <img src="/blog-hero-illustration.svg" alt="Blog writing illustration" />
      </section>

      <section className="category-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      {loading ? (
        <p className="loading">Loading posts...</p>
      ) : (
        <section id="featured" className="featured-grid">
          {featuredPost ? (
            <>
              <article className="featured-card">
                <img src={featuredPost.image_url} alt={featuredPost.title} />
                <div>
                  <p>{featuredPost.category}</p>
                  <h3>{featuredPost.title}</h3>
                  <p>{featuredPost.excerpt}</p>
                  <div className="card-meta">
                    <span>{featuredPost.author || 'SruthySaravanan'}</span>
                    <span>{formatDate(featuredPost.published_at)}</span>
                  </div>
                </div>
              </article>
              <div className="stack">
                {sidePosts.map((post) => (
                  <article key={post.id} className="side-card">
                    <img src={post.image_url} alt={post.title} />
                    <div>
                      <p>{post.category}</p>
                      <h4>{post.title}</h4>
                      <p>{post.excerpt}</p>
                      <div className="card-meta">
                        <span>{post.author || 'SruthySaravanan'}</span>
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="loading">No posts found for this category.</p>
          )}
        </section>
      )}

      <section id="latest">
        <div className="section-title">
          <h3>Latest Articles</h3>
          <span>Interactive, responsive, and built with React + Node.js</span>
        </div>
        <div className="latest-grid">
          {latestPosts.map((post) => (
            <article key={post.id} className="post-card">
              <img src={post.image_url} alt={post.title} />
              <div>
                <p>{post.category}</p>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className="card-meta">
                  <span>{post.author || 'SruthySaravanan'}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="newsletter" className="newsletter">
        <h3>Stay Updated</h3>
        <p>Get weekly deep dives on frontend, backend, and AI engineering.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            alert('Thanks for subscribing!')
          }}
        >
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section id="personal-blog" className="personal-blog">
        <div className="personal-blog-header">
          <h3>My Blog Section</h3>
          <p>Write and publish your own post directly from this page.</p>
        </div>

        <form className="personal-form" onSubmit={handlePersonalPostSubmit}>
          <input
            type="text"
            placeholder="Blog title"
            value={personalForm.title}
            onChange={(event) =>
              setPersonalForm((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
          <textarea
            placeholder="Short blog excerpt"
            value={personalForm.excerpt}
            onChange={(event) =>
              setPersonalForm((current) => ({ ...current, excerpt: event.target.value }))
            }
            rows={4}
            required
          />
          <div className="personal-form-row">
            <input
              type="text"
              placeholder="Category (e.g. Name, Career, Learning)"
              value={personalForm.category}
              onChange={(event) =>
                setPersonalForm((current) => ({ ...current, category: event.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="Blogger name"
              value={personalForm.author}
              onChange={(event) =>
                setPersonalForm((current) => ({ ...current, author: event.target.value }))
              }
              required
            />
          </div>

          {/* FIX: Image upload with live preview */}
          <div className="image-upload-box">
            <label htmlFor="blog-cover-upload" className="image-upload-label">
              <span className="upload-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v11m0-11l-4 4m4-4l4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                </svg>
              </span>
              <span>{imagePreview ? 'Change image' : 'Import blog image from your browser'}</span>
            </label>
            <input
              id="blog-cover-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleImageSelect}
            />
            <p className="upload-hint">
              {imagePreview
                ? 'Image selected — preview shown below.'
                : 'Choose a JPG/PNG/WebP image for your blog card. If skipped, a default image is used.'}
            </p>

            {/* FIX: Live image preview shown immediately after selecting */}
            {imagePreview && (
              <div className="image-preview-wrap">
                <img
                  src={imagePreview}
                  alt="Blog cover preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="image-preview-remove"
                  onClick={() => {
                    setImagePreview('')
                    setPersonalForm((current) => ({ ...current, image_url: '' }))
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish My Blog'}
          </button>
        </form>

        <div className="personal-cards">
          {personalPosts.length > 0 ? (
            personalPosts.map((post) => (
              <article key={post.id} className="post-card post-card--deletable">
                <img src={post.image_url} alt={post.title} />
                <div>
                  <p>{post.category}</p>
                  <h4>{post.title}</h4>
                  <p>
                    {post.excerpt.length > 92
                      ? `${post.excerpt.slice(0, 92)}...`
                      : post.excerpt}
                  </p>
                  <div className="card-meta">
                    <span>{post.author || 'SruthySaravanan'}</span>
                    <span>{formatDate(post.published_at)}</span>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="loading">No personal blogs yet. Publish your first one above.</p>
          )}
        </div>
      </section>

      {/* Undo delete toast */}
      {undoPost && (
        <div className="undo-toast">
          <span>Post deleted</span>
          <button type="button" onClick={handleUndoDelete}>
            ↩ Undo
          </button>
        </div>
      )}
    </main>
  )
}

export default App