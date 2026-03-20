import TopButtons from "../buttons/TopButtons/TopButtons"
import "./NotFound.page.css"
import leo from "../assets/leonardo_dicaprio.png"


function NotFoundPage(){
    return(
        <>
            <div className="content">
                <div className="big-text">
                    404
                </div>
                <img src={leo} alt="404" className="not-found-image"/>
            </div>
        </>
    )
}

export default NotFoundPage