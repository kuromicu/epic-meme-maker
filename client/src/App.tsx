
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


function App() {  
  return (
    <Routes>
      <Route path="/home" element={<HomePage />}/>
      <Route path="/about" element={<AboutPage />}/>
      <Route path="/meme-editor" element={<MemeEditorPage />}/>
      <Route path="/memes" element={<MemesPage />}/>
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/article" element={<ArticlePage/>}/>
      <Route path="/articles" element={<ArticlesPage/>}/>
      <Route path="/article-editor" element={<ArticleEditorPage/>}/>
    </Routes>  
  )
}

export default App