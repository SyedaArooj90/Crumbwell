import { useParams, Link } from 'react-router-dom'
import posts from '../data/blog.js'

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section className="page-header">
        <h1>Post not found</h1>
        <Link to="/blog">Back to the blog</Link>
      </section>
    )
  }

  return (
    <section className="page-header blog-post">
      <p className="hero-kicker">
        <Link to="/blog">Blog</Link> / {post.date}
      </p>
      <h1>{post.title}</h1>
      <p className="hero-sub">{post.content}</p>
    </section>
  )
}

export default BlogPost