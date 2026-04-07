import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.page.css"
import { useAuth } from "../components/AuthProvider"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!username || !password) {
            setError("Please enter username and password")
            return
        }

        try {
            setLoading(true)
            const res = await fetch("http://localhost:8000/users/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, remember })
            })

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}))
                throw new Error(payload.message || `Login failed: ${res.status}`)
            }
            const data = await res.json()
            login(data.access_token)
            
            navigate("/profile")
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="auth-error">{error}</div>}

                <label>
                    Login
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>

                <label>
                    Password
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <div className="remember-me-container">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={e => setRemember(e.target.checked)}
                    />
                    <>Remember me</>
                </label>
                </div>
                <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Signing in..." : "Увійти"}
                </button>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>

                <Link to="/home" className="auth-submit">
                    Continue without account
                </Link>
            </form>
        </div>
    </>
    )
}