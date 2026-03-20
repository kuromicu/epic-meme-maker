import { NavLink } from "react-router-dom"
import type { Article } from "../types/Article"
import "./ArticleCard.css"
interface Props {
    articles: Article[]
}

export default function ArticleList({ articles }: Props) {

    const getShortText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "..."
        }
        return text
    }

    if (articles.length === 0) return <div>No articles found</div>

    return (
        <ul>
            {articles.map(article => (
                <li key={article.id} className="mb-4">
            <NavLink
                to={`/articles/${article.id}`}
                className={({ isActive }) =>
                isActive
            ? "font-bold text-lg active-article"
            : "font-bold text-lg"
    }
>
    {article.title}
</NavLink>
                    <p dangerouslySetInnerHTML={{ __html: getShortText(article.text || "", 120) }} />
                </li>
            ))}
        </ul>
    )
}