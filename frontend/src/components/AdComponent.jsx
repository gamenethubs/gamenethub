import React, { useEffect } from "react";

export default function AdComponent({ adSlot, refreshKey }) {
  // refreshKey: pass location.pathname or Date.now() to force re-init when route changes

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Check if the global array exists (meaning script loaded)
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        // 2. This command tells the AdSense script to look for the <ins> tag and fill it.
        window.adsbygoogle.push({});
      } else {
        // Optional: Helps you debug if the script is missing from index.html
        console.warn("adsbygoogle not found on window. Make sure AdSense script is in index.html.");
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [refreshKey, adSlot]); // Re-run effect when the route (refreshKey) changes

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }} // The ad will dynamically set height/width
        data-ad-client="ca-pub-6080334822401607" // ✅ Your Publisher ID
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}