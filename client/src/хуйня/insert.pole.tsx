import { useState } from "react";
import "./insert.pole.css"
import { uploadArticleThumbnail } from ".././api/articles.ts"


type ImageUploadProps = {
  text: string
}

function ImageUpload({ text }: ImageUploadProps) {
  const [image, setImage] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // await uploadArticleThumbnail();

  };

  return (
    <div className="image-container">
      <label className="upload-box">
        {text}
        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
      </label>
      {image && (
        <div className="preview">
          <img src={image} alt="preview" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
