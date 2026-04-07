import { useState } from "react"
import "./Auth.page.css"
import "./ContactUs.page.css"
import TopButtons from "../buttons/TopButtons/TopButtons"
export default function ContactUsPage() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [contactMethod, setContactMethod] = useState("email")
    const [messageType, setMessageType] = useState("question")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!firstName || !lastName || !email || !message) {
            setError("Please fill all required fields")
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("firstName", firstName)
            formData.append("lastName", lastName)
            formData.append("email", email)
            formData.append("phone", phone)
            formData.append("message", message)
            formData.append("contactMethod", contactMethod)
            formData.append("messageType", messageType)
            if (file) formData.append("file", file)

            const res = await fetch("http://localhost:8000/contact", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}))
                throw new Error(payload.message || `Submission failed: ${res.status}`)
            }

            alert("Message sent successfully!")
            setFirstName("")
            setLastName("")
            setEmail("")
            setPhone("")
            setMessage("")
            setContactMethod("email")
            setMessageType("question")
            setFile(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <TopButtons/>
            <div className="content"></div>
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <h2>Contact Us</h2>
                {error && <div className="auth-error">{error}</div>}

                <label>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Phone
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </label>

                <div className="message-content">
                    <label>
                        Message
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <fieldset>
                    <legend>Preferred Contact Method</legend>
                    <label>
                        <input
                            type="radio"
                            value="email"
                            checked={contactMethod === "email"}
                            onChange={e => setContactMethod(e.target.value)}
                        />
                        Email
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="phone"
                            checked={contactMethod === "phone"}
                            onChange={e => setContactMethod(e.target.value)}
                        />
                        Phone
                    </label>
                </fieldset>

                <label>
                    Message Type
                    <select
                        value={messageType}
                        onChange={e => setMessageType(e.target.value)}
                    >
                        <option value="question">Question</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label>
                    Attach Image
                    <input
                        type="file"
                        accept="pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                    />
                </label>

                <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    </>
    )
}