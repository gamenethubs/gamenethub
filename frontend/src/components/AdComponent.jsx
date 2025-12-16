import React, { useEffect, useRef } from "react";

export default function AdComponent({ adSlot }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      try {
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch (e) {
        console.warn("AdSense push error:", e.message);
      }
    }
  }, []);

  return (
    <div style={{ margin: "20px 0", textAlign: "center", minHeight: 90 }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client="ca-pub-6080334822401607"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
