import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Doto is a variable font, which Satori (the renderer behind ImageResponse)
  // cannot parse — it crashes at render time. Alliance is a static weight,
  // so it's the one usable in this specific rendering context.
  const brandFontData = await readFile(
    path.join(process.cwd(), "Fonts", "Alliance No.2 Regular.otf")
  );

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
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#ff5a1f",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Alliance",
              fontSize: 40,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Dither Dog
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Alliance",
            fontSize: 68,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          Dither your whole world.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            marginTop: 24,
          }}
        >
          Free image, video &amp; GIF dithering — 100% client-side
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Alliance",
          data: brandFontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
