"""GTJ brand assets: plate-style wordmark, Telegram avatar and BotFather cover.

Usage:  pip install fonttools cairosvg && python3 logo/build_logo.py
All text is converted to outlines (Oswald Bold), so the SVGs need no fonts.
"""
import base64
import os

import cairosvg
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
_font = instantiateVariableFont(TTFont(os.path.join(HERE, 'fonts', 'Oswald[wght].ttf')), {'wght': 700})
_gs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
_cap = _font['OS/2'].sCapHeight


def text_path(s, cx, baseline, cap_h, tracking=0.0):
    """Centered text as one SVG path; cap_h is the cap height in px."""
    sc = cap_h / _cap
    widths = [_gs[_cmap[ord(c)]].width * sc for c in s]
    x = cx - (sum(widths) + tracking * (len(s) - 1)) / 2
    pen = SVGPathPen(_gs)
    for c, w in zip(s, widths):
        _gs[_cmap[ord(c)]].draw(TransformPen(pen, (sc, 0, 0, -sc, x, baseline)))
        x += w + tracking
    return pen.getCommands()


DEFS = '''<defs>
  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".38" stop-color="#cfd3d9"/>
    <stop offset=".56" stop-color="#7b828b"/><stop offset=".8" stop-color="#e6e9ec"/><stop offset="1" stop-color="#a3a9b1"/>
  </linearGradient>
  <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1f2226"/><stop offset="1" stop-color="#0a0b0c"/>
  </linearGradient>
  <pattern id="carbon" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="12" height="12" fill="#121315"/><rect width="6" height="6" fill="#191b1e"/><rect x="6" y="6" width="6" height="6" fill="#191b1e"/>
  </pattern>
</defs>'''


def plate(x, y, w, h):
    """The GTJ plate: dark plate, chrome rim, chrome letters, red underline."""
    r = h * 0.14
    cap = h * 0.56
    return f'''<g>
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="url(#plate)" stroke="url(#chrome)" stroke-width="{h*0.06:.1f}"/>
  <rect x="{x + h*0.09:.1f}" y="{y + h*0.09:.1f}" width="{w - h*0.18:.1f}" height="{h - h*0.18:.1f}" rx="{r*0.6:.1f}" fill="none" stroke="#2c3036" stroke-width="{h*0.02:.1f}"/>
  <path d="{text_path('GTJ', x + w/2, y + h*0.5 + cap/2 - h*0.03, cap, tracking=h*0.06)}" fill="url(#chrome)"/>
  <rect x="{x + w*0.3:.1f}" y="{y + h*0.83:.1f}" width="{w*0.4:.1f}" height="{h*0.035:.1f}" rx="{h*0.017:.1f}" fill="#e0262f"/>
</g>'''


def write(name, svg, png_w=None, png_h=None):
    path = os.path.join(HERE, name)
    with open(path, 'w') as fh:
        fh.write(svg)
    if png_w:
        cairosvg.svg2png(bytestring=svg.encode(), write_to=path.replace('.svg', '.png'),
                         output_width=png_w, output_height=png_h)


# 1. Wordmark (transparent) — used in the app header and wherever the brand is shown
WORD = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120" width="300" height="120"><title>GTJ</title>{DEFS}
{plate(6, 6, 288, 108)}</svg>'''
write('gtj-wordmark.svg', WORD, 900, 360)
with open(os.path.join(ROOT, 'img', 'gtj-wordmark.svg'), 'w') as fh:
    fh.write(WORD)

# 2. Telegram avatar 1024×1024 (circle-safe)
AVATAR = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><title>GTJ</title>{DEFS}
<rect width="1024" height="1024" fill="url(#carbon)"/>
<radialGradient id="v" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
<rect width="1024" height="1024" fill="url(#v)"/>
{plate(192, 372, 640, 240)}
<path d="{text_path('TUNING · DETAILING', 512, 712, 30, tracking=9)}" fill="#ece5d3"/>
</svg>'''
write('gtj-avatar.svg', AVATAR, 1024, 1024)

# 3. BotFather /newapp cover 640×360: photo of a client car + plate
with open(os.path.join(ROOT, 'img', 'hero-preface.jpg'), 'rb') as fh:
    photo = base64.b64encode(fh.read()).decode()
COVER = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 360" width="640" height="360">{DEFS}
<rect width="640" height="360" fill="#000"/>
<image x="-20" y="150" width="680" height="216" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/jpeg;base64,{photo}"/>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="#000"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></linearGradient>
<rect width="640" height="360" fill="url(#fade)"/>
{plate(36, 40, 190, 72)}
<path d="{text_path('ТЮНИНГ И ДЕТЕЙЛИНГ', 432, 70, 15, 2.4)}" fill="#efebe2"/>
<path d="{text_path('КИТАЙСКИХ АВТО', 432, 98, 15, 2.4)}" fill="#efebe2"/>
<path d="{text_path('КАТАЛОГ · УСТАНОВКА · STAGE 1-2', 432, 128, 9, 1.6)}" fill="#8b9097"/>
</svg>'''
write('gtj-app-cover.svg', COVER)
cairosvg.svg2png(bytestring=COVER.encode(), write_to=os.path.join(HERE, 'gtj-app-cover-640x360.png'),
                 output_width=640, output_height=360)
print('done')
