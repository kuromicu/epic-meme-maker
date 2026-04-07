import TopButtons from "../buttons/TopButtons/TopButtons";
import ImageUpload from "../хуйня/insert.pole";
import "./MemeEditor.page.css";

function MemeEditorPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const topText = formData.get("topText");
    const bottomText = formData.get("bottomText");

    console.log({ topText, bottomText });

  };

  return (
    <>
      <TopButtons />
      <div className="content">
        <h1>Meme Editor</h1>

        <form className="meme-editor" onSubmit={handleSubmit}>
          <ImageUpload text="+ upload your meme image" />

          <div className="meme-setup">
            <input
              type="text"
              name="topText"
              placeholder="TOP TEXT"
              className="meme-text-input"
            />

            <input
              type="text"
              name="bottomText"
              placeholder="BOTTOM TEXT"
              className="meme-text-input"
            />

            <button type="submit" className="gradient-button">
              Generate Meme
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MemeEditorPage;