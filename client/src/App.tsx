
import { Route, Routes } from "react-router-dom"
import "./App.css"
import HomePage from "./pages/Home.page"
import MemeEditorPage from "./pages/MemeEditor.page"
import MemesPage from "./pages/Memes.page"
import ProfilePage from "./pages/Profile.page"
import AboutPage from "./pages/About.page"
import ArticlePage from "./pages/Article.page"
import ArticlesPage from "./pages/Articles.page"
import ArticleEditorPage from "./pages/ArticleEditor.page"
import NotFoundPage from "./pages/NotFound.page"
import LoginPage from "./pages/Login.page"
import RegisterPage from "./pages/Register.page"
import ContactUsPage from "./pages/ContactUs.page"
import { AuthProvider } from "./components/AuthProvider"
import MemeDetailPage from "./pages/MemeDetail.page"


function App() {  
  return (
    <AuthProvider>
        <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/meme-editor" element={<MemeEditorPage />}/>
        <Route path="/memes" element={<MemesPage />}/>
        <Route path="/memes/:id" element={<MemeDetailPage />}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/articles/:article_id" element={<ArticlePage/>}/>
        <Route path="/articles" element={<ArticlesPage/>}/>
        <Route path="/article-editor" element={<ArticleEditorPage/>}/>
        <Route path="/contact" element={<ContactUsPage/>}/>
        <Route path="/404" element={<NotFoundPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App