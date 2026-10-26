import fs from "node:fs";

const dir = "public/images/";
const rows = [];
for (const f of fs.readdirSync(dir)) {
  const p = dir + f;
  if (!fs.statSync(p).isFile()) continue;
  const b = fs.readFileSync(p);
  const magic = b.subarray(0, 4).toString("hex");
  let w = 0;
  let h = 0;
  if (magic.startsWith("89504e47")) {
    w = b.readUInt32BE(16);
    h = b.readUInt32BE(20);
  } else if (magic.startsWith("ffd8ff")) {
    // JPEG: walk the segment markers to the SOFn frame header.
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = b[i + 1];
      const size = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        h = b.readUInt16BE(i + 5);
        w = b.readUInt16BE(i + 7);
        break;
      }
      i += 2 + size;
    }
  } else {
    continue;
  }
  rows.push(`${f}  ${magic}  ${w}x${h}  ${(w / h).toFixed(3)}`);
}
fs.writeFileSync(".tmp-dims.txt", rows.join("\n") + "\n");
