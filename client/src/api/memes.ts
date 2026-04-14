export interface MemeGenerateResponse {
    meme_id: number;
    filename: string;
    url: string;
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
