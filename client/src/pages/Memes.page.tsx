    import { Link } from "react-router-dom";
    import TopButtons from "../buttons/TopButtons/TopButtons";
    import { useEffect, useState } from "react";
    import "./Memes.page.css";

    type Meme = {
    meme_id: number;
    url: string;
    };

    export default function MemesPage() {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMemes = async () => {
        setLoading(true);
        try {
        const res = await fetch("http://localhost:8000/memes");
        const data = await res.json();
        setMemes(data);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemes();
    }, []);

    return (
        <>
        <TopButtons />
        <div className="content"></div>

        <div className="p-4 max-w-7xl mx-auto">

            <div className="masonry">
            {memes.map((meme) => (
                <Link
                key={meme.meme_id}
                to={`/memes/${meme.meme_id}`}
                className="masonry-item"
                >
                <img src={meme.url} alt="meme" />
                </Link>
            ))}
            </div>

            {loading && <p className="text-center mt-4">Loading...</p>}
        </div>
        <div className="content"></div>
        <Link to="/meme-editor" className="create-button">
            Create your own meme
        </Link>
            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>

    );
    }