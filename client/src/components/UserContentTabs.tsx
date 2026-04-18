import { useEffect, useState } from "react"
import LikeButton from "./LikeButton"
import {
    fetchPostsByUser,
    fetchMemesByUser,
    type UserPostData,
    type UserMemeData,
} from "../api/posts"

const API_BASE = "http://localhost:8000"

type Tab = "posts" | "memes"

function formatDate(ts: number | null): string {
    if (!ts) return ""
    return new Date(ts * 1000).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
    })
}

interface Props {
    userId: number
}

export default function UserContentTabs({ userId }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("posts")
    const [posts, setPosts] = useState<UserPostData[]>([])
    const [memes, setMemes] = useState<UserMemeData[]>([])
    const [postsLoading, setPostsLoading] = useState(true)
    const [memesLoading, setMemesLoading] = useState(true)

    useEffect(() => {
        setPostsLoading(true)
        fetchPostsByUser(userId)
            .then(data => setPosts(data.slice().reverse()))
            .catch(() => setPosts([]))
            .finally(() => setPostsLoading(false))

        setMemesLoading(true)
        fetchMemesByUser(userId)
            .then(data => setMemes(data.slice().reverse()))
            .catch(() => setMemes([]))
            .finally(() => setMemesLoading(false))
    }, [userId])

    return (
        <div className="profile-content-panel">
            <div className="profile-tab-header">
                <button
                    className={`profile-tab-btn${activeTab === "posts" ? " active" : ""}`}
                    onClick={() => setActiveTab("posts")}
                >
                    Posts
                </button>
                <button
                    className={`profile-tab-btn${activeTab === "memes" ? " active" : ""}`}
                    onClick={() => setActiveTab("memes")}
                >
                    Memes
                </button>
            </div>

            {activeTab === "posts" && (
                postsLoading
                    ? <p className="profile-tab-loading">Loading…</p>
                    : posts.length === 0
                        ? <p className="profile-tab-empty">No posts yet.</p>
                        : <div className="profile-posts-grid">
                            {posts.map(post => (
                                <div key={post.post_id} className="profile-post-card">
                                    <img
                                        src={post.meme_url}
                                        alt="post meme"
                                        className="profile-post-img"
                                    />
                                    <div className="profile-post-body">
                                        {post.caption && (
                                            <p className="profile-post-caption">{post.caption}</p>
                                        )}
                                        <div className="profile-post-meta">
                                            <LikeButton
                                                postId={post.post_id}
                                                initialCount={post.like_count}
                                                initialHasLiked={post.has_liked}
                                            />
                                            <span>{formatDate(post.date_of_creation)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
            )}

            {activeTab === "memes" && (
                memesLoading
                    ? <p className="profile-tab-loading">Loading…</p>
                    : memes.length === 0
                        ? <p className="profile-tab-empty">No memes yet.</p>
                        : <div className="profile-memes-grid">
                            {memes.map(meme => (
                                <img
                                    key={meme.id}
                                    src={`${API_BASE}/resources/${meme.image_resource_filename}`}
                                    alt="meme"
                                    className="profile-meme-thumb"
                                />
                            ))}
                        </div>
            )}
        </div>
    )
}
