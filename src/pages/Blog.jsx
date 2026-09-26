import { Link } from 'react-router-dom'
import posts from '../data/blog.js'

function Blog() {
  return (
    <section className="page-header blog-page">
      <p className="hero-kicker">From the bakery</p>
      <h1>Notes and stories</h1>

      <div className="blog-layout">
        <div className="blog-list">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <p className="blog-date">{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>

        <aside className="blog-sidebar">
          <div className="sidebar-block">
            <h3>Recent posts</h3>
            {posts.slice(0, 3).map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.slug} className="sidebar-link">
                {post.title}
              </Link>
            ))}
          </div>
          <div className="sidebar-block">
            <h3>Stay updated</h3>
            <p className="hero-sub">New posts every few weeks, mostly about bread.</p>
            <Link to="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Blog