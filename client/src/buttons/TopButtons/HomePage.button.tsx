import {Link} from "react-router-dom"
import "./TopButton.css"
function HomePage() {
    return(
        <>
            <Link to= "/home" className="top-button">
                    Home
            </Link>    
        </>
    )
}
export default HomePage