"use client";

import dynamic from "next/dynamic";

// loaded on the client only, so first-load js stays at the next.js baseline
const FlipDotDemo = dynamic(() => import("./FlipDotDemo"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-busy="true"
      aria-label="loading the flip-dot demo"
      style={{
        width: "100%",
        maxWidth: "44rem",
        minHeight: "24rem",
        borderRadius: 12,
        border: "1px solid rgba(128, 128, 128, 0.25)",
        background: "rgba(128, 128, 128, 0.08)",
      }}
    />
  ),
});

export default function LazyFlipDotDemo() {
  return <FlipDotDemo />;
}
