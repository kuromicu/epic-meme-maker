export async function getAuthenticatedUser(token: string): Promise<Response | null> {
    try {
        const response = await fetch("http://localhost:8000/users/me", {
            method: "GET",
            headers: {  "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error fetching authenticated user:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        return null;
    }
}