
import { useRef, useState } from "react";

export default function Editor({ imageUrl }) {
  const containerRef = useRef(null);
  const [cta, setCta] = useState({ x: 120, y: 300 });

  function onDrag(e) {
    const rect = containerRef.current.getBoundingClientRect();
    setCta({
      x: e.clientX - rect.left - 60,
      y: e.clientY - rect.top - 20
    });
  }

  function downloadImage() {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "AdVantageGen-Ad.png";
    link.click();
  }

  return (
    <div>
      <h3>Ad Editor</h3>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "400px",
          border: "1px solid #ccc"
        }}
      >
        <img src={imageUrl} width="400" />

        
      </div>

      <button onClick={downloadImage} style={{ marginTop: 15 }}>
        Download
      </button>
    </div>
  );
}
