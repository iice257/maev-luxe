# MAEV — storefront

Single-page showcase for MAEV handmade leather totes. Plain HTML/CSS/JS, no build step. Every order funnels to WhatsApp (+234 705 359 9719).

Preview: `python -m http.server 5173` in this folder, then open http://127.0.0.1:5173

## Images

Site images live in `images/` (rebuild from `source-photos/` with `tools/build_images.py`).

| File | Where it appears |
|---|---|
| `hero-1/2/3.jpg` | Hero strip (desktop) / hero-2 on mobile |
| `colour-rose/graphite/dusk/sand/mauve/wine.jpg` | Colour picker |
| `butterfly.jpg` | Butterfly detail |
| `look-1/2/3.jpg` | Lookbook |
| `og.jpg` | Social preview (1200x630, source `tools/og.html`) |

Favicon: `favicon.svg`, `apple-touch-icon.png` (source `tools/icon.html`).

Deploy: `vercel deploy --prod --yes`

## Watermark

The video has a burned-in "MAEV" watermark. `tools/remove_watermark.py` removes it from stills that keep the 9:16 framing:

```
python tools/remove_watermark.py <upscaled_dir> <clean_dir>
```

Needs `opencv-python-headless` and `numpy`. A clean export from the original editor is still better than any removal.

## Editing

- WhatsApp number and per-colour messages: `script.js` (`WA`, `waFor`)
- Colours, names and one-line notes: `index.html` (`.row`, `.dot`) and `script.js` (`names`, `notes`)
- Palette and type: top of `styles.css`
