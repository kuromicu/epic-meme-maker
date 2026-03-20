import { EditorContent, useEditor } from "@tiptap/react";
import TopButtons from "../buttons/TopButtons/TopButtons";
import StarterKit from "@tiptap/starter-kit";
import "./ArticleEditor.page.css"
import { useState } from "react";
import ImageUpload from "../хуйня/insert.pole";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "../buttons/TopButtons/TopButton.css";



function ArticleEditorPage(){
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");

    console.log("Entered function");

    const handlePublish = () => {

    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image"],
        ],
    };

    return (
        <>
            <TopButtons />
            <div className="content"></div>
                <div className="editor-page">
                <input
                    type="text"
                    className="post-title-input"
                    placeholder="write your title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                <div className="uploads-container">
                    <ImageUpload text="+ upload your thumbnail"/>
                    <ImageUpload text="+ upload your banner"/>
                </div>
                <div className="quill-container">
                    <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules}/>
                </div>

                <button className="gradient-button" onClick={handlePublish}>
                    Publish
                </button>
                </div>


    </>
    );
}
export default ArticleEditorPage