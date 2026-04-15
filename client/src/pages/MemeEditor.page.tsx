import { useEffect, useRef, useState } from "react";
import TopButtons from "../buttons/TopButtons/TopButtons";
import { useAuth } from "../components/AuthProvider";
import { generateMeme } from "../api/memes";
import "./MemeEditor.page.css";

const OUTLINE = 2;

const FONT_CSS: Record<string, string> = {
  "Impact":     "Impact, Arial Black, sans-serif",
  "Arial":      "Arial, Helvetica, sans-serif",
  "Comic Sans": "'Comic Sans MS', cursive, sans-serif",
};

function drawMemeCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  topText: string,
  bottomText: string,
  fontName: string,
  fontSize: number,
  textColor: string,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  ctx.font = `bold ${fontSize}px ${FONT_CSS[fontName] ?? "Impact, sans-serif"}`;
  ctx.textAlign = "center";
  const outlineColor = textColor === "black" ? "white" : "black";

  const drawOutlined = (text: string, y: number) => {
    const upper = text.toUpperCase();
    const x = canvas.width / 2;
    ctx.fillStyle = outlineColor;
    for (let dx = -OUTLINE; dx <= OUTLINE; dx++) {
      for (let dy = -OUTLINE; dy <= OUTLINE; dy++) {
        if (dx !== 0 || dy !== 0) ctx.fillText(upper, x + dx, y + dy);
      }
    }
    ctx.fillStyle = textColor;
    ctx.fillText(upper, x, y);
  };

  if (topText) drawOutlined(topText, fontSize + 10);
  if (bottomText) drawOutlined(bottomText, canvas.height - 20);
}

const COLOR_SWATCHES: Record<string, string> = {
  white: "#ffffff", black: "#111111", yellow: "#facc15", red: "#ef4444",
};

function MemeEditorPage() {
  const { user } = useAuth();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageEl, setImageEl]     = useState<HTMLImageElement | null>(null);
  const [topText, setTopText]     = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontName, setFontName]   = useState("Impact");
  const [fontSize, setFontSize]   = useState(48);
  const [textColor, setTextColor] = useState("white");
  const [isPublic, setIsPublic]   = useState(true);

  const [generatedUrl, setGeneratedUrl]         = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string | null>(null);
  const [generatedMemeId, setGeneratedMemeId]   = useState<number | null>(null);
  const [loadingStatus, setLoadingStatus]       = useState<"draft" | "published" | null>(null);
  const [error, setError]                       = useState<string | null>(null);

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => setImageEl(img);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!canvasRef.current || !imageEl) return;
    drawMemeCanvas(canvasRef.current, imageEl, topText, bottomText, fontName, fontSize, textColor);
  }, [imageEl, topText, bottomText, fontName, fontSize, textColor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setGeneratedUrl(null);
    setGeneratedFilename(null);
    setGeneratedMemeId(null);
    setError(null);
  };

  const handleGenerate = async (status: "draft" | "published") => {
    if (!imageFile) { setError("Please upload an image first."); return; }
    if (!user)      { setError("You must be logged in to save a meme."); return; }
    setLoadingStatus(status);
    setError(null);
    try {
      const result = await generateMeme(
        imageFile, topText, bottomText,
        parseInt(user.id), fontName, fontSize, textColor, status,
      );
      setGeneratedUrl(result.url);
      setGeneratedFilename(result.filename);
      setGeneratedMemeId(result.meme_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl || !generatedFilename) return;
    const blob = await fetch(generatedUrl).then(r => r.blob());
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = generatedFilename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const busy = loadingStatus !== null;

  return (
    <>
      <TopButtons />
      <div className="content">
        <h1 className="meme-editor-title">Meme Creator</h1>

        <div className="meme-layout">

          {/* ── Left: preview + upload button ── */}
          <div className="meme-left">
            <div className="meme-preview-area" onClick={() => fileInputRef.current?.click()}>
              {!imageFile && (
                <div className="upload-placeholder">
                  <span className="upload-icon">🖼️</span>
                  <span>Click to upload image</span>
                </div>
              )}
              <canvas ref={canvasRef} className="meme-canvas" style={{ display: imageFile ? "block" : "none" }} />
              {imageFile && <div className="change-image-hint">click to change</div>}
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            </div>
            <button type="button" className="meme-upload-btn" onClick={() => fileInputRef.current?.click()}>
              Upload another image
            </button>
          </div>

          {/* ── Right: control panel ── */}
          <div className="meme-right-panel">

            <div className="meme-section">
              <label className="meme-label">Top text:</label>
              <input type="text" className="meme-text-input" placeholder="TOP TEXT" value={topText} onChange={e => setTopText(e.target.value)} />
            </div>

            <div className="meme-section">
              <label className="meme-label">Bottom text:</label>
              <input type="text" className="meme-text-input" placeholder="BOTTOM TEXT" value={bottomText} onChange={e => setBottomText(e.target.value)} />
            </div>

            <div className="meme-divider" />

            <div className="meme-section">
              <div className="meme-style-row">
                <span className="meme-style-label">Font:</span>
                <select className="meme-select" value={fontName} onChange={e => setFontName(e.target.value)}>
                  <option>Impact</option>
                  <option>Arial</option>
                  <option>Comic Sans</option>
                </select>
              </div>
              <div className="meme-style-row">
                <span className="meme-style-label">Size:</span>
                <select className="meme-select" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}>
                  <option value={24}>24px</option>
                  <option value={32}>32px</option>
                  <option value={48}>48px</option>
                  <option value={64}>64px</option>
                  <option value={80}>80px</option>
                </select>
              </div>
              <div className="meme-style-row">
                <span className="meme-style-label">Color:</span>
                <select className="meme-select" value={textColor} onChange={e => setTextColor(e.target.value)}>
                  {Object.entries(COLOR_SWATCHES).map(([val, hex]) => (
                    <option key={val} value={val} style={{ background: hex, color: val === "white" ? "#333" : "#fff" }}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </option>
                  ))}
                </select>
                <span className="meme-color-swatch" style={{ background: COLOR_SWATCHES[textColor] }} />
              </div>
            </div>

            <div className="meme-divider" />

            <div className="meme-section">
              <label className="meme-checkbox-label">
                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                Make public
              </label>
            </div>

            {!user && <p className="meme-warning">⚠️ Log in to save memes</p>}
            {error  && <p className="meme-error">{error}</p>}

            {generatedMemeId && (
              <div className="meme-success">
                <span>✅ Meme #{generatedMemeId} saved!</span>
                <button type="button" className="meme-download-btn" onClick={handleDownload}>⬇ Download</button>
              </div>
            )}

            <div className="meme-divider" />

            <div className="meme-actions">
              <button type="button" className="meme-btn meme-btn-save" disabled={busy || !user}
                onClick={() => handleGenerate(isPublic ? "published" : "draft")}>
                {loadingStatus === "draft" ? "Saving…" : "Save"}
              </button>
              <button type="button" className="meme-btn meme-btn-publish" disabled={busy || !user}
                onClick={() => handleGenerate("published")}>
                {loadingStatus === "published" ? "Publishing…" : "Publish"}
              </button>
            </div>

          </div>
        </div>
      </div>
        <footer>
          <p>© 2026 Hedgehog Afanasiy</p>
        </footer>
    </>
  );
}

export default MemeEditorPage;