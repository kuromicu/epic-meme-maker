const API_BASE = "http://localhost:8000";

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface PostData {
    post_id: number;
    meme_id: number;
    creator_id: number;
    creator_username: string;
    creator_avatar_filename: string | null;
    like_count: number;
    has_liked: boolean;
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
    const res = await fetch(`${API_BASE}/posts`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
}

export async function toggleLike(postId: number): Promise<{ has_liked: boolean; like_count: number }> {
    const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: "POST",
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to toggle like: ${res.status}`);
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

export interface UserPostData {
    post_id: number;
    meme_id: number;
    creator_id: number;
    like_count: number;
    has_liked: boolean;
    date_of_creation: number | null;
    caption: string | null;
    meme_url: string;
}

export interface UserMemeData {
    id: number;
    image_resource_filename: string;
    top_text: string | null;
    bottom_text: string | null;
    status: string;
    repost_count: number;
}

export async function fetchPostsByUser(userId: number): Promise<UserPostData[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/posts`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch user posts: ${res.status}`);
    return res.json();
}

export async function fetchMemesByUser(userId: number): Promise<UserMemeData[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/memes`);
    if (!res.ok) throw new Error(`Failed to fetch user memes: ${res.status}`);
    return res.json();
}
