import { NavLink } from "react-router-dom"
import TopButtons from "../buttons/TopButtons/TopButtons"
import "./About.page.css"


function AboutPage(){
    return (
        <>
        
            <TopButtons/>
            <div className="content"></div>
                <div className="about-content">
                    <h2 className="about-title">Welcome to MemeBox!</h2>
                    <p className="about-text">
                        We are a team of passionate web developers building a vibrant social networking
                        platform dedicated to memes. Our portal connects meme lovers from all over the world,
                        allowing them to share, comment, and enjoy trending content. With a modern interface,
                        fast performance, and a community-driven approach, MemeBox is your ultimate destination
                        for endless entertainment and creativity.
                    </p>
                    <div className="contact-section">
                        <br></br><br></br>
                        <NavLink to="/contact" className="contact-link">
                            Contact & Support
                        </NavLink>
                        <p>Email: <a href="mailto:support@memebox.com">support@memebox.com</a></p>
                        <p>Phone: <a href="tel:+380667018193">+38 (066) 701-81-93</a></p>
                        <p>Follow us on social media for updates and memes!</p>
                    </div>
                </div>
            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
            
        </>
    )
}

export default AboutPage