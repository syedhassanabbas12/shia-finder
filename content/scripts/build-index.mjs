// Builds content/register/index.json from every .md file in content/register/.
// Run via `npm run build:index` locally, and in CI on every push that touches
// content/register/**, so the generated index always matches the source of
// truth (the markdown files themselves).
//
// Intentionally dependency-light (no yaml/gray-matter package) so this script
// runs anywhere with plain Node — it parses the small, flat frontmatter shape
// documented in content/register/README.md.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registerDir = path.join(__dirname, '..', 'register');

function parseScalar(raw) {
  const v = raw.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v.replace(/^"(.*)"$/, '$1');
}

function parseInline(raw) {
  const v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseScalar(s));
  }
  if (v.startsWith('{') && v.endsWith('}')) {
    const inner = v.slice(1, -1).trim();
    const obj = {};
    inner.split(',').forEach((pair) => {
      const [k, ...rest] = pair.split(':');
      obj[k.trim()] = parseScalar(rest.join(':'));
    });
    return obj;
  }
  return parseScalar(v);
}

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error('No frontmatter block found');
  const [, fmText, body] = match;
  const lines = fmText.split(/\r?\n/);
  const data = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const topMatch = /^([a-zA-Z0-9_]+):\s*(.*)$/.exec(line);
    if (!topMatch) { i++; continue; }
    const [, key, rest] = topMatch;
    if (rest.trim() !== '') {
      data[key] = parseInline(rest);
      i++;
    } else {
      // nested block, e.g. jamaat: \n  fajr: { adhan: "...", jamaat: "..." }
      const nested = {};
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        const nestedMatch = /^\s+([a-zA-Z0-9_]+):\s*(.*)$/.exec(lines[i]);
        if (nestedMatch) nested[nestedMatch[1]] = parseInline(nestedMatch[2]);
        i++;
      }
      data[key] = nested;
    }
  }
  return { data, body: body.trim() };
}

const files = readdirSync(registerDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

const mosques = files.map((file) => {
  const raw = readFileSync(path.join(registerDir, file), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  return {
    ...data,
    slug: file.replace(/\.md$/, ''),
    notes: body.split('\n_—')[0].trim(),
    notesBy: (body.match(/_—\s*(.+)_/) || [, ''])[1],
  };
});

mosques.sort((a, b) => a.name.localeCompare(b.name));

const outPath = path.join(registerDir, '..', 'index.json');
writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), mosques }, null, 2));
console.log(`Wrote ${mosques.length} mosques to ${outPath}`);
