import { useState } from "react"
import { toggleLike } from "../api/posts"
import { useAuth } from "./AuthProvider"
import "./LikeButton.css"

interface Props {
    postId: number
    initialCount: number
    initialHasLiked: boolean
}

export default function LikeButton({ postId, initialCount, initialHasLiked }: Props) {
    const { isAuthenticated } = useAuth()
    const [count, setCount] = useState(initialCount)
    const [hasLiked, setHasLiked] = useState(initialHasLiked)
    const [busy, setBusy] = useState(false)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isAuthenticated || busy) return
        setBusy(true)
        try {
            const res = await toggleLike(postId)
            setHasLiked(res.has_liked)
            setCount(res.like_count)
        } catch {
            // swallow — keep previous state
        } finally {
            setBusy(false)
        }
    }

    const title = !isAuthenticated
        ? "Log in to like posts"
        : hasLiked ? "Unlike" : "Like"

    return (
        <button
            type="button"
            className={`like-button${hasLiked ? " liked" : ""}`}
            onClick={handleClick}
            disabled={busy || !isAuthenticated}
            title={title}
            aria-pressed={hasLiked}
        >
            <span className="like-button-icon" aria-hidden="true">
                {hasLiked ? "♥" : "♡"}
            </span>
            <span className="like-button-count">{count}</span>
        </button>
    )
}
