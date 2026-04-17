
import TopButtons from "../buttons/TopButtons/TopButtons"
import { useAuth } from "../components/AuthProvider"
import UserAvatar from "../components/UserAvatar"
import { useNavigate } from "react-router-dom"
import "./Profile.page.css"

function ProfilePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return <div>Not authorized</div>
    }

    const handleLogout = () => {
        logout()
        navigate("/register")
    }

    return (
        <>
            <TopButtons/>

            <div className="profile-page">
                <div className="profile-card">
                    <UserAvatar
                        username={user.username}
                        avatarFilename={user.avatarResourceFilename}
                        size={90}
                        style={{ margin: "0 auto 15px" }}
                    />

                    <h2>{user.username}</h2>
                    <p>{user.email}</p>

                    <div className="status">{user.status}</div>

                    <div className="stats">
                        <div>
                            <span>{user.subscribers_count}</span>
                            <p>Subscribers</p>
                        </div>
                        <div>
                            <span>{user.subscriptions_count}</span>
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