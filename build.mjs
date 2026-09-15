#!/usr/bin/env node
// Reads the Vermin rules out of the Obsidian vault and writes data.js.
//
//   node build.mjs            # build once
//   VERMIN_VAULT=/path node build.mjs
//
// No dependencies. Runs from the vault's post-commit hook (see README).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VAULT = process.env.VERMIN_VAULT || '/home/wnder/Documents/repos/obsVault';
const CLASS_DIR = path.join(VAULT, 'Vermin/Rules/Classes');
const SKILL_DIR = path.join(CLASS_DIR, 'Skills');
const ICON_DIR = path.join(HERE, 'icons');
const KEYWORD_DIR = path.join(VAULT, 'Vermin/Rules/Keywords');
const OUT = path.join(HERE, 'data.js');

// The palette a keyword note may name. Every one clears WCAG AA on black —
// the CSS defines the same names, so these two lists must stay in step.
const KW_COLORS = ['red', 'blue', 'gold', 'green', 'purple', 'grey'];

// The vault has a history of typos in class names; accept the old spellings so
// a stray "rouge" in a skill's frontmatter still lands on the Rogue page.
const ALIASES = { rouge: 'rogue', barberian: 'barbarian' };

const slug = (s) => {
  const k = String(s).trim().toLowerCase().replace(/\s+/g, '-');
  return ALIASES[k] || k;
};

// --- a YAML subset: enough for frontmatter, nothing more ------------------
// Handles `key: value`, `key: [a, b]`, indented `- item` lists, indented
// `subkey: value` maps, and `>` / `|` block scalars. Full-line `#` comments.
function parseYaml(text) {
  const out = {};
  const lines = text.split('\n');
  const unquote = (v) => {
    v = v.trim();
    if (v.length > 1 && ((v[0] === '"' && v.at(-1) === '"') || (v[0] === "'" && v.at(-1) === "'"))) {
      v = v.slice(1, -1);
    }
    return v;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) continue; // indented lines belong to the key above
    const at = line.indexOf(':');
    if (at < 0) continue;
    const key = line.slice(0, at).trim();
    const rest = line.slice(at + 1).trim();

    // Gather the indented block that follows, if any.
    const block = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim()) { block.push(''); continue; }
      if (!/^\s/.test(l)) break;
      block.push(l.replace(/^\s+/, ''));
    }
    const indentLines = block.filter((l) => l && !l.startsWith('#'));

    if (rest === '>' || rest === '|' || rest === '>-' || rest === '|-') {
      const joined = rest.startsWith('>') ? indentLines.join(' ') : indentLines.join('\n');
      out[key] = joined.replace(/\s+/g, ' ').trim();
      i = j - 1;
    } else if (rest.startsWith('[') && rest.endsWith(']')) {
      out[key] = rest.slice(1, -1).split(',').map(unquote).filter(Boolean);
      i = j - 1;
    } else if (rest === '' && indentLines.length) {
      if (indentLines[0].startsWith('- ')) {
        out[key] = indentLines.map((l) => unquote(l.slice(2)));
      } else {
        const map = {};
        for (const l of indentLines) {
          const c = l.indexOf(':');
          if (c > 0) map[l.slice(0, c).trim()] = unquote(l.slice(c + 1));
        }
        out[key] = map;
      }
      i = j - 1;
    } else {
      out[key] = unquote(rest);
    }
  }
  return out;
}

// Values in this vault are sometimes a scalar and sometimes a list.
const asList = (v) => (v == null || v === '' ? [] : Array.isArray(v) ? v : [v]);

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return [{}, text];
  return [parseYaml(m[1]), text.slice(m[0].length)];
}

const readDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`build: no such directory: ${dir}`);
    process.exit(1);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('.'))
    .map((f) => ({ file: f, text: fs.readFileSync(path.join(dir, f), 'utf8') }));
};

// --- classes --------------------------------------------------------------
function buildClasses() {
  return readDir(CLASS_DIR)
    .filter(({ file }) => file.toLowerCase() !== 'skills') // guard, Skills is a dir
    .map(({ file, text }) => {
      const [fm, body] = splitFrontmatter(text);
      const name = file.replace(/\.md$/, '');

      // Affiliation is written in the body as ==Magic== / ==Power==.
      const aff = body.match(/^==(.+?)==\s*$/m);

      // Everything between "Class mechanic:" and the next blank-line gap or ##.
      const mech = body.match(/^Class mechanic:\s*\n+([\s\S]*?)(?:\n\s*\n\s*\n|\n##|$)/m);

      const ratings = Object.entries(fm.ratings || {})
        .map(([label, value]) => [label, Number(value) || 0])
        .filter(([, value]) => value > 0);

      return {
        slug: slug(name),
        name,
        affiliation: aff ? aff[1].trim() : '',
        mechanic: mech ? mech[1].replace(/\s+/g, ' ').trim() : '',
        playstyle: (fm.playstyle || '').replace(/\s+/g, ' ').trim(),
        ratings,
        skills: [],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// --- skills ---------------------------------------------------------------
function buildSkills(classes) {
  const bySlug = new Map(classes.map((c) => [c.slug, c]));
  const orphans = [];

  for (const { file, text } of readDir(SKILL_DIR)) {
    const [fm, body] = splitFrontmatter(text);

    // The real name lives in the H1 and often differs from the filename.
    const h1 = body.match(/^\s*#\s+(.+?)\s*$/m);

    const skill = {
      name: h1 ? h1[1].trim() : file.replace(/\.md$/, ''),
      file: file.replace(/\.md$/, ''),
      tier: Number(fm.tier) || 1,
      trigger: fm.trigger || '',
      tags: asList(fm.tags).map((t) => String(t).trim()).filter(Boolean),
      effect: String(fm.effect || '').replace(/\s+/g, ' ').trim(),
    };

    const owners = asList(fm.class).map(slug).filter(Boolean);
    if (!owners.length) orphans.push(`${skill.name} (no class:)`);
    for (const owner of owners) {
      const target = bySlug.get(owner);
      if (!target) orphans.push(`${skill.name} (class "${owner}" has no page)`);
      else target.skills.push(skill);
    }
  }

  for (const c of classes) {
    c.skills.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  }
  return orphans;
}

// --- icons ----------------------------------------------------------------
// Any icons/<class-slug>.(png|gif|svg|webp|jpg) you drop in by hand beats the
// built-in sprite. The page falls back to the sprite when this is absent.
function attachIcons(classes) {
  const files = fs.existsSync(ICON_DIR) ? fs.readdirSync(ICON_DIR) : [];
  // Match case-insensitively, but emit the real on-disk filename — Linux is
  // case-sensitive, so "Lich.PNG" must not be rewritten to "lich.png".
  const real = new Map(files.map((f) => [f.toLowerCase(), f]));
  for (const c of classes) {
    for (const ext of ['png', 'gif', 'svg', 'webp', 'jpg']) {
      const hit = real.get(`${c.slug}.${ext}`);
      if (hit) {
        c.icon = 'icons/' + hit;
        break;
      }
    }
  }
}

// --- keywords -------------------------------------------------------------
// One note per term in Rules/Keywords. The note body is the explanation shown
// in the popover; `aliases` adds other spellings that should light up too.
function buildKeywords() {
  if (!fs.existsSync(KEYWORD_DIR)) return []; // optional folder — the site just has no keywords
  return readDir(KEYWORD_DIR)
    .map(({ file, text }) => {
      const [fm, body] = splitFrontmatter(text);
      const h1 = body.match(/^\s*#\s+(.+?)\s*$/m);
      const name = h1 ? h1[1].trim() : file.replace(/\.md$/, '');
      const color = String(fm.color || '').trim().toLowerCase();

      if (color && !KW_COLORS.includes(color)) {
        console.warn(
          `  warn: keyword "${name}" asks for colour "${color}", which is not in the palette ` +
            `(${KW_COLORS.join(', ')}) — it will render plain.`,
        );
      }

      // The explanation is the body with the heading peeled off.
      const explanation = body.replace(/^\s*#\s+.+?$/m, '').replace(/\s+/g, ' ').trim();

      return {
        slug: slug(name),
        name,
        color: KW_COLORS.includes(color) ? color : '',
        terms: [name].concat(asList(fm.aliases).map((a) => String(a).trim())).filter(Boolean),
        explanation,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// --- main -----------------------------------------------------------------
const classes = buildClasses();
attachIcons(classes);
const orphans = buildSkills(classes);
const keywords = buildKeywords();

// Tag vocabulary across every skill, so filters can show what actually exists.
const tags = [...new Set(classes.flatMap((c) => c.skills.flatMap((s) => s.tags)))].sort((a, b) =>
  a.localeCompare(b),
);

const data = {
  generated: new Date().toISOString(),
  source: VAULT,
  tags,
  keywords,
  classes,
};

const body = 'window.VERMIN_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(OUT + '.tmp', body);
fs.renameSync(OUT + '.tmp', OUT); // atomic, so a reload mid-build can't read a half file

const skillCount = classes.reduce((n, c) => n + c.skills.length, 0);
console.log(
  `built ${OUT} — ${classes.length} classes, ${skillCount} skills, ${tags.length} tags, ` +
    `${keywords.length} keywords`,
);
for (const o of orphans) console.warn(`  warn: ${o}`);
