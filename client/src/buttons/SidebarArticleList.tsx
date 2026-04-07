import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import type { Article } from "../types/Article"
import "./SidebarList.css"

export default function SidebarArticleList() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const location = useLocation()
    const [lastSelected, setLastSelected] = useState<string | null>(() => {
        try {
            return localStorage.getItem("lastSelectedArticle")
        } catch {
            return null
        }
    })

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true)
                const response = await fetch("http://localhost:8000/articles")
                if (!response.ok) throw new Error(`Failed to fetch articles: ${response.status}`)
                const data: Article[] = await response.json()
                setArticles(data)
                setError(null)
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error"
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    if (loading) return <div>Завантаження...</div>
    if (error) return <div>Помилка: {error}</div>

    return (
        <aside className="sidebar-list">
            {articles.map(article => {
                const idStr = String(article.id)
                const hashId = location.hash && location.hash.startsWith("#article-")
                    ? location.hash.replace("#article-", "")
                    : null
                const isActive = hashId ? hashId === idStr : lastSelected === idStr
                return (
                    <NavLink
                        key={article.id}
                        to={`/articles#article-${article.id}`}
                        end
                        onClick={() => {
                            try {
                                localStorage.setItem("lastSelectedArticle", idStr)
                            } catch {}
                            setLastSelected(idStr)
                        }}
                        className={isActive ? "sidebar-list-item active" : "sidebar-list-item"}
                    >
                        {article.title}
                    </NavLink>
                )
            })}
        </aside>
    )
}