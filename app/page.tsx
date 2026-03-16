"use client";

import { useState } from "react";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [language, setLanguage] = useState("EN");
  const [count, setCount] = useState(3);
  const [images, setImages] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [wrapper, setWrapper] = useState("");

  async function previewPrompt() {
    setError("");
    setWrapper("");

    try {
      const res = await fetch("/api/preview-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.details || data?.error || "Preview failed");
        return;
      }

      setWrapper(data.wrapper || "");
    } catch (err: any) {
      setError(err?.message || "Preview request failed");
    }
  }

  async function generate() {
    setLoading(true);
    setError("");
    setImages([]);
    setFormats([]);
    setStatus("Generation started. Please wait...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim, count, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.details || data?.error || "Something went wrong");
        setStatus("");
        return;
      }

      setImages((data.images || []).filter(Boolean));
      setFormats(data.formats || []);
      setStatus("Done");
    } catch (err: any) {
      setError(err?.message || "Request failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 1600, margin: "40px auto", padding: 20 }}>
      <h1>Meta Creative Generator</h1>

      <input
        type="text"
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        placeholder="Enter claim"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginTop: "20px",
          marginBottom: "12px",
        }}
      />

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Wrapper language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "10px 12px", fontSize: "16px" }}
        >
          <option value="EN">English</option>
          <option value="ES">Spanish</option>
          <option value="DE">German</option>
          <option value="FR">French</option>
          <option value="PT">Portuguese</option>
          <option value="IT">Italian</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Number of creatives
        </label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ padding: "10px 12px", fontSize: "16px", width: 120 }}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={previewPrompt}
          disabled={!claim || loading}
          style={{ padding: "10px 16px", fontSize: "16px" }}
        >
          Preview Prompt
        </button>

        <button
          onClick={generate}
          disabled={!claim || loading}
          style={{ padding: "10px 16px", fontSize: "16px" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {status ? <p style={{ marginTop: 16 }}>{status}</p> : null}
      {error ? <p style={{ color: "red", marginTop: 16 }}>{error}</p> : null}

      {wrapper ? (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd" }}>
          <p><strong>Wrapper preview:</strong> {wrapper}</p>
        </div>
      ) : null}

      {formats.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <strong>Formats used:</strong> {formats.join(", ")}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 24,
        }}
      >
        {images.map((src, i) => (
          <div key={i}>
            <img
              src={src}
              alt={`creative-${i + 1}`}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <div style={{ marginTop: 8, fontSize: 14 }}>
              {formats[i] ? <strong>{formats[i]}</strong> : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}