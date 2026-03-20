import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Article } from "../types/Article"
import TopButtons from "../buttons/TopButtons/TopButtons"
import "./Article.page.css"
import SidebarArticleList from "../buttons/SidebarArticleList"

function ArticlePage() {
    const { article_id } = useParams<{ article_id: string }>()
    const navigate = useNavigate()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8000/articles/${article_id}`)
                
                if (response.status === 404) {
                    navigate("/404")
                    return
                }
                
                if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`)
                const data: Article = await response.json()
                setArticle(data)
                setError(null)
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error"
                console.error("Error fetching article:", message)
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        if (article_id) {
            fetchArticle()
        }
    }, [article_id, navigate])

    if (loading) return (
        <>
            <TopButtons />
            <div className="article-detail-loading">Завантаження...</div>
        </>
    )

    if (error) return (
        <>
            <TopButtons />
            <div className="article-detail-error">Помилка: {error}</div>
        </>
    )

    if (!article) return (
        <>
            <TopButtons />
            <div className="article-detail-not-found">Статтю не знайдено</div>
        </>
    )

    return (
        <>
            <TopButtons />
            <SidebarArticleList/>
            <div className="article-detail-container">
                <div className="article-detail">
                    <img 
                        src={`http://localhost:8000/resources/${article.banner_resource_filename}`} 
                        alt={article.title}
                    />
                    <h1>{article.title}</h1>
                    <div className="article-detail-text" dangerouslySetInnerHTML={{ __html: article.text || "" }}
/>
                </div>
            </div>
        </>
    )
}

export default ArticlePage