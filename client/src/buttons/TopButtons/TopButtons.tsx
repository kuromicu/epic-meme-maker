import {Link} from "react-router-dom"
import "./TopButton.css"
function TopButtons(){
    return(
        <>
            <Link to= "/about" className="top-button">
                About us
            </Link>    

            <Link to= "/home" className="top-button">
                Home
            </Link>

            <Link to= "/meme-editor" className="top-button">
                Create Meme
            </Link>
        </>
    )
}
export default TopButtons