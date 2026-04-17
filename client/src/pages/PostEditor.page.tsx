import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopButtons from "../buttons/TopButtons/TopButtons";
import { useAuth } from "../components/AuthProvider";
import { fetchPublishedMemes, createPost } from "../api/posts";
import "./PostEditor.page.css";

type Meme = {
    meme_id: number;
    url: string;
    top_text: string | null;
    bottom_text: string | null;
};

export default function PostEditorPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [memes, setMemes] = useState<Meme[]>([]);
    const [selectedMemeId, setSelectedMemeId] = useState<number | null>(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchPublishedMemes()
            .then(setMemes)
            .catch(() => setError("Failed to load memes."))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async () => {
        if (!user) { setError("You must be logged in."); return; }
        if (!selectedMemeId) { setError("Please select a meme."); return; }
        setSubmitting(true);
        setError(null);
        try {
            const res = await createPost({
                creator_id: parseInt(user.id),
                meme_id: selectedMemeId,
                caption: caption.trim() || undefined,
            });
            setSuccess(res.post_id);
        } catch {
            setError("Failed to create post.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <TopButtons />
            <div className="post-editor-page">
                <h1 className="post-editor-title">Create a Post</h1>

                {!user && (
                    <p className="post-editor-warning">⚠️ You must be logged in to create a post.</p>
                )}

                <div className="post-editor-caption-row">
                    <label className="post-editor-label">Caption (optional):</label>
                    <textarea
                        className="post-editor-caption"
                        placeholder="Add a caption…"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={3}
                        maxLength={500}
                    />
                </div>

                <h2 className="post-editor-subtitle">Select a meme:</h2>

                {loading && <p className="post-editor-loading">Loading memes…</p>}
                {error && <p className="post-editor-error">{error}</p>}
                {success !== null && (
                    <div className="post-editor-success">
                        ✅ Post #{success} created!{" "}
                        <button onClick={() => navigate("/memes")} className="post-editor-nav-btn">
                            Browse memes
                        </button>
                    </div>
                )}

                <div className="post-editor-grid">
                    {memes.map((meme) => (
                        <div
                            key={meme.meme_id}
                            className={`post-editor-meme-card${selectedMemeId === meme.meme_id ? " selected" : ""}`}
                            onClick={() => setSelectedMemeId(meme.meme_id)}
                        >
                            <img src={meme.url} alt="meme" />
                            {selectedMemeId === meme.meme_id && (
                                <div className="post-editor-selected-badge">✓ Selected</div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="post-editor-submit"
                    onClick={handleSubmit}
                    disabled={submitting || !user || !selectedMemeId}
                >
                    {submitting ? "Posting…" : "Create Post"}
                </button>
            </div>
            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    );
}
