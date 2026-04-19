
const API_BASE = "http://localhost:8000";

export interface MemeGenerateResponse {
    meme_id: number;
    filename: string;
    url: string;
}
export interface UserMemeData {
    meme_id: number;
    url: string;
    top_text: string | null;
    bottom_text: string | null;
    status: string;
    repost_count: number;
}

export async function generateMeme(
    image: File,
    topText: string,
    bottomText: string,
    creatorId: number,
    fontName: string,
    fontSize: number,
    textColor: string,
    status: "draft" | "published",
): Promise<MemeGenerateResponse> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("top_text", topText);
    formData.append("bottom_text", bottomText);
    formData.append("creator_id", String(creatorId));
    formData.append("font_name", fontName);
    formData.append("font_size", String(fontSize));
    formData.append("text_color", textColor);
    formData.append("status", status);

    const response = await fetch("http://localhost:8000/memes/generate", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Meme generation failed: ${response.status}`);
    }

    return (await response.json()) as MemeGenerateResponse;
}



export async function fetchPublishedMemes(): Promise<{ meme_id: number; url: string; top_text: string | null; bottom_text: string | null }[]> {
    const res = await fetch(`${API_BASE}/memes`);
    if (!res.ok) throw new Error(`Failed to fetch memes: ${res.status}`);
    return res.json();
}


/* export async function fetchUserMemes(
    userId: number
): Promise<{
    meme_id: number;
    url: string;
    top_text: string | null;
    bottom_text: string | null;
}[]> {
    const res = await fetch(`${API_BASE}/memes/user/${userId}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch user memes: ${res.status}`);
    }

    return res.json();
} */


export async function fetchPublishedMemesByUser(userId: number): Promise<UserMemeData[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/memes/published`);
    if (!res.ok) throw new Error(`Failed to fetch user memes: ${res.status}`);
    return res.json();
}

export async function fetchAllMemesByUser(userId: number): Promise<UserMemeData[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/memes`);
    if (!res.ok) throw new Error(`Failed to fetch user memes: ${res.status}`);
    return res.json();
}