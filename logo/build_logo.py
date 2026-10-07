"""Builds the GTJ vector logo (front view sedan sticker) as SVG + PNG previews.
All geometry is described for the left half and mirrored around x=500."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg, os

OUT = os.path.dirname(os.path.abspath(__file__))
CX = 500

# ---------- font -> path ----------
_font = instantiateVariableFont(TTFont(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'Oswald[wght].ttf')), {'wght': 700})
_gs = _font.getGlyphSet(); _cmap = _font.getBestCmap(); _upm = _font['head'].unitsPerEm

def text_path(s, cx, baseline, cap_h, tracking=0.0):
    """Centered text converted to outlines. cap_h = desired cap height in px."""
    cap_units = _font['OS/2'].sCapHeight or 0.7 * _upm
    sc = cap_h / cap_units
    widths = [_gs[_cmap[ord(c)]].width * sc for c in s]
    total = sum(widths) + tracking * (len(s) - 1)
    x = cx - total / 2
    pen = SVGPathPen(_gs)
    for c, w in zip(s, widths):
        _gs[_cmap[ord(c)]].draw(TransformPen(pen, (sc, 0, 0, -sc, x, baseline)))
        x += w + tracking
    return pen.getCommands()

# ---------- symmetric path helper ----------
def fmt(p):
    return f"{p[0]:.1f} {p[1]:.1f}"

def mirror(p):
    return (2 * CX - p[0], p[1])

def sym(start, segs):
    """start: left-half start point on the axis (top). segs: list of ('L',P) or ('C',c1,c2,P)
    ending on the axis (bottom). Returns a closed symmetric path."""
    d = [f"M{fmt(start)}"]
    pts = [start]
    for s in segs:
        if s[0] == 'L':
            d.append(f"L{fmt(s[1])}")
        else:
            d.append(f"C{fmt(s[1])} {fmt(s[2])} {fmt(s[3])}")
        pts.append(s[-1])
    # reversed + mirrored back up the right side
    for i in range(len(segs) - 1, -1, -1):
        s = segs[i]
        prev = pts[i]
        if s[0] == 'L':
            d.append(f"L{fmt(mirror(prev))}")
        else:
            d.append(f"C{fmt(mirror(s[2]))} {fmt(mirror(s[1]))} {fmt(mirror(prev))}")
    d.append('Z')
    return ' '.join(d)

# ---------- geometry ----------
BODY = sym((500, 38), [
    ('C', (405, 38), (335, 40), (302, 48)),
    ('C', (284, 53), (271, 63), (262, 78)),
    ('L', (214, 168)),
    ('C', (198, 180), (176, 186), (150, 192)),
    ('C', (118, 200), (95, 226), (82, 256)),
    ('C', (68, 282), (58, 305), (56, 335)),
    ('L', (53, 452)),
    ('C', (53, 482), (58, 500), (72, 514)),
    ('C', (125, 546), (210, 562), (310, 568)),
    ('L', (500, 574)),
])
GLASS = sym((500, 60), [
    ('C', (415, 60), (348, 62), (314, 68)),
    ('C', (298, 72), (289, 80), (283, 90)),
    ('L', (240, 166)),
    ('C', (318, 171), (420, 174), (500, 175)),
])
GRILLE = sym((500, 284), [
    ('L', (310, 284)),
    ('C', (277, 284), (259, 300), (259, 328)),
    ('L', (263, 402)),
    ('C', (266, 428), (285, 438), (314, 438)),
    ('L', (500, 438)),
])
LOWER_SLOT = sym((500, 522), [
    ('L', (300, 520)),
    ('C', (282, 520), (272, 530), (276, 541)),
    ('C', (280, 550), (292, 553), (310, 553)),
    ('L', (500, 556)),
])
LIP = sym((500, 552), [
    ('L', (310, 548)),
    ('C', (210, 543), (125, 530), (72, 508)),
    ('C', (78, 528), (96, 540), (125, 552)),
    ('C', (205, 572), (300, 582), (500, 586)),
])

# left-half only pieces (mirrored with <use>)
MIRROR = "M216 152 C186 140 132 134 96 140 C66 145 56 162 60 178 C64 192 96 196 140 192 L216 176 Z"
MIRROR_CAP = "M200 152 C170 145 125 142 96 147 C76 151 70 165 75 175 C120 172 165 168 200 165 Z"
HEADLIGHT = ("M90 262 C150 268 220 280 260 292 L264 300 C246 313 215 320 188 318 "
             "L106 303 C95 297 87 282 90 262 Z")
DRL = "M98 270 C160 276 220 287 254 297"
INTAKE = "M70 352 L214 364 C232 400 246 430 254 456 C246 474 228 484 205 486 L96 492 C80 470 70 430 70 352 Z"
FANG = "M214 364 L238 330 L270 338 L250 360 C262 395 270 425 272 452 L254 456 C246 430 232 400 214 364 Z"
TIRE = "M76 488 L172 488 L172 590 C172 598 166 604 158 604 L90 604 C82 604 76 598 76 590 Z"
HOOD_VENT = "M282 198 C318 194 352 194 384 198 L380 218 C350 214 318 214 286 218 Z"
HOOD_EDGE = "M84 252 C180 254 300 262 500 268"
HOOD_CREASE = "M236 176 C226 205 222 232 224 262"
SHOULDER = "M150 192 C120 200 96 226 84 254"
SIDE_TRIM = "M60 330 L58 450"

def slat(x):
    w = 7.5
    return (f"M{x - w/2:.1f} 306 L{x:.1f} 296 L{x + w/2:.1f} 306 L{x + w/2:.1f} 414 "
            f"C{x + w/2:.1f} 420 {x - w/2:.1f} 420 {x - w/2:.1f} 414 Z")

SLATS = ' '.join(slat(x) for x in (481, 443, 405, 367, 329, 291))

# intake blades (diagonal)
BLADES = ' '.join(
    f"M{80 + i*2} {380 + i*28} L{214 + i*9} {392 + i*24}" for i in range(4))

PLATE_TEXT = text_path("GTJ", 500, 507, 52, tracking=4)

def defs(prefix=''):
    return f"""
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4f57"/>
      <stop offset=".28" stop-color="#2a2d33"/>
      <stop offset=".62" stop-color="#17191c"/>
      <stop offset="1" stop-color="#0b0c0e"/>
    </linearGradient>
    <linearGradient id="bodySide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".55"/>
      <stop offset=".22" stop-color="#000" stop-opacity="0"/>
      <stop offset=".78" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b414a"/>
      <stop offset=".45" stop-color="#14171b"/>
      <stop offset="1" stop-color="#050607"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".35" stop-color="#c9ced5"/>
      <stop offset=".55" stop-color="#6b727b"/>
      <stop offset=".8" stop-color="#e3e6ea"/>
      <stop offset="1" stop-color="#9aa0a8"/>
    </linearGradient>
    <linearGradient id="chromeH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8d939b"/>
      <stop offset=".5" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#8d939b"/>
    </linearGradient>
    <linearGradient id="grilleBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1e22"/>
      <stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b3038"/>
      <stop offset="1" stop-color="#07080a"/>
    </linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7d0f16"/>
      <stop offset=".5" stop-color="#e0262f"/>
      <stop offset="1" stop-color="#7d0f16"/>
    </linearGradient>
    <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#202328"/>
      <stop offset="1" stop-color="#08090a"/>
    </linearGradient>
  </defs>"""

def car_group():
    return f"""
  <!-- sticker border: dark rim + cream outline -->
  <g stroke-linejoin="round" stroke-linecap="round">
    <g fill="#111214" stroke="#111214" stroke-width="58">
      <path d="{BODY}"/><path d="{MIRROR}"/><path d="{TIRE}"/>
      <path d="{MIRROR}" transform="translate(1000 0) scale(-1 1)"/>
      <path d="{TIRE}" transform="translate(1000 0) scale(-1 1)"/>
    </g>
    <g fill="#ECE5D3" stroke="#ECE5D3" stroke-width="44">
      <path d="{BODY}"/><path d="{MIRROR}"/><path d="{TIRE}"/>
      <path d="{MIRROR}" transform="translate(1000 0) scale(-1 1)"/>
      <path d="{TIRE}" transform="translate(1000 0) scale(-1 1)"/>
    </g>
    <g fill="#111214" stroke="#111214" stroke-width="10">
      <path d="{BODY}"/><path d="{MIRROR}"/><path d="{TIRE}"/>
      <path d="{MIRROR}" transform="translate(1000 0) scale(-1 1)"/>
      <path d="{TIRE}" transform="translate(1000 0) scale(-1 1)"/>
    </g>
  </g>

  <!-- tyres -->
  <g id="tireL">
    <path d="{TIRE}" fill="#0c0d0f"/>
    <path d="M86 500 L86 594 M100 500 L100 594 M114 500 L114 594" stroke="#1d2024" stroke-width="5"/>
  </g>
  <use href="#tireL" transform="translate(1000 0) scale(-1 1)"/>

  <!-- body -->
  <path d="{BODY}" fill="url(#body)"/>
  <path d="{BODY}" fill="url(#bodySide)"/>

  <ellipse cx="500" cy="225" rx="260" ry="34" fill="#ffffff" opacity=".05"/>
  <path d="M300 186 C380 180 620 180 700 186" fill="none" stroke="#ffffff" stroke-width="2" opacity=".12"/>
  <!-- glass -->
  <path d="{GLASS}" fill="url(#glass)" stroke="#060708" stroke-width="5"/>
  <path d="M352 70 L292 160 L330 162 L392 70 Z" fill="#ffffff" opacity=".10"/>
  <path d="M420 66 L368 166 L384 167 L436 66 Z" fill="#ffffff" opacity=".07"/>
  <path d="M640 64 L610 120 L622 120 L654 64 Z" fill="#ffffff" opacity=".06"/>
  <path d="M410 168 C445 150 555 150 590 168 Z" fill="#0b0c0e" opacity=".85"/>
  <path d="M262 78 C300 60 400 56 500 56 C600 56 700 60 738 78" fill="none" stroke="#6d737c" stroke-width="3" opacity=".7"/>

  <!-- left half details (mirrored) -->
  <g id="half">
    <path d="{MIRROR}" fill="url(#body)" stroke="#060708" stroke-width="4"/>
    <path d="{MIRROR_CAP}" fill="#5a6069" opacity=".55"/>
    <path d="{SHOULDER}" fill="none" stroke="#8c939c" stroke-width="3" opacity=".75"/>
    <path d="{HOOD_CREASE}" fill="none" stroke="#5f656e" stroke-width="3" opacity=".8"/>
    <path d="{HOOD_VENT}" fill="#07080a" stroke="#6b717a" stroke-width="2.5"/>
    <path d="M290 212 C320 209 350 209 378 212" stroke="#2a2e34" stroke-width="3" fill="none"/>
    <path d="{HOOD_EDGE}" fill="none" stroke="url(#chromeH)" stroke-width="3" opacity=".8"/>
    <!-- headlight -->
    <path d="{HEADLIGHT}" fill="url(#lens)" stroke="#9aa1aa" stroke-width="3"/>
    <path d="{DRL}" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <path d="{DRL}" fill="none" stroke="#bfe6ff" stroke-width="12" stroke-linecap="round" opacity=".18"/>
    <g fill="#e9f3ff">
      {' '.join(f'<path d="M{112+i*22} {292+i*2.6:.1f} l14 1.6 l-2 6.4 l-14 -1.6 Z"/>' for i in range(6))}
    </g>
    <circle cx="214" cy="305" r="8" fill="#2a3038" stroke="#8e959e" stroke-width="2"/>
    <!-- side intake -->
    <path d="{INTAKE}" fill="#08090b" stroke="#3a3f46" stroke-width="3"/>
    <path d="{BLADES}" stroke="#4b5159" stroke-width="7" stroke-linecap="round"/>
    <path d="{BLADES}" stroke="#7b828b" stroke-width="2" stroke-linecap="round" transform="translate(0 -3)"/>
    <path d="{FANG}" fill="url(#chrome)" stroke="#2a2d32" stroke-width="2"/>
    <path d="{SIDE_TRIM}" stroke="#7f868f" stroke-width="3" opacity=".55"/>
  </g>
  <use href="#half" transform="translate(1000 0) scale(-1 1)"/>

  <!-- grille -->
  <path d="{GRILLE}" fill="url(#grilleBg)" stroke="url(#chrome)" stroke-width="8"/>
  <g id="slatsL"><path d="{SLATS}" fill="url(#chrome)"/></g>
  <use href="#slatsL" transform="translate(1000 0) scale(-1 1)"/>
  <!-- GTJ emblem (original mark) -->
  <g>
    <path d="M444 330 L462 314 L538 314 L556 330 L538 346 L462 346 Z" fill="#0c0d0f" stroke="url(#chrome)" stroke-width="6" stroke-linejoin="round"/>
    <path d="M470 337 L500 321 L530 337" fill="none" stroke="url(#chromeH)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M486 337 L500 330 L514 337" fill="none" stroke="#e0262f" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  </g>

  <!-- lower bumper -->
  <path d="{LOWER_SLOT}" fill="#060708" stroke="#33373d" stroke-width="2"/>
  <path d="M300 537 L700 539" stroke="#2c3036" stroke-width="3"/>
  <path d="{LIP}" fill="#0a0b0c"/>
  <path d="M80 516 C150 548 260 566 500 570 C740 566 850 548 920 516" fill="none" stroke="url(#red)" stroke-width="6" stroke-linecap="round"/>

  <!-- plate -->
  <rect x="372" y="444" width="256" height="76" rx="10" fill="url(#plate)" stroke="url(#chrome)" stroke-width="5"/>
  <rect x="381" y="452" width="238" height="60" rx="6" fill="none" stroke="#2b2f35" stroke-width="2"/>
  <path d="{PLATE_TEXT}" fill="url(#chrome)" transform="translate(0 2)" opacity=".35"/>
  <path d="{PLATE_TEXT}" fill="#f3f4f6"/>
"""

LOGO = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 660" width="1000" height="660">
  <title>GTJ</title>{defs()}
  <g transform="translate(0 6)">{car_group()}</g>
</svg>
"""

# Square avatar for Telegram bot / app icon
AVATAR = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <title>GTJ</title>{defs()}
  <defs>
    <pattern id="carbon" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="16" height="16" fill="#141518"/>
      <rect width="8" height="8" fill="#1c1e22"/>
      <rect x="8" y="8" width="8" height="8" fill="#1c1e22"/>
    </pattern>
    <radialGradient id="vign" cx=".5" cy=".42" r=".65">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".75"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#carbon)"/>
  <rect width="1024" height="1024" fill="url(#vign)"/>
  <g transform="translate(110 205) scale(.804)">{car_group()}</g>
  <path d="{text_path('TUNING · CHINA CARS', 512, 850, 32, tracking=10)}" fill="#ECE5D3" opacity=".9"/>
</svg>
"""

for name, svg in (('gtj-logo.svg', LOGO), ('gtj-avatar.svg', AVATAR)):
    with open(os.path.join(OUT, name), 'w') as fh:
        fh.write(svg)
cairosvg.svg2png(bytestring=LOGO.encode(), write_to=os.path.join(OUT, 'gtj-logo.png'), output_width=2000)
cairosvg.svg2png(bytestring=AVATAR.encode(), write_to=os.path.join(OUT, 'gtj-avatar.png'), output_width=1024)
print('done')
