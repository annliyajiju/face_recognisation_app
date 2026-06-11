import { useState, useRef, useCallback } from "react";

function DropZone({ label, image, onFile }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handle = useCallback((file) => {
    if (file && file.type.startsWith("image/")) onFile(file);
  }, [onFile]);
  

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#2770d6", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
        style={{
          height: 260,
          borderRadius: 12,
          border: `2px solid ${dragging ? "#378add" : image ? "#1d9e75" : "#0d3a87"}`,
          background: "#0e9f8c",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: "border-color 0.15s",
          position: "relative",
        }}
      >
        {image ? (
          <>
            <img src={URL.createObjectURL(image)} alt={label}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "8px 12px", background: "rgba(227, 29, 221, 0.6)",
              fontSize: 11, color: "#4c70a2", borderRadius: "0 0 10px 10px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>
              {image.name} · click to replace
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#285492" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 10px", display: "block" }}>
              <circle cx="20" cy="15" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 38c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ margin: 0, fontSize: 23 }}>Drop image or click to browse</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handle(e.target.files[0])} />
      </div>
    </div>
  );
}

export default function FaceCompare() {
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState("home");

  const canSubmit = imageA && imageB && !loading;

  const compare = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const form = new FormData();
    form.append("image1", imageA);
    form.append("image2", imageB);

    try {
      const res = await fetch("http://127.0.0.1:8000/compare", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setPage("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageA(null);
    setImageB(null);
    setResult(null);
    setError(null);
  };
  if (page === "home") {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#141e30,#243b55)",
        fontFamily: "Arial, sans-serif",
        gap: "30px",
        padding: "20px"
      }}
    >
      <h1
        style={{
          fontSize: "60px",
          fontWeight: "800",
          fontFamily: "Arial, sans-serif",
          color: "#FFFFFF",
          marginBottom: "40px"
        }}
      >
        FACE RECOGNITION
      </h1>

      <button
        onClick={() => setPage("upload")}
        style={{
          padding: "15px 40px",
          fontSize: "20px",
          borderRadius: "10px"
        }}
      >
        START SCAN
      </button>
    </div>
  );
}
  if (page === "result" && result) {
  const percentage = Math.round(result.similarity * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#d4fc79,#96e6a1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "25px",
        fontFamily: "Arial"
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          color: "#166534",
          margin: 0
        }}
      >
        FACE RECOGNITION RESULT
      </h1>

      <div
        style={{
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          border: "12px solid #22c55e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}
      >
        <h2
          style={{
            fontSize: "55px",
            color: "#166534",
            margin: 0
          }}
        >
          {percentage}%
        </h2>
      </div>

      <div
        style={{
          padding: "15px 30px",
          borderRadius: "12px",
          background: result.match ? "#d4edda" : "#f8d7da",
          color: result.match ? "#155724" : "#721c24",
          fontSize: "24px",
          fontWeight: "bold"
        }}
      >
        {result.match
          ? "✅ MATCH FOUND-SAME PERSON"
          : "❌ DIFFERENT PERSON"}
      </div>

      <div
        style={{
          display: "flex",
          gap: "30px"
        }}
      >
        <img
          src={URL.createObjectURL(imageA)}
          alt="Image 1"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        />

        <img
          src={URL.createObjectURL(imageB)}
          alt="Image 2"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        />
      </div>

      <button
        onClick={() => {
          reset();
          setPage("upload");
        }}
        style={{
          padding: "15px 40px",
          fontSize: "18px",
          border: "none",
          borderRadius: "10px",
          background: "#22c55e",
          color: "#ffffff",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        SCAN AGAIN
      </button>
    </div>
  );
}
  

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#11998e,#38ef7d)", fontFamily: "arial", padding: "40px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 48, fontWeight: 800, color: "#831be4",fontfamily:"arial" }}>Face Recognition</h1>
          <p style={{ margin: 0, fontSize: 14, color: "#e06806",fontfamily:"arial" }}>Upload two face images  for comparison</p>
        </div>

        {/* Upload panels */}
        <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
          <DropZone label="Person A" image={imageA} onFile={setImageA} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#06255a", fontSize: 13, fontWeight: 700 }}>VS</div>
          <DropZone label="Person B" image={imageB} onFile={setImageB} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          <button onClick={compare} disabled={!canSubmit} style={{
            padding: "12px 36px", fontSize: 15, fontWeight: 600,
            borderRadius: 10, border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
            background: canSubmit ? "#185fa5" : "#1e2d3d", color: canSubmit ? "#fff" : "#475569",
            transition: "background 0.15s"
          }}>
            {loading ? "Sending…" : "Compare Faces"}
          </button>
          {(result || error) && (
            <button onClick={reset} style={{
              padding: "12px 20px", fontSize: 14, fontWeight: 500,
              borderRadius: 10, border: "1px solid #1e3a5f",
              cursor: "pointer", background: "transparent", color: "#64748b"
            }}>Reset</button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#1a0a0a", border: "1px solid #7f1d1d",
            borderRadius: 12, padding: "16px 20px", color: "#fca5a5", fontSize: 14
          }}>
            ✕ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: "#0c1520", border: "1px solid #1e3a5f",
            borderRadius: 14, padding: "20px 24px"
          }}>
            <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Backend response
            </p>
            <pre style={{
              margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6,
              whiteSpace: "pre-wrap", wordBreak: "break-word"
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}