import {Link} from "react-router-dom"
import "./TopButton.css"
function TopButtons(){
    return(
        <>

            <div className="navbar">
                
            <Link to= "/about" className="top-button">
                About us
            </Link> 
            
            <Link to= "/home" className="top-button">
                Home
            </Link>

            <Link to= "/articles" className="top-button">
                Articles
            </Link>

            <Link to= "/memes" className="top-button">
                All Memes
            </Link>


            <Link to= "/meme-editor" className="top-button">
                Create Meme
            </Link>


            <Link to= "/register" className="top-button">
                Register/Login
            </Link>

            </div>

        </>
    )
}
export default TopButtons