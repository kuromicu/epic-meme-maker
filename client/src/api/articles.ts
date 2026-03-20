export interface UploadArticleThumbnailResponse {
    filename: string;
}
export async function uploadArticleThumbnail(articleId: number, file: File): Promise<UploadArticleThumbnailResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
        `http://localhost:8000/articles/${articleId}/upload-thumbnail-image`,
        {
            method: "PUT",
            body: formData
        }
    );
    if (!response.ok){
        throw new Error("Upload failed");

    }
    return (await response.json()) as UploadArticleThumbnailResponse;
}