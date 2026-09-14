#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère les visuels originaux du site (style risographie duotone).
Aucune image n'est téléchargée : tout est dessiné en SVG."""
import math, random, os

OUT_C = "/mnt/user-data/outputs/plein-ecran/assets/img/covers"
OUT_T = "/mnt/user-data/outputs/plein-ecran/assets/img/team"
BASE = "#141822"

INKS = {
    "rose":   "#FF3D2E",
    "jaune":  "#FFB020",
    "menthe": "#35D48A",
    "orange": "#FF6B35",
    "violet": "#8B7DFF",
    "bleu":   "#4DA3FF",
    "craie":  "#EDF0F5",
}

W, H = 1200, 675

def head(w, h, uid):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">
<defs>
<filter id="g{uid}" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
<feColorMatrix type="saturate" values="0"/>
</filter>
<clipPath id="c{uid}"><rect width="{w}" height="{h}"/></clipPath>
</defs>
<g clip-path="url(#c{uid})">
<rect width="{w}" height="{h}" fill="{BASE}"/>'''

def tail(w, h, uid):
    return f'''<rect width="{w}" height="{h}" filter="url(#g{uid})" opacity="0.13" style="mix-blend-mode:overlay"/>
</g></svg>'''

def arcs(r, a, b):
    s = ""
    cx, cy = r.choice([(0, H), (W, 0), (0, 0), (W, H)])
    for i in range(9):
        rad = 120 + i * 105
        col = a if i % 2 == 0 else b
        s += f'<circle cx="{cx}" cy="{cy}" r="{rad}" fill="none" stroke="{col}" stroke-width="{34 - i*2}" opacity="{0.85 - i*0.07:.2f}"/>'
    s += f'<circle cx="{W-cx if cx else W*0.72}" cy="{H*0.35:.0f}" r="86" fill="{b}" opacity="0.9"/>'
    return s

def ridge(r, a, b):
    s = ""
    layers = [(0.72, a, 0.95), (0.60, b, 0.85), (0.50, INKS["craie"], 0.16)]
    s += f'<circle cx="{W*0.72:.0f}" cy="{H*0.30:.0f}" r="118" fill="{b}" opacity="0.95"/>'
    for frac, col, op in layers:
        y = H * frac
        pts = [(0, H)]
        x = 0
        while x <= W:
            pts.append((x, y - r.randint(-30, 150)))
            x += r.randint(120, 220)
        pts.append((W, H))
        d = " ".join(f"{px:.0f},{py:.0f}" for px, py in pts)
        s += f'<polygon points="{d}" fill="{col}" opacity="{op}"/>'
    return s

def orbit(r, a, b):
    cx, cy = W * 0.55, H * 0.5
    s = f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="150" fill="{a}"/>'
    for i in range(4):
        rx = 230 + i * 95
        ry = 78 + i * 34
        rot = -18 + i * 11
        s += (f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx}" ry="{ry}" fill="none" '
              f'stroke="{b}" stroke-width="{7-i}" opacity="{0.9-i*0.16:.2f}" '
              f'transform="rotate({rot} {cx:.0f} {cy:.0f})"/>')
    s += f'<circle cx="{cx-190:.0f}" cy="{cy-120:.0f}" r="26" fill="{b}"/>'
    return s

def dotgrid(r, a, b):
    s = ""
    for gy in range(6, H, 44):
        for gx in range(6, W, 44):
            d = math.hypot(gx - W * 0.66, gy - H * 0.42) / 470
            rad = max(1.5, 12 * (1 - min(d, 1)))
            s += f'<circle cx="{gx}" cy="{gy}" r="{rad:.1f}" fill="{a}" opacity="0.75"/>'
    rx, ry = W * 0.10, H * 0.16
    rw, rh = W * 0.32, H * 0.68
    s += f'<rect x="{rx:.0f}" y="{ry:.0f}" width="{rw:.0f}" height="{rh:.0f}" fill="{b}" opacity="0.95"/>'
    for i in range(7):
        ly = ry + 44 + i * 52
        lw = rw * (0.82 if i % 2 else 0.55)
        s += f'<rect x="{rx+34:.0f}" y="{ly:.0f}" width="{lw:.0f}" height="{14 if i else 40}" fill="{BASE}" opacity="{0.85 if i else 1}"/>'
    s += f'<rect x="{rx+30:.0f}" y="{ry+30:.0f}" width="{rw:.0f}" height="{rh:.0f}" fill="none" stroke="{INKS["craie"]}" stroke-width="4" opacity="0.45"/>'
    s += f'<circle cx="{W*0.72:.0f}" cy="{H*0.42:.0f}" r="{H*0.20:.0f}" fill="none" stroke="{b}" stroke-width="10" opacity="0.9"/>'
    return s

def bars(r, a, b):
    s = ""
    y = 0
    i = 0
    while y < H:
        h = r.randint(10, 58)
        col = a if i % 3 else b
        s += f'<rect x="0" y="{y}" width="{W}" height="{h}" fill="{col}" opacity="{0.20 + (i%4)*0.16:.2f}"/>'
        y += h + r.randint(6, 26)
        i += 1
    s += f'<polygon points="{W*0.58:.0f},0 {W:.0f},0 {W*0.78:.0f},{H} {W*0.36:.0f},{H}" fill="{BASE}" opacity="0.82"/>'
    s += f'<polygon points="{W*0.60:.0f},0 {W*0.66:.0f},0 {W*0.44:.0f},{H} {W*0.38:.0f},{H}" fill="{b}"/>'
    return s

def tunnel(r, a, b):
    s = ""
    for i in range(11):
        k = i / 11
        w = W * (1 - k * 0.86)
        h = H * (1 - k * 0.86)
        x = (W - w) / 2 + (k * 130)
        y = (H - h) / 2 - (k * 40)
        col = a if i % 2 == 0 else b
        s += f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" fill="none" stroke="{col}" stroke-width="{9-i*0.6:.1f}" opacity="{0.9-k*0.55:.2f}"/>'
    return s

def wave(r, a, b):
    s = ""
    for i in range(7):
        amp = 40 + i * 12
        off = H * 0.22 + i * 62
        pts = []
        for x in range(0, W + 30, 30):
            pts.append((x, off + math.sin(x / 150 + i) * amp))
        d = "M " + " L ".join(f"{px},{py:.0f}" for px, py in pts)
        col = a if i % 2 else b
        s += f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{14-i}" opacity="{0.9-i*0.09:.2f}" stroke-linecap="round"/>'
    s += f'<circle cx="{W*0.20:.0f}" cy="{H*0.28:.0f}" r="70" fill="{b}" opacity="0.95"/>'
    return s

def shards(r, a, b):
    s = ""
    cx, cy = W * 0.56, H * 0.5
    s += f'<polygon points="{cx:.0f},{cy-190:.0f} {cx+170:.0f},{cy:.0f} {cx:.0f},{cy+190:.0f} {cx-170:.0f},{cy:.0f}" fill="{b}" opacity="0.95"/>'
    for i in range(16):
        ang = i * (2 * math.pi / 16) + 0.2
        dist = r.randint(180, 470)
        x = cx + math.cos(ang) * dist
        y = cy + math.sin(ang) * dist * 0.7
        w = r.randint(70, 240)
        h = r.randint(10, 26)
        rot = int(math.degrees(ang))
        col = a if i % 3 else INKS["craie"]
        s += (f'<rect x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" fill="{col}" '
              f'opacity="{r.uniform(0.45,0.95):.2f}" transform="rotate({rot} {x:.0f} {y:.0f})"/>')
    s += f'<polygon points="{cx:.0f},{cy-190:.0f} {cx+170:.0f},{cy:.0f} {cx:.0f},{cy+190:.0f} {cx-170:.0f},{cy:.0f}" fill="none" stroke="{a}" stroke-width="8"/>'
    s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="52" fill="{BASE}"/>'
    return s

COMPOS = [arcs, ridge, orbit, dotgrid, bars, tunnel, wave, shards]

COVERS = [
    ("oot-encore-jouable", "violet", "menthe", 6),
    ("jeton-live-service", "orange", "jaune",  7),
    ("zelda-40-ocarina",   "violet", "jaune",  2),
    ("horizon-hunters",    "rose",   "bleu",   7),
    ("warren-spector",     "menthe", "violet", 5),
    ("calendrier-sept",    "jaune",  "rose",   3),
    ("revue-presse",       "bleu",   "menthe", 0),
    ("ardente",        "rose",   "jaune",  0),
    ("silt-runner",    "menthe", "bleu",   1),
    ("ronin-circuit",  "rose",   "orange", 4),
    ("bureau-absents", "violet", "menthe", 3),
    ("grand-massif-2", "bleu",   "craie",  1),
    ("verglas",        "craie",  "bleu",   5),
    ("orbite-basse",   "jaune",  "violet", 2),
    ("dernier-kiosque","orange", "jaune",  3),
    ("cite-17",        "violet", "rose",   5),
    ("prix-des-jeux",  "jaune",  "rose",   4),
    ("preservation",   "menthe", "violet", 7),
    ("accessibilite",  "rose",   "menthe", 6),
    ("serveurs",       "bleu",   "rose",   6),
    ("studio-vertige", "orange", "violet", 0),
    ("salon-annecy",   "jaune",  "menthe", 7),
    ("patch-note",     "menthe", "orange", 4),
]

def make_cover(slug, ink_a, ink_b, compo, uid):
    r = random.Random(sum(ord(c) for c in slug) * 7)
    a, b = INKS[ink_a], INKS[ink_b]
    svg = head(W, H, uid) + COMPOS[compo](r, a, b) + tail(W, H, uid)
    with open(os.path.join(OUT_C, slug + ".svg"), "w") as f:
        f.write(svg)

for i, (slug, a, b, c) in enumerate(COVERS):
    make_cover(slug, a, b, c, i)

# ---- portraits d'équipe : silhouettes géométriques duotone ----
TW = 480
TEAM = [
    ("redaction", "craie",  "rose",   5),
    ("nadia",   "rose",   "jaune",  0),
    ("theo",    "bleu",   "menthe", 1),
    ("solene",  "violet", "jaune",  2),
    ("ibrahim", "menthe", "orange", 3),
    ("camille", "orange", "rose",   4),
    ("hugo",    "jaune",  "bleu",   5),
]

def portrait(slug, ink_a, ink_b, variant, uid):
    a, b = INKS[ink_a], INKS[ink_b]
    s = head(TW, TW, "p" + str(uid))
    # fond : demi-teinte
    for gy in range(10, TW, 26):
        for gx in range(10, TW, 26):
            s += f'<circle cx="{gx}" cy="{gy}" r="4" fill="{b}" opacity="0.22"/>'
    cx, cy = TW / 2, TW * 0.44
    # épaules
    s += f'<path d="M {TW*0.06:.0f} {TW} Q {cx:.0f} {TW*0.60:.0f} {TW*0.94:.0f} {TW} Z" fill="{a}"/>'
    # cheveux / couvre-chef selon variante
    if variant == 0:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.235:.0f}" fill="{b}"/>'
        s += f'<path d="M {cx-TW*0.25:.0f} {cy:.0f} a {TW*0.25:.0f} {TW*0.25:.0f} 0 0 1 {TW*0.50:.0f} 0 l 0 {TW*0.12:.0f} l -{TW*0.50:.0f} 0 Z" fill="{a}" opacity="0.95"/>'
    elif variant == 1:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.225:.0f}" fill="{b}"/>'
        s += f'<rect x="{cx-TW*0.26:.0f}" y="{cy-TW*0.30:.0f}" width="{TW*0.52:.0f}" height="{TW*0.13:.0f}" rx="8" fill="{a}"/>'
    elif variant == 2:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.23:.0f}" fill="{b}"/>'
        s += f'<path d="M {cx-TW*0.30:.0f} {cy+TW*0.10:.0f} q {TW*0.05:.0f} -{TW*0.42:.0f} {TW*0.30:.0f} -{TW*0.40:.0f} q {TW*0.25:.0f} -{TW*0.02:.0f} {TW*0.30:.0f} {TW*0.40:.0f} l -{TW*0.12:.0f} 0 q -{TW*0.06:.0f} -{TW*0.26:.0f} -{TW*0.18:.0f} -{TW*0.26:.0f} q -{TW*0.30:.0f} 0 -{TW*0.18:.0f} {TW*0.26:.0f} Z" fill="{a}"/>'
    elif variant == 3:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.235:.0f}" fill="{b}"/>'
        s += f'<path d="M {cx-TW*0.24:.0f} {cy-TW*0.06:.0f} a {TW*0.24:.0f} {TW*0.24:.0f} 0 0 1 {TW*0.48:.0f} 0 Z" fill="{a}"/>'
    elif variant == 4:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.22:.0f}" fill="{b}"/>'
        s += f'<circle cx="{cx-TW*0.22:.0f}" cy="{cy-TW*0.02:.0f}" r="{TW*0.10:.0f}" fill="{a}"/>'
        s += f'<circle cx="{cx+TW*0.22:.0f}" cy="{cy-TW*0.02:.0f}" r="{TW*0.10:.0f}" fill="{a}"/>'
        s += f'<path d="M {cx-TW*0.24:.0f} {cy-TW*0.08:.0f} a {TW*0.24:.0f} {TW*0.24:.0f} 0 0 1 {TW*0.48:.0f} 0 Z" fill="{a}"/>'
    else:
        s += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{TW*0.23:.0f}" fill="{b}"/>'
        s += f'<rect x="{cx-TW*0.27:.0f}" y="{cy-TW*0.28:.0f}" width="{TW*0.54:.0f}" height="{TW*0.10:.0f}" rx="{TW*0.05:.0f}" fill="{a}"/>'
        s += f'<rect x="{cx-TW*0.34:.0f}" y="{cy-TW*0.20:.0f}" width="{TW*0.68:.0f}" height="{TW*0.045:.0f}" rx="6" fill="{a}"/>'
    # lunettes / traits
    if variant in (1, 5):
        s += (f'<circle cx="{cx-TW*0.09:.0f}" cy="{cy+TW*0.02:.0f}" r="{TW*0.062:.0f}" fill="none" stroke="{BASE}" stroke-width="7"/>'
              f'<circle cx="{cx+TW*0.09:.0f}" cy="{cy+TW*0.02:.0f}" r="{TW*0.062:.0f}" fill="none" stroke="{BASE}" stroke-width="7"/>'
              f'<line x1="{cx-TW*0.028:.0f}" y1="{cy+TW*0.02:.0f}" x2="{cx+TW*0.028:.0f}" y2="{cy+TW*0.02:.0f}" stroke="{BASE}" stroke-width="7"/>')
    else:
        s += (f'<circle cx="{cx-TW*0.08:.0f}" cy="{cy+TW*0.01:.0f}" r="{TW*0.022:.0f}" fill="{BASE}"/>'
              f'<circle cx="{cx+TW*0.08:.0f}" cy="{cy+TW*0.01:.0f}" r="{TW*0.022:.0f}" fill="{BASE}"/>')
    s += tail(TW, TW, "p" + str(uid))
    with open(os.path.join(OUT_T, slug + ".svg"), "w") as f:
        f.write(s)

for i, (slug, a, b, v) in enumerate(TEAM):
    portrait(slug, a, b, v, i)

print("covers:", len(os.listdir(OUT_C)), "| team:", len(os.listdir(OUT_T)))
