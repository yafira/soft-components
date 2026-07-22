import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fdfbf7",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: 220,
          height: 170,
          marginBottom: 44,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 60,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 105,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 150,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 60,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 105,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 150,
            width: 10,
            height: 34,
            background: "#8a77c4",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 30,
            left: 20,
            width: 180,
            height: 110,
            background: "#cdc1ee",
            border: "6px dashed #8a77c4",
            borderRadius: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              background: "#f6c8d8",
              border: "6px solid #c46a8c",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 72,
          color: "#3d3548",
          letterSpacing: -1,
        }}
      >
        soft components
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#6f6580",
          marginTop: 20,
        }}
      >
        a digital library of soft electronic components
      </div>

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 40,
          bottom: 40,
          border: "3px dashed #ddd0f0",
          borderRadius: 32,
        }}
      />
    </div>,
    { ...size },
  );
}
