const API_BASE = "http://localhost:8000";

export interface AuthUser {
    id: string;
    email: string;
    status: string;
    username: string;
    subscribersCount: number;
    subscriptionsCount: number;
    avatarResourceFilename: string | null;
}

export async function getAuthenticatedUser(token: string): Promise<AuthUser | null> {
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            return {
                id: String(data.id),
                email: data.email,
                status: data.status,
                username: data.username,
                subscribersCount: data.subscribers_count ?? 0,
                subscriptionsCount: data.subscriptions_count ?? 0,
                avatarResourceFilename: data.avatar_resource_filename ?? null,
            };
        } else {
            console.error("Error fetching authenticated user:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        return null;
    }
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE}/users/${userId}/avatar`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload avatar: ${res.status}`);
    const data = await res.json();
    return data.avatar_resource_filename as string;
}