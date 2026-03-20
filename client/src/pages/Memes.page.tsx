import { Link } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"

function MemesPage() {
    return (
        <>
            <TopButtons/>
            <div className="content"></div>
            <Link to="/meme-editor" className="top-button">
                Create your own meme
            </Link>
            <p>Макс Ферстаппен мем едіт пейдж</p>
        </>
    )
}
export default MemesPage

