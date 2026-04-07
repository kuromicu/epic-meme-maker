import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.page.css"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!username || !email || !password) {
            setError("Please fill all required fields")
            return
        }
        if (password !== confirm) {
            setError("Passwords do not match")
            return
        }

        try {
            setLoading(true)
            const res = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}))
                throw new Error(payload.message || `Register failed: ${res.status}`)
            }
            navigate("/login")
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirm("")
        setError(null)
    }

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create account</h2>
                {error && <div className="auth-error">{error}</div>}

                <label>
                    Email
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>

                <label>
                    Login
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>

                <label>
                    Password
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>

                <label>
                    Confirm Password
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                </label>

                <div className="button-group">
                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Creating..." : "Register"}
                    </button>
                    <button type="button" className="auth-clear" onClick={handleClear}>
                        Clear all
                    </button>
                </div>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>

                </div>

                <Link to="/home" className="auth-submit">
                    Continue without account
                </Link>
            </form>
        </div>
    )
}