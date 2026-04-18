
import { useRef, useState } from "react"
import TopButtons from "../buttons/TopButtons/TopButtons"
import { useAuth } from "../components/AuthProvider"
import UserAvatar from "../components/UserAvatar"
import { uploadAvatar } from "../api/auth"
import { useNavigate } from "react-router-dom"
import "./Profile.page.css"

function ProfilePage() {
    const { user, logout, refreshUser } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const [avatarError, setAvatarError] = useState<string | null>(null)

    if (!user) {
        return <div>Not authorized</div>
    }

    const handleLogout = () => {
        logout()
        navigate("/register")
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarUploading(true)
        setAvatarError(null)
        try {
            await uploadAvatar(user.id, file)
            await refreshUser()
        } catch {
            setAvatarError("Failed to upload avatar.")
        } finally {
            setAvatarUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <>
            <TopButtons/>

            <div className="profile-page">
                <div className="profile-card">
                    <div className="avatar-upload-wrapper" onClick={handleAvatarClick} title="Click to change avatar">
                        <UserAvatar
                            username={user.username}
                            avatarFilename={user.avatarResourceFilename}
                            size={90}
                            style={{ margin: "0 auto" }}
                        />
                        <div className="avatar-upload-overlay">
                            {avatarUploading ? "…" : "✎"}
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                    {avatarError && <p className="avatar-error">{avatarError}</p>}

                    <h2>{user.username}</h2>
                    <p>{user.email}</p>

                    <div className="status">{user.status}</div>

                    <div className="stats">
                        <div>
                            <span>{user.subscribersCount}</span>
                            <p>Subscribers</p>
                        </div>
                        <div>
                            <span>{user.subscriptionsCount}</span>
                            <p>Subscriptions</p>
                        </div>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </div>
            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}

export default ProfilePage