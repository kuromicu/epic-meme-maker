import {Link} from "react-router-dom"
import "./TopButton.css"
function MemeEditorPage() {
    return(
        <>
            <Link to= "/meme-editor" className="top-button">
                
                    Create Meme
                
            </Link>    
        </>
    )
}
export default MemeEditorPage