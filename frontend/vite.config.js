import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Fill <title>, description and social preview from the build-time content
// snapshot (see scripts/snapshot.mjs), so the HTML is meaningful before JS runs.
function siteMeta() {
  let profile = null;
  try {
    const snap = JSON.parse(
      readFileSync(fileURLToPath(new URL("./src/data/snapshot.json", import.meta.url)), "utf8")
    );
    profile = snap.profile;
  } catch {
    /* no snapshot yet */
  }

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const name = profile?.name || "Portfolio";
  const role = profile?.title ? profile.title.split("|")[0].trim() : "";
  const title = role ? `${name} — ${role}` : name;
  const firstSentence = profile?.bio?.match(/^[^.!?]+[.!?]/)?.[0] || profile?.bio || "";
  const description = firstSentence || `${name}'s portfolio — projects, experience and writing.`;
  const avatar = profile?.profileImage?.url || "";
  const heroImg = avatar.includes("/image/upload/")
    ? avatar.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_720,c_limit/")
    : avatar;

  return {
    name: "site-meta",
    transformIndexHtml(html) {
      let out = html
        .replaceAll("%SITE_TITLE%", esc(title))
        .replaceAll("%SITE_DESCRIPTION%", esc(description))
        .replaceAll("%SITE_IMAGE%", esc(avatar));
      if (heroImg) {
        out = out.replace(
          "</head>",
          `  <link rel="preload" as="image" href="${esc(heroImg)}" fetchpriority="high" />\n  </head>`
        );
      }
      return out;
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMeta()],
});
