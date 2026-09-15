/* Renders the codex from window.VERMIN_DATA (written by build.mjs).
   Plain ES5-era JS on purpose — no build step, opens straight off file://. */

(function () {
  'use strict';

  var DATA = window.VERMIN_DATA;
  if (!DATA) {
    document.body.innerHTML =
      '<p style="font:20px monospace;color:#fff;padding:24px">' +
      'data.js is missing. Run <b>node build.mjs</b> in this folder.</p>';
    return;
  }

  // --- helpers ------------------------------------------------------------

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  var bySlug = {};
  DATA.classes.forEach(function (c) {
    bySlug[c.slug] = c;
  });

  // Hand-authored 16x16 grid -> SVG. One rect per horizontal run of pixels,
  // so a 16x16 sprite costs a couple of dozen rects instead of 256.
  function spriteSVG(rows) {
    var out = '';
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; ) {
        if (row.charAt(x) !== '#') {
          x++;
          continue;
        }
        var w = 1;
        while (row.charAt(x + w) === '#') w++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="1"/>';
        x += w;
      }
    }
    return (
      '<svg class="sprite" viewBox="0 0 16 16" shape-rendering="crispEdges" ' +
      'aria-hidden="true" focusable="false">' + out + '</svg>'
    );
  }

  // A PNG in icons/ always wins over the built-in sprite.
  function iconHTML(cls) {
    if (cls.icon) {
      return '<img class="sprite" src="' + esc(cls.icon) + '" alt="" decoding="async">';
    }
    var rows = (window.VERMIN_SPRITES || {})[cls.slug];
    return rows ? spriteSVG(rows) : '';
  }

  // Pixel art wants nearest-neighbour; a big export wants smooth. Decide per
  // image: an upscale stays crisp, but forcing pixelated on a downscale
  // (a 512px PNG in a 64px box) throws away most of the art.
  function fitSprites() {
    var imgs = document.querySelectorAll('img.sprite');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        var fit = function () {
          var shown = img.getBoundingClientRect().width;
          img.style.imageRendering =
            img.naturalWidth && shown && img.naturalWidth > shown + 1 ? 'auto' : 'pixelated';
        };
        if (img.complete) fit();
        else img.addEventListener('load', fit);
      })(imgs[i]);
    }
  }

  function affKind(aff) {
    var a = String(aff || '').toLowerCase();
    if (a.indexOf('&') >= 0) return 'both';
    if (a === 'magic') return 'magic';
    if (a === 'power') return 'power';
    return '';
  }

  // "==Magic==" renders red and "==Power==" blue without any special case
  // here — both are keyword notes, so decorate() colours them like any other
  // word. Delete those notes and the badge just goes white.
  function affHTML(aff) {
    if (!aff) return '';
    var kind = affKind(aff);
    return (
      '<span class="badge badge--' + kind + (kind === 'both' ? ' on-light' : '') + '">' +
      decorate(aff, {}) + '</span>'
    );
  }

  function ratingsHTML(ratings) {
    if (!ratings || !ratings.length) return '';
    var rows = ratings
      .map(function (r) {
        var pips = '';
        for (var i = 1; i <= 5; i++) {
          pips += '<span class="pip' + (i <= r[1] ? ' pip--on' : '') + '"></span>';
        }
        return (
          '<div class="rating"><span class="rating__label" title="' + esc(r[0]) + '">' +
          esc(r[0]) + '</span><span class="rating__pips">' + pips + '</span></div>'
        );
      })
      .join('');
    return '<div class="ratings">' + rows + '</div>';
  }

  function mechanicHTML(text) {
    if (!text) return '';
    return (
      '<div class="mechanic"><span class="mechanic__label">Class mechanic</span>' +
      '<p class="star">' + decorate(text, {}) + '</p></div>'
    );
  }

  function skillCount(n) {
    return n === 1 ? '1 skill' : n + ' skills';
  }

  // --- keywords -----------------------------------------------------------
  // Every note in Rules/Keywords becomes a term that lights up wherever it is
  // written, and explains itself when you hover or tap it.

  var KW_BY_SLUG = {};
  var KW_BY_TERM = {};
  var KW_RE = null;

  (function indexKeywords() {
    var terms = [];
    (DATA.keywords || []).forEach(function (k) {
      KW_BY_SLUG[k.slug] = k;
      k.terms.forEach(function (t) {
        var key = String(t).trim().toLowerCase();
        if (!key || KW_BY_TERM[key]) return; // first note to claim a term wins
        KW_BY_TERM[key] = k;
        terms.push(key);
      });
    });

    if (!terms.length) return;

    // Longest first: at a given position the longest term that matches should
    // win, so "Hearts" does not leave a stray "s", and a note named "Magic
    // Missile" would beat "Magic".
    terms.sort(function (a, b) {
      return b.length - a.length;
    });

    KW_RE = new RegExp(
      terms
        .map(function (t) {
          var body = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Word-like terms are bounded so "powerful" and "heartsore" stay
          // plain. A symbol term (♥, ♦) has no word boundary to speak of.
          var wordish = /^[a-z0-9]/.test(t) && /[a-z0-9]$/.test(t);
          return wordish ? '\\b' + body + '\\b' : body;
        })
        .join('|'),
      'gi',
    );
  })();

  function kwHTML(kw, text, inert) {
    var cls = 'kw' + (kw.color ? ' kw--' + kw.color : '');
    if (inert) return '<span class="' + cls + '">' + esc(text) + '</span>';
    return (
      '<button type="button" class="' + cls + '" data-kw="' + esc(kw.slug) +
      '" aria-expanded="false">' + esc(text) + '</button>'
    );
  }

  // Escapes `text` and wraps each keyword occurrence. `seen` is the set of
  // slugs already coloured in this block: only the first mention gets the
  // colour and the explanation, so a long effect doesn't turn into confetti.
  // Pass a fresh object per block to colour the first mention in each.
  //
  // `inert` colours without making a button — used inside the popover, where
  // a keyword would otherwise open a second popover on top of the first.
  function decorate(text, seen, inert) {
    var s = String(text == null ? '' : text);
    if (!KW_RE || !s) return esc(s);
    seen = seen || {};

    var out = '';
    var last = 0;
    var m;
    KW_RE.lastIndex = 0;
    while ((m = KW_RE.exec(s))) {
      if (!m[0].length) {
        KW_RE.lastIndex++; // cannot happen, but a bad term must not hang the page
        continue;
      }
      var kw = KW_BY_TERM[m[0].toLowerCase()];
      out += esc(s.slice(last, m.index));
      if (kw && !seen[kw.slug]) {
        seen[kw.slug] = 1;
        out += kwHTML(kw, m[0], inert);
      } else {
        out += esc(m[0]);
      }
      last = m.index + m[0].length;
    }
    return out + esc(s.slice(last));
  }

  var popEl = null;
  var popFor = null;

  function popover() {
    if (!popEl) {
      popEl = document.createElement('div');
      popEl.className = 'pop';
      popEl.setAttribute('role', 'dialog');
      popEl.hidden = true;
      document.body.appendChild(popEl);
    }
    return popEl;
  }

  function placePop() {
    if (!popFor || !popEl || popEl.hidden) return;
    var pad = 12;
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;

    // Measure from the corner so the width can't depend on where we then put
    // it (a fixed box shrink-to-fits against its `left`).
    popEl.style.left = '0px';
    popEl.style.top = '0px';
    var box = popEl.getBoundingClientRect();
    var r = popFor.getBoundingClientRect();

    // Under the word, unless that would run off the bottom — which is the
    // common case for a word low on a phone screen — then above it.
    var top = r.bottom + 8;
    if (top + box.height > vh - pad) {
      var above = r.top - box.height - 8;
      top = above >= pad ? above : Math.max(pad, vh - box.height - pad);
    }

    var left = Math.min(r.left, vw - box.width - pad);
    popEl.style.top = Math.round(top) + 'px';
    popEl.style.left = Math.round(Math.max(pad, left)) + 'px';
  }

  function closePop() {
    if (!popEl || popEl.hidden) return;
    popEl.hidden = true;
    if (popFor) {
      popFor.setAttribute('aria-expanded', 'false');
      popFor = null;
    }
  }

  function openPop(btn) {
    var kw = KW_BY_SLUG[btn.getAttribute('data-kw')];
    if (!kw) return;
    var el = popover();
    el.innerHTML =
      '<p class="pop__name">' + esc(kw.name) + '</p>' +
      '<p class="pop__body on-light">' +
      // Inert: a keyword inside its own explanation is coloured but not
      // another button — nesting popovers is not worth the trouble.
      (kw.explanation ? decorate(kw.explanation, {}, true) : '') +
      '</p>';
    el.hidden = false;
    popFor = btn;
    btn.setAttribute('aria-expanded', 'true');
    placePop();
  }

  // Scrolling keeps the popover stuck to its word rather than leaving it
  // floating over unrelated text; if the word scrolls away, drop it.
  function reposition() {
    if (!popFor) return;
    var r = popFor.getBoundingClientRect();
    var vh = document.documentElement.clientHeight;
    if (r.bottom < 0 || r.top > vh) closePop();
    else placePop();
  }

  function wireKeywords() {
    var hoverable =
      window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hoverable) {
      // Desktop: hover to open, move off to close. Clicking is not wired up,
      // so a hovered word doesn't close itself the moment you click it.
      document.addEventListener('mouseover', function (e) {
        var t = e.target;
        if (!t.closest) return;
        if (t.closest('.pop')) return; // still inside the explanation
        var btn = t.closest('.kw[data-kw]');
        if (btn) {
          if (btn !== popFor) {
            closePop();
            openPop(btn);
          }
        } else {
          closePop();
        }
      });
      document.addEventListener('mouseout', function (e) {
        if (!popFor) return;
        var to = e.relatedTarget;
        if (to && to.closest && to.closest('.kw[data-kw], .pop')) return;
        closePop();
      });
    } else {
      // Touch: tap the word to open, tap anywhere else to dismiss.
      document.addEventListener('click', function (e) {
        var t = e.target;
        var btn = t.closest && t.closest('.kw[data-kw]');
        if (btn) {
          if (btn === popFor) closePop();
          else {
            closePop();
            openPop(btn);
          }
          return;
        }
        if (!(t.closest && t.closest('.pop'))) closePop();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !popFor) return;
      var back = popFor;
      closePop();
      back.focus(); // don't strand a keyboard user with nothing focused
    });

    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
  }

  // --- index page ---------------------------------------------------------

  function renderIndex() {
    var root = document.getElementById('classes');
    var empty = DATA.classes.filter(function (c) {
      return !c.skills.length;
    }).length;

    root.innerHTML = DATA.classes
      .map(function (c) {
        return (
          '<article class="card">' +
          '<div class="card__head">' +
          iconHTML(c) +
          '<div class="card__id">' +
          '<h2 class="card__name">' + esc(c.name) + '</h2>' +
          '<div class="card__badges">' +
          affHTML(c.affiliation) +
          '<span class="badge badge--count">' + esc(skillCount(c.skills.length)) + '</span>' +
          '</div></div></div>' +
          (c.playstyle ? '<p class="playstyle star">' + decorate(c.playstyle, {}) + '</p>' : '') +
          mechanicHTML(c.mechanic) +
          ratingsHTML(c.ratings) +
          '<a class="btn btn--devote" href="class.html?c=' + encodeURIComponent(c.slug) + '">' +
          '<span class="soul">&#9829;</span>Devote</a>' +
          '</article>'
        );
      })
      .join('');

    var note = document.getElementById('note');
    if (note && empty) {
      note.textContent =
        empty + ' of ' + DATA.classes.length + ' classes have no skills written up yet.';
    }
    fitSprites();
    stamp();
  }

  // --- class page ---------------------------------------------------------

  function renderClass() {
    var slug = (new URLSearchParams(location.search).get('c') || '').toLowerCase();
    var cls = bySlug[slug];
    var root = document.getElementById('class-root');

    if (!cls) {
      document.title = 'Unknown class — Vermin';
      root.innerHTML =
        '<div class="empty"><h2>No such class</h2>' +
        '<p class="star">Nothing in the vault goes by &ldquo;' + esc(slug || 'that') +
        '&rdquo;. It may have been renamed.</p>' +
        '<p style="margin-top:16px"><a class="btn" href="index.html">' +
        '<span class="soul">&#9829;</span>Back to the codex</a></p></div>';
      stamp();
      return;
    }

    document.title = cls.name + ' — Vermin';
    var count = cls.skills.length;

    root.innerHTML =
      '<section class="hero">' +
      iconHTML(cls) +
      '<div class="hero__body">' +
      '<h1 class="hero__name">' + esc(cls.name) + '</h1>' +
      '<div class="card__badges">' +
      affHTML(cls.affiliation) +
      '<span class="badge badge--count">' + esc(skillCount(count)) + '</span>' +
      '</div>' +
      (cls.playstyle ? '<p class="playstyle star" style="margin-top:14px">' +
        decorate(cls.playstyle, {}) + '</p>' : '') +
      mechanicHTML(cls.mechanic) +
      ratingsHTML(cls.ratings) +
      '</div></section>' +
      '<div id="filters"></div>' +
      '<section class="skills" id="skills"></section>';
    fitSprites();

    if (!count) {
      document.getElementById('filters').innerHTML =
        '<div class="empty"><h2>No skills recorded</h2>' +
        '<p class="star">Nothing in <b>Rules/Classes/Skills</b> lists <b>' + esc(cls.name) +
        '</b> in its <b>class:</b> frontmatter yet. Add a skill note with ' +
        '<b>class: ' + esc(cls.slug) + '</b> and it shows up here on the next build.</p></div>';
      stamp();
      return;
    }

    // Tag chips come from this class's own skills, most-used first.
    var freq = {};
    cls.skills.forEach(function (s) {
      s.tags.forEach(function (t) {
        freq[t] = (freq[t] || 0) + 1;
      });
    });
    var tags = Object.keys(freq).sort(function (a, b) {
      return freq[b] - freq[a] || a.localeCompare(b);
    });
    var tiers = Object.keys(
      cls.skills.reduce(function (acc, s) {
        acc[s.tier] = 1;
        return acc;
      }, {})
    )
      .map(Number)
      .sort();

    var state = { tiers: {}, tags: {} };
    // Deep-linkable filters: ?c=lich&tier=1,2&tag=Summon
    var qs = new URLSearchParams(location.search);
    (qs.get('tier') || '').split(',').filter(Boolean).forEach(function (t) {
      state.tiers[t] = 1;
    });
    (qs.get('tag') || '').split(',').filter(Boolean).forEach(function (t) {
      state.tags[t] = 1;
    });

    var chips = function (group, value, label, on) {
      return (
        '<button type="button" class="chip" data-group="' + group + '" data-value="' +
        esc(value) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>'
      );
    };

    document.getElementById('filters').innerHTML =
      '<div class="filters">' +
      '<div class="filter-group"><span class="filter-group__label">Tier</span>' +
      tiers
        .map(function (t) {
          return chips('tier', t, 'Tier ' + t, !!state.tiers[t]);
        })
        .join('') +
      '</div>' +
      '<div class="filter-group"><span class="filter-group__label">Tag</span>' +
      tags
        .map(function (t) {
          return chips('tag', t, t, !!state.tags[t]);
        })
        .join('') +
      '</div>' +
      '<div class="filters__actions">' +
      '<button type="button" class="chip" id="clear">Clear</button>' +
      '<span class="filters__count" id="count"></span>' +
      '</div></div>';

    function matches(skill) {
      var wantTier = Object.keys(state.tiers);
      if (wantTier.length && wantTier.indexOf(String(skill.tier)) < 0) return false;
      var wantTag = Object.keys(state.tags);
      if (wantTag.length) {
        var hit = wantTag.some(function (t) {
          return skill.tags.indexOf(t) >= 0;
        });
        if (!hit) return false;
      }
      return true;
    }

    function rowHTML(s) {
      return (
        '<tr>' +
        '<td data-label="Skill">' +
        '<h3 class="skill__name">' + esc(s.name) + '</h3>' +
        '<span class="skill__src">' + esc(s.file) + '.md</span>' +
        '</td>' +
        '<td data-label="Tags"><div class="skill__tags">' +
        (s.tags.length
          ? s.tags
              .map(function (t) {
                return '<span class="tag-chip">' + decorate(t, {}) + '</span>';
              })
              .join('')
          : '<span class="skill__src">none</span>') +
        '</div></td>' +
        '<td data-label="Effect"><p class="skill__effect star">' +
        (s.effect ? decorate(s.effect, {}) : 'none') +
        '</p></td>' +
        '</tr>'
      );
    }

    function paint() {
      var shown = cls.skills.filter(matches);
      var box = document.getElementById('skills');

      // Group by tier, then emit one table per tier that survived the filter.
      // `tiers` is the class's own tier list, so an empty tier never appears.
      var byTier = {};
      shown.forEach(function (s) {
        (byTier[s.tier] = byTier[s.tier] || []).push(s);
      });

      box.innerHTML = shown.length
        ? tiers
            .filter(function (t) {
              return byTier[t];
            })
            .map(function (t) {
              var rows = byTier[t];
              return (
                '<section class="tier">' +
                '<h2 class="tier__head">Tier ' + t +
                '<span class="tier__count">' + esc(skillCount(rows.length)) + '</span></h2>' +
                '<table class="skill-table">' +
                '<colgroup><col class="col-skill"><col class="col-tags">' +
                '<col class="col-effect"></colgroup>' +
                '<thead><tr><th scope="col">Skill</th><th scope="col">Tags</th>' +
                '<th scope="col">Effect</th></tr></thead>' +
                '<tbody>' + rows.map(rowHTML).join('') + '</tbody>' +
                '</table></section>'
              );
            })
            .join('')
        : '<div class="empty"><h2>Nothing matches</h2>' +
          '<p class="star">No skill here is both that tier and that tag. Clear a filter ' +
          'and try again.</p></div>';

      closePop(); // rows just moved under any open popover

      document.getElementById('count').textContent =
        shown.length === count ? count + ' total' : 'showing ' + shown.length + ' of ' + count;

      // Keep the address bar in step so a filtered view can be shared.
      var q = new URLSearchParams();
      q.set('c', cls.slug);
      var t = Object.keys(state.tiers).sort().join(',');
      var g = Object.keys(state.tags).sort().join(',');
      if (t) q.set('tier', t);
      if (g) q.set('tag', g);
      history.replaceState(null, '', location.pathname + '?' + q.toString());
    }

    document.getElementById('filters').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      if (chip.id === 'clear') {
        state.tiers = {};
        state.tags = {};
        this.querySelectorAll('.chip[data-group]').forEach(function (c) {
          c.setAttribute('aria-pressed', 'false');
        });
        paint();
        return;
      }
      var group = chip.dataset.group === 'tier' ? state.tiers : state.tags;
      var value = chip.dataset.value;
      var on = !group[value];
      if (on) group[value] = 1;
      else delete group[value];
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      paint();
    });

    paint();
    stamp();
  }

  // --- shared footer ------------------------------------------------------

  function stamp() {
    var el = document.getElementById('stamp');
    if (!el) return;
    var when = DATA.generated ? new Date(DATA.generated) : null;
    var builds = 'Built ' + (when ? when.toLocaleString() : 'unknown');
    el.innerHTML =
      '<span>' + esc(builds) + '</span>' +
      '<span>' + DATA.classes.length + ' classes &middot; ' +
      DATA.classes.reduce(function (n, c) {
        return n + c.skills.length;
      }, 0) + ' skills</span>' +
      '<span>Source: ' + esc(DATA.source) + '</span>';
  }

  // --- boot ---------------------------------------------------------------

  function boot() {
    if (document.getElementById('classes')) renderIndex();
    else if (document.getElementById('class-root')) renderClass();
    // Attach once, to the document — the page's keywords are replaced on every
    // repaint, so per-element listeners would not survive a filter change.
    wireKeywords();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
