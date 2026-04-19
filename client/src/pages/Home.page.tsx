import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"
import UserAvatar from "../components/UserAvatar"
import LikeButton from "../components/LikeButton"
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
                setPosts(data.slice().reverse())
                setError(null)
            })
            .catch(() => setError("Failed to load posts."))
            .finally(() => setLoading(false))
    }, [])

    return (
        <>
            <TopButtons />

            <main className="home-container">
                {loading && <p className="home-loading">Loading posts…</p>}
                {error && <p className="home-error">{error}</p>}
                {!loading && !error && posts.length === 0 && (
                    <p className="home-empty">No posts yet. Be the first!</p>
                )}

                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.post_id} className="post-card">

                            {/* Шапка: автор поста + дата */}
                            <div className="post-card-header">
                                <UserAvatar
                                    username={post.creator_username}
                                    avatarFilename={post.creator_avatar_filename}
                                    size={36}
                                />
                                <div className="post-card-header-info">
                                    <Link
                                        to={`/users/${post.creator_id}`}
                                        className="post-card-username"
                                    >
                                        {post.creator_username}
                                    </Link>
                                    <span className="post-card-date">
                                        {formatDate(post.date_of_creation)}
                                    </span>
                                </div>
                            </div>

                            {/* Картинка */}
                            <img
                                src={post.meme_url}
                                alt="meme"
                                className="post-card-image"
                            />

                            {/* Низ: caption + лайки + автор мему */}
                            <div className="post-card-body">
                                {post.caption && (
                                    <p className="post-card-caption">{post.caption}</p>
                                )}
                                <div className="post-card-meta">
                                    <div className="post-card-likes">
                                        <LikeButton
                                            postId={post.post_id}
                                            initialCount={post.like_count}
                                            initialHasLiked={post.has_liked}
                                        />
                                    </div>
                                </div>
                                <div className="post-card-creator">
                                    <span>
                                        meme created by{" "}
                                        <Link to={`/users/${post.meme_creator_id}`} className="post-card-creator-link">
                                            {post.meme_creator_username}
                                        </Link>
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <aside className="create-post">
                    <Link to="/post-editor" className="create-button">
                        Create your own post
                    </Link>
                </aside>
            </main>

            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}

export default HomePage
