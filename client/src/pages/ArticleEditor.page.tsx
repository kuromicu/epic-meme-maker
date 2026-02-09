import { EditorContent, useEditor } from "@tiptap/react";
import TopButtons from "../buttons/TopButtons/TopButtons";
import StarterKit from "@tiptap/starter-kit";
import "./ArticleEditor.page.css"

function ArticleEditorPage(){
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello</p>"
    });

    console.log("Entered function");

    if (!editor) return null;

    return(
        
        <>

        <div>
            <TopButtons/>
            <div>
                <EditorContent editor={editor}/>
            </div>
        </div>

        </>

    )
}
export default ArticleEditorPage