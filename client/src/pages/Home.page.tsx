import TopButtons from "../buttons/TopButtons/TopButtons"
import { useAuth } from "../components/AuthProvider"

function HomePage() {
    const { user } = useAuth();
    
    console.log("HomePage user:", user);

    return (
        <>
            <TopButtons/>
            <div className="content"></div>
            <p>Макс Ферстаппен хоум пейдж</p>
            {user ? <p>Hi, {user.username}!</p> : <p>Please log in to your account.</p>}
            <footer>
                <p>© 2026 Hedgehog Afanasiy</p>
            </footer>
        </>
    )
}

export default HomePage