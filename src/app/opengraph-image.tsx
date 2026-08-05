import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16130f",
        }}
      >
        <div
          style={{
            fontSize: 80,
            color: "#d4a24c",
            fontWeight: 700,
          }}
        >
          ኒዮርክ
        </div>

        <div
          style={{
            fontSize: 48,
            color: "#f3ecdd",
            marginTop: 30,
          }}
        >
          New York Cafe & Restaurant
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#d4a24c",
            marginTop: 15,
          }}
        >
          ኒዮርክ ካፌ እና ሬስቶራንት
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}