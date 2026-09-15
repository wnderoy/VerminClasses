# Vermin — Class Codex

A static site for the Vermin tabletop rules: one card per class on the index,
and a skill list per class with tier and tag filters.

White on black, square corners, chunky borders, pixel sprites — Undertale /
Deltarune UI discipline.

## Running it

Open `index.html` in a browser. That's the whole thing — no server, no build
step to *view* it. It works over `file://` because the generated data is a
plain `<script>` global rather than a `fetch`.

## How the auto-update works

The site is generated from the Obsidian vault. Nothing is hand-maintained.

```
vault edit → obsidian-git auto-commits → post-commit hook → node build.mjs → data.js → site
```

`build.mjs` reads the vault and writes `data.js`. The hook lives at
`obsVault/.git/hooks/post-commit` and is deliberately non-blocking: it always
exits 0, so a broken build can never fail or delay a vault backup. It writes
its last result to `build.log` in this directory — check that file when the
site looks stale.

To rebuild by hand:

```sh
node build.mjs
VERMIN_VAULT=/some/other/vault node build.mjs   # point at a different vault
```

### What the build reads

| Source | Becomes |
| --- | --- |
| `Rules/Classes/*.md` | one class each — name from the filename |
| `==Magic==` / `==Power==` in the body | the affiliation badge |
| `Class mechanic:` in the body | the mechanic block |
| `playstyle` + `ratings:` frontmatter | the card blurb and the pip rows |
| `Rules/Classes/Skills/*.md` | every skill, filed under each slug in its `class:` |
| `Rules/Keywords/*.md` | a coloured, tappable term — see below |

A skill appears once per class listed in its `class:` frontmatter, so a shared
skill shows on both pages. A skill with no `class:`, or one naming a class that
has no page, is reported as a warning when you build.

Class names are normalised to slugs (`Tactician` → `tactician`), and the old
misspellings `rouge` / `barberian` are still accepted in `class:` so older
notes keep working.

### Adding a skill

Create a note in `Rules/Classes/Skills/` with frontmatter like:

```yaml
---
class: lich
tier: 2
tags: [Summon, Discard]
trigger: On death
effect: Raise a skeleton that acts on your next turn.
---
# Bone Choir
```

The `# Bone Choir` heading is the displayed name — it may differ from the
filename. New tags become filter chips on the class page automatically, ordered
by how often that class uses them. Nothing to register.

Skills are shown in one table per tier, with the columns **Skill | Tags |
Effect**. `trigger:` is still parsed and kept in `data.js`, it is just not
displayed. Tags get their own full column and render as chunky chips, because
they are what you filter by. Below 640px each row folds into a stacked block so
nothing has to be read sideways.

## Keywords

A keyword is a term that gets coloured everywhere it appears, and that explains
itself when you tap it. One note per term in `Rules/Keywords/`:

```yaml
---
color: red
aliases: [magic, arcane]
---
# Magic

Magic is drawn from the deck's red suits...
```

| Key | |
| --- | --- |
| filename / `# Heading` | the term itself. The heading wins if present. |
| `color:` | one of `red`, `blue`, `gold`, `green`, `purple`, `grey`. Omit it and the term still becomes tappable, just in the normal text colour. |
| `aliases:` | other spellings that should light up too |
| body | the explanation shown in the popover |

Only the **first mention per block** is coloured — per skill row, per mechanic,
per play-style line — so a long effect does not turn into confetti.

The palette is defined twice on purpose: `KW_COLORS` in `build.mjs` and the
`--kw-*` custom properties in `style.css`. Add a colour to both or the build
warns and renders that term plain. Every entry clears WCAG AA on black; the
blues and reds are lighter than pure `#0000ff` / `#ff0000` for that reason.
On a white field — inside the popover, or in the inverted "Magic & Power"
badge — the same names darken via the `.on-light` rules so they stay readable.

**Affiliation badges are just keywords.** `==Magic==` and `==Power==` in a class
note become the badge text, and the badge text is decorated like any other
string, so writing `Magic.md` with `color: red` is what makes the word red on
every magic class. Same for the suits: `Diamonds.md` and `Hearts.md` in red,
`Spades.md` and `Clubs.md` in blue.

A tag that happens to match a keyword lights up too, with no code change — so a
chip like `Frost` becomes coloured and tappable the moment you write
`Keywords/Frost.md`.

## Class icons

Each class has a hand-authored 16×16 pixel sprite in `sprites.js`, used as the
fallback.

To use your own art, drop a file in `icons/` named after the class slug:

```
icons/barbarian.png
icons/cleric.png
icons/lich.png
icons/mage.png
icons/monk.png
icons/ranger.png
icons/rogue.png
icons/tactician.png
```

`.png`, `.gif`, `.svg`, `.webp` and `.jpg` all work, and matching is
case-insensitive (`Lich.PNG` is fine). Any class without a file keeps its
built-in sprite, so you can add them one at a time.

Then run `node build.mjs` once — the build records which classes have art, and
the page swaps the SVG for an `<img>`. Image scaling adapts per file: art
16–64px is upscaled with `image-rendering: pixelated` to stay crisp, while a
larger export is scaled smoothly instead of aliasing. Square art fits the slot
best; anything else is letterboxed to fit.

## Files

| File | |
| --- | --- |
| `build.mjs` | vault → `data.js`. The only thing that writes anything. |
| `data.js` | generated — do not edit, it is overwritten on every build |
| `sprites.js` | the built-in 16×16 fallback sprites |
| `app.js` | renders both pages, handles filtering, and runs the keyword popover |
| `style.css` | the whole design |
| `index.html` | class cards |
| `class.html` | one class's skills, via `?c=<slug>` |

Filters are kept in the URL (`class.html?c=lich&tag=Summon&tier=1`), so a
filtered view can be bookmarked or shared.
