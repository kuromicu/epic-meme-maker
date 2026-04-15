    import { useEffect, useState } from "react";
    import { Link, useParams } from "react-router-dom";
    import TopButtons from "../buttons/TopButtons/TopButtons";
    import "./MemeDetail.page.css";

    type Meme = {
    meme_id: number;
    image_resource_filename: string;
    repost_count: number;
    creator_id: number;
    url: string;
    };

    type User = {
    id: number;
    username: string;
    avatar_resource_filename?: string;
    subscribers_count: number;
    };

    export default function MemeDetailPage() {
    const { id } = useParams();

    const [meme, setMeme] = useState<Meme | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [authorMemes, setAuthorMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);

        try {
        const memeRes = await fetch(`http://localhost:8000/memes/${id}`);
        const memeData = await memeRes.json();

        const normalizedMeme: Meme = {
            ...memeData,
            url: `http://localhost:8000/resources/${memeData.image_resource_filename}`,
        };

        setMeme(normalizedMeme);

        const userRes = await fetch(
            `http://localhost:8000/users/${memeData.creator_id}`
        );
        const userData = await userRes.json();
        setAuthor(userData);

        const memesRes = await fetch(
            `http://localhost:8000/users/${memeData.creator_id}/memes`
        );

        const memesData = await memesRes.json();

        const normalizedMemes: Meme[] = (Array.isArray(memesData) ? memesData : []).map(
            (m: any) => ({
            meme_id: m.meme_id ?? m.id,
            creator_id: m.creator_id,
            repost_count: m.repost_count ?? 0,
            image_resource_filename: m.image_resource_filename,
            url: m.image_resource_filename
                ? `http://localhost:8000/resources/${m.image_resource_filename}`
                : "",
            })
        );

        setAuthorMemes(normalizedMemes);
        } catch (e) {
        console.error(e);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading || !meme) return <div className="loading">Loading...</div>;

    return (
        <>
        <TopButtons />
        <div className="content"></div>
        <div className="page">
            <div className="layout">

            {/* LEFT */}
            <div className="left">

                {/* AUTHOR */}
                {author && (
                <Link to={`/profile/${author.id}`} className="author-bar">
                    <img
                    src={
                        author.avatar_resource_filename
                        ? `http://localhost:8000/resources/${author.avatar_resource_filename}`
                        : ""
                    }
                    className="avatar"
                    />
                    <span className="username">{author.username}</span>
                </Link>
                )}

                {/* MEME */}
                <div className="meme-box">
                <img src={meme.url} />
                </div>

                {/* ACTIONS */}
                <div className="bottom-bar">

                <div className="reposts">
                    Reposts: {meme.repost_count ?? 0}
                </div>

                <button className="cta">
                    Create post with this meme
                </button>

                </div>

            </div>

            {/* RIGHT */}
            <div className="right">
                <h3 className="side-title">More memes from this author</h3>

                <div className="scroll">
                {authorMemes
                    .filter((m) => m.meme_id !== meme.meme_id)
                    .map((m) => (
                    <Link key={m.meme_id} to={`/memes/${m.meme_id}`} className="mini">
                        <img src={m.url} />
                    </Link>
                    ))}
                </div>
            </div>

            </div>
        </div>
        </>
    );
    }