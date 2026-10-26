/* Temporary: report the pixel size of every PNG plate under public/images. */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { decodePng } from "./lib/png.mjs";

const root = join(process.cwd(), "public", "images");
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );

for (const file of walk(root)) {
  if (!file.endsWith(".png")) continue;
  const image = decodePng(file);
  const rel = file.replace(process.cwd(), "").replace(/\\/g, "/");
  console.log(`${rel}  ${image.width}x${image.height}  ${(statSync(file).size / 1024).toFixed(0)}KB`);
}
