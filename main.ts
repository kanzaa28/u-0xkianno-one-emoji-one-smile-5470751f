// One Emoji, One Smile — entry program.
//
// The entry is exactly one emoji: the emoji most likely to make a
// stranger smile. Chosen emoji: 🫶 (heart hands) — see README.md for
// the head-to-head judging that picked it over 🤗, 🌻, 😊, 🥰 and
// the other candidates.
//
// The program writes exactly that emoji, and nothing else, to
// /output/entry.txt — no trailing newline, no words, no caption.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const EMOJI = "🫶";

// The gate allows 1-8 characters of UTF-8 text, not only whitespace.
// Count code points, not UTF-16 code units: 🫶 is one code point
// (U+1FAF6) but two UTF-16 units, so EMOJI.length would say 2.
const codePoints = [...EMOJI].length;
if (codePoints < 1 || codePoints > 8) {
  throw new Error(`emoji must be 1-8 characters, got ${codePoints}`);
}
if (EMOJI.trim().length === 0) {
  throw new Error("emoji must not be only whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", EMOJI, "utf8");

// Self-check: the file on disk must be byte-identical to the emoji.
// If anything appended a newline or a BOM, fail loudly instead of
// shipping a different entry to the gate. Check both the decoded
// string and the raw UTF-8 byte length (🫶 is 4 bytes: F0 9F AB B6),
// so a stray byte cannot hide behind an equal-looking string.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== EMOJI) {
  throw new Error(`entry.txt mismatch: wrote ${JSON.stringify(EMOJI)}, read ${JSON.stringify(written)}`);
}
const writtenBytes = Buffer.byteLength(written, "utf8");
const expectedBytes = Buffer.byteLength(EMOJI, "utf8");
if (writtenBytes !== expectedBytes) {
  throw new Error(`entry.txt byte length mismatch: expected ${expectedBytes}, got ${writtenBytes}`);
}
