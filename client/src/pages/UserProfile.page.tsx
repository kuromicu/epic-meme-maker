import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"
import UserAvatar from "../components/UserAvatar"
import UserContentTabs from "../components/UserContentTabs"
import { useAuth } from "../components/AuthProvider"
import "./Profile.page.css"

interface PublicUser {
    id: number
    username: string
    status: string
    subscribers_count: number
    subscriptions_count: number
    avatar_resource_filename: string | null
}

export default function UserProfilePage() {
    const { user_id } = useParams<{ user_id: string }>()
    const { user: authUser } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Redirect to own profile page if the user is viewing their own profile
    useEffect(() => {
        if (authUser && user_id && String(authUser.id) === user_id) {
            navigate("/profile", { replace: true })
        }
    }, [authUser, user_id, navigate])

    useEffect(() => {
        if (!user_id) return
        setLoading(true)
        fetch(`http://localhost:8000/users/${user_id}`)
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`)
                return res.json()
            })
            .then(data => {
                setProfile(data)
                setError(null)
            })
            .catch(() => setError("User not found."))
            .finally(() => setLoading(false))
    }, [user_id])
    console.log("PROFILE userId:", user_id)
    return (
        <>
            <TopButtons />

            <div className="profile-page">
                {loading && <p style={{ color: "var(--fg-muted)" }}>Loading…</p>}
                {error && <p style={{ color: "#ef4444" }}>{error}</p>}

                {profile && (
                    <>
                        <div className="profile-card">
                            <UserAvatar
                                username={profile.username}
                                avatarFilename={profile.avatar_resource_filename}
                                size={90}
                                style={{ margin: "0 auto 15px" }}
                            />

                            <h2>{profile.username}</h2>
                            <div className="status">{profile.status}</div>

                            <div className="stats">
                                <div>
                                    <span>{profile.subscribers_count}</span>
                                    <p>Subscribers</p>
                                </div>
                                <div>
                                    <span>{profile.subscriptions_count}</span>
                                    <p>Subscriptions</p>
                                </div>
                                
                            </div>
                        </div>

                        <UserContentTabs userId={profile.id} />
                    </>
                )}
            </div>

            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}
