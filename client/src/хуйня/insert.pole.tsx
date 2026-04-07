import { useRef, useState } from "react";
import "./insert.pole.css";
import { uploadArticleThumbnail } from "../api/articles";

type ImageUploadProps = {
  text: string;
};

function ImageUpload({ text }: ImageUploadProps) {
  const [image, setImage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);

    try {
      const uploadedUrl = await uploadArticleThumbnail(file);
      if (uploadedUrl) setImage(uploadedUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="image-container" onClick={handleClick}>
      <div className="upload-box">
        {text}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        hidden
      />

      {image && (
        <div className="preview">
          <img src={image} alt="preview" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;