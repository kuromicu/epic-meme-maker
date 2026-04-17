import { Link } from "react-router-dom"
import "./TopButton.css"
import { useAuth } from '../../components/AuthProvider';
import UserAvatar from '../../components/UserAvatar';
import { useState } from "react"

function TopButtons() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <div className="navbar">

            <button 
                className="menu-btn"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>

            <div className={`menu ${open ? "active" : ""}`}>

                <Link to="/about" className="top-button">
                    About us
                </Link> 
                
                <Link to="/home" className="top-button">
                    Home
                </Link>

                <Link to="/articles" className="top-button">
                    Articles
                </Link>

                <Link to="/memes" className="top-button">
                    All Memes
                </Link>

                <Link to="/meme-editor" className="top-button">
                    Create Meme
                </Link>

                <Link to="/post-editor" className="top-button">
                    Create Post
                </Link>

                {user ? (
                    <Link to="/profile" className="top-button profile-link">
                        <UserAvatar
                            username={user.username}
                            avatarFilename={user.avatarResourceFilename}
                            size={38}
                        />
                        <span>{user.username}</span>
                    </Link>
                ) : (
                    <Link to="/register" className="top-button">
                        Register/Login
                    </Link>
                )}

            </div>

        </div>
    )
}

export default TopButtons