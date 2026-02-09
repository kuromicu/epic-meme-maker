import {Link} from "react-router-dom"
import "./TopButton.css"
function AboutPage() {
    return(
        <>
            <Link to= "/about" className="top-button">
                    About us
            </Link>    
        </>
    )
}
export default AboutPage