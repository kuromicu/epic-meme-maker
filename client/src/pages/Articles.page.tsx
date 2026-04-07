import { useEffect, useState } from "react"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"
import SidebarArticleList from "../buttons/SidebarArticleList.tsx"
import "./Articles.page.css"

interface Article {
    id: number
    title: string
    text: string
    bannerResourceFilename: string
    thumbnailResourceFilename: string
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { article_id } = useParams<{ article_id: string }>()
    const location = useLocation()

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true)
                const res = await fetch("http://localhost:8000/articles")
                if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`)
                const data = await res.json()

                const mapped: Article[] = data.map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    text: d.text,
                    bannerResourceFilename: d.banner_resource_filename,
                    thumbnailResourceFilename: d.thumbnail_resource_filename
                }))

                setArticles(mapped)
                setError(null)
            } catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error"
                setError(message)
                setArticles([])
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    useEffect(() => {
        let id: string | null = null
        if (location.hash && location.hash.startsWith("#article-")) {
            id = location.hash.replace("#article-", "")
        } else if (article_id) {
            id = article_id
        }

        if (!id) return

        const el = document.getElementById(`article-${id}`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    }, [location.hash, article_id, articles])

    return (
        <>
            <header>
                <TopButtons />
            </header>
            <div className="content"></div>
            <nav>
                <SidebarArticleList />
            </nav>

            <main className="articles-container">
                {loading && <p className="articles-loading">Завантаження статей...</p>}
                {error && <div className="articles-error">Помилка: {error}</div>}
                {!loading && articles.length === 0 && !error && (
                    <p className="articles-empty">Нема статей</p>
                )}

                {articles.map(a => {
                    const isActive = String(a.id) === article_id
                    return (
                        <article
                            id={`article-${a.id}`}
                            key={a.id}
                            className={`article-card ${isActive ? "active-article" : ""}`}
                        >
                            <img
                                src={`http://localhost:8000/resources/${a.thumbnailResourceFilename}`}
                                alt={a.title}
                                onClick={() => navigate(`/articles/${a.id}`)}
                            />

                            <div className="article-card-content">
                                <h2 onClick={() => navigate(`/articles/${a.id}`)}>
                                    {a.title}
                                </h2>

                                <p>
                                    {a.text?.slice(0, 200) || ""}
                                    {(a.text?.length || 0) > 200 ? "..." : ""}
                                </p>

                                <Link to={`/articles/${a.id}`}>
                                    Read more
                                </Link>
                            </div>
                        </article>
                    )
                })}
            </main>


            <aside className="create-article">
                <Link to="/article-editor" className="create-button">
                    Create your own article
                </Link>
            </aside>

            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}