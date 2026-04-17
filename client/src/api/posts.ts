const API_BASE = "http://localhost:8000";

export interface PostData {
    post_id: number;
    meme_id: number;
    creator_id: number;
    like_count: number;
    date_of_creation: number | null;
    caption: string | null;
    meme_url: string;
    meme_top_text: string | null;
    meme_bottom_text: string | null;
}

export interface PostCreatePayload {
    creator_id: number;
    meme_id: number;
    caption?: string;
}

export async function fetchPosts(): Promise<PostData[]> {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
}

export async function createPost(payload: PostCreatePayload): Promise<{ post_id: number }> {
    const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
    return res.json();
}

export async function fetchPublishedMemes(): Promise<{ meme_id: number; url: string; top_text: string | null; bottom_text: string | null }[]> {
    const res = await fetch(`${API_BASE}/memes`);
    if (!res.ok) throw new Error(`Failed to fetch memes: ${res.status}`);
    return res.json();
}
