import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"
import UserAvatar from "../components/UserAvatar"
import { fetchPosts, type PostData } from "../api/posts"
import "./Home.page.css"

function formatDate(ts: number | null): string {
    if (!ts) return "Unknown date"
    return new Date(ts * 1000).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
    })
}

function HomePage() {
    const [posts, setPosts] = useState<PostData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPosts()
            .then(data => {
                setPosts(data.slice().reverse()) // newest first
                setError(null)
            })
            .catch(() => setError("Failed to load posts."))
            .finally(() => setLoading(false))
    }, [])

    return (
        <>
            <TopButtons />

            <main className="home-container">
                <h1 className="home-title">Posts</h1>

                {loading && <p className="home-loading">Loading posts…</p>}
                {error && <p className="home-error">{error}</p>}
                {!loading && !error && posts.length === 0 && (
                    <p className="home-empty">No posts yet. Be the first!</p>
                )}

                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.post_id} className="post-card">
                            <img
                                src={post.meme_url}
                                alt="meme"
                                className="post-card-image"
                            />
                            <div className="post-card-body">
                                {post.caption && (
                                    <p className="post-card-caption">{post.caption}</p>
                                )}
                                <div className="post-card-meta">
                                    <div className="post-card-creator">
                                        <UserAvatar
                                            username={post.creator_username}
                                            avatarFilename={post.creator_avatar_filename}
                                            size={26}
                                        />
                                        <span>
                                            created by{" "}
                                            <a className="post-card-creator-link" href="#">
                                                {post.creator_username}
                                            </a>
                                        </span>
                                    </div>
                                    <div className="post-card-likes">
                                        ♥ {post.like_count}
                                    </div>
                                    <div className="post-card-date">
                                        {formatDate(post.date_of_creation)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <aside className="create-post">
                <Link to="/post-editor" className="create-button">
                    Create your own post
                </Link>
            </aside>

            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}

export default HomePage