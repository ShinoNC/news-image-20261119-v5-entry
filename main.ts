// news-image-20261119 entry, v5 (Node 22, standard library only).
//
// One picture: the whole world's news for Thursday 19 November 2026,
// laid out as a 35-story newspaper front page in the format of our
// news-20 v3 entry — a huge serif date under a "THE WORLD IN ONE DAY"
// kicker, a black italic subhead, a six-number strip with thin red
// rules, one continuous region bar segmented by colour, three equal
// lead panels with giant white-on-red labels, ten compact panels
// with red banners, a dark world map with numbered pins, a 22-item
// ALSO list, and a DATE CHECK box. The three leads are the first
// Xi-Trump-Putin trilateral, ending in a Peace Declaration in
// Shenzhen; GTA VI's worldwide launch at Metacritic 99 with 17.1m
// pre-orders; and Anthropic's Nasdaq debut — IPO priced at $83,
// first trade $111.50, up 34%, with a four-row data table on the
// artwork. The ten panels cover the ICJ's 9-6 genocide ruling on
// Myanmar, the COP31 draft dropping fossil fuels and the $120bn aid
// goal, the third Kerch Bridge strike, missile debris over Riyadh,
// Cyclone Akvan's evacuation of 120,000+ in Odisha, Korea's top
// court clearing ex-PM Han, Denmark's 109-0 Arctic pact vote,
// Colombia's national strike, marathon champion Peres Jepchirchir's
// three-year doping ban, and Australia's jobless rate at 4.9%.
// Every story on the page happened, or was first reported, on
// Thursday 19 November 2026; the DATE CHECK box names twelve
// prominent stories this page deliberately excludes for the wrong
// day, and one ALSO item — Iran's claim that two tankers hit mines
// in Hormuz — is marked CLAIM.
//
// The image is 1024 by 1024 pixels and under 1 MiB. It was composed
// offline before this entry was assembled; this program only checks
// it against the gate's limits and writes it, byte for byte, to the
// output directory.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Gate limits for this bounty: at most 1 MiB, exactly 1024 by 1024.
const MAX_BYTES = 1_048_576;
const SIDE_PX = 1024;

// The eight bytes every PNG file starts with.
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function checkPng(buf: Buffer): void {
  if (buf.length < 24) {
    throw new Error(`entry.png is ${buf.length} bytes, too short for a PNG`);
  }
  for (let i = 0; i < PNG_MAGIC.length; i++) {
    if (buf[i] !== PNG_MAGIC[i]) {
      throw new Error("entry.png does not start with the PNG signature");
    }
  }
  if (buf.toString("latin1", 12, 16) !== "IHDR") {
    throw new Error("entry.png has no IHDR chunk where one belongs");
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width !== SIDE_PX || height !== SIDE_PX) {
    throw new Error(
      `entry.png is ${width}x${height}; the gate wants ${SIDE_PX}x${SIDE_PX}`,
    );
  }
  if (buf.length > MAX_BYTES) {
    throw new Error(
      `entry.png is ${buf.length} bytes; the gate allows ${MAX_BYTES}`,
    );
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const image = readFileSync(new URL("./entry.png", import.meta.url));
checkPng(image);
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, image);
// Read the copy back: this program's whole job is a byte-for-byte
// copy, so confirm the bytes on disk are the bytes we meant to write.
const written = readFileSync(outPath);
if (written.length !== image.length || !written.equals(image)) {
  throw new Error(
    `written entry.png is ${written.length} bytes and does not match the ${image.length}-byte source`,
  );
}
