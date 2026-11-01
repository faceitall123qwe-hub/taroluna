"""
Tarot App — Visual Design Reference Mockups
3 mobile screens (375x812px) generated via PIL
"""

import math
import os
import random
from PIL import Image, ImageDraw, ImageFont

FONTS_DIR = os.environ.get("FONTS_DIR", os.path.join(os.path.dirname(__file__), "fonts"))
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
W, H = 375, 812


def load_font(name, size):
    try:
        return ImageFont.truetype(f"{FONTS_DIR}\\{name}", size)
    except Exception:
        return ImageFont.load_default()


def center_text(draw, text, font, y, color, width=W):
    bbox = draw.textbbox((0, 0), text, font=font)
    x = (width - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), text, font=font, fill=color)


def draw_star(draw, cx, cy, r, color, alpha_scale=1.0):
    """Draw a small glowing star dot."""
    if isinstance(color, tuple) and len(color) == 4:
        a = int(color[3] * alpha_scale)
        c = (color[0], color[1], color[2], a)
    else:
        c = color
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)


# ─────────────────────────────────────────────
# STYLE 1: MIDNIGHT MYSTIC
# ─────────────────────────────────────────────
def make_midnight_mystic():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # Background gradient: near-black at bottom → deep navy at top
    for y in range(H):
        t = y / H
        r = int(2 + t * 8)
        g = int(2 + t * 12)
        b = int(18 + t * 42)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Stars / constellation background
    rng = random.Random(42)
    star_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(star_layer)

    # scattered tiny stars
    for _ in range(180):
        sx = rng.randint(0, W)
        sy = rng.randint(0, H)
        br = rng.randint(140, 255)
        r = rng.choice([1, 1, 1, 2])
        sd.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(br, br, int(br * 0.85), br))

    # constellation lines (thin gold)
    GOLD_DIM = (180, 145, 60, 60)
    GOLD_STAR = (220, 185, 90, 200)
    constellations = [
        [(45, 80), (90, 60), (140, 75), (165, 55)],
        [(220, 90), (260, 70), (290, 95), (310, 75)],
        [(30, 680), (65, 700), (95, 685), (120, 710)],
    ]
    for pts in constellations:
        for i in range(len(pts) - 1):
            sd.line([pts[i], pts[i + 1]], fill=GOLD_DIM, width=1)
        for pt in pts:
            sd.ellipse([pt[0]-2, pt[1]-2, pt[0]+2, pt[1]+2], fill=GOLD_STAR)

    img = Image.alpha_composite(img, star_layer)
    draw = ImageDraw.Draw(img)

    # ── Header area ──
    GOLD = (212, 175, 55, 255)
    GOLD_LIGHT = (255, 220, 100, 255)
    CREAM = (245, 235, 210, 255)
    CREAM_DIM = (200, 185, 155, 200)

    # Thin gold top line
    draw.line([(28, 52), (W - 28, 52)], fill=GOLD, width=1)

    # Logo symbol (small 8-pointed star in gold)
    lx, ly = W // 2, 90
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        inner = 6
        outer = 14
        x1 = lx + math.cos(rad) * inner
        y1 = ly + math.sin(rad) * inner
        x2 = lx + math.cos(rad) * outer
        y2 = ly + math.sin(rad) * outer
        draw.line([(x1, y1), (x2, y2)], fill=GOLD_LIGHT, width=2)
    draw.ellipse([lx-4, ly-4, lx+4, ly+4], fill=GOLD_LIGHT)

    f_title = load_font("Italiana-Regular.ttf", 28)
    f_sub = load_font("CrimsonPro-Italic.ttf", 13)
    f_label = load_font("CrimsonPro-Regular.ttf", 11)

    center_text(draw, "ARCANA", f_title, 112, GOLD)
    center_text(draw, "— sacred readings —", f_sub, 148, CREAM_DIM)

    draw.line([(28, 172), (W - 28, 172)], fill=GOLD, width=1)

    # ── Featured tarot card ──
    cx = W // 2
    card_w, card_h = 160, 260
    card_x = cx - card_w // 2
    card_y = 195

    # Outer glow (soft gold haze)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i in range(18, 0, -1):
        alpha = int(22 * (1 - i / 18))
        gd.rounded_rectangle(
            [card_x - i*2, card_y - i*2, card_x + card_w + i*2, card_y + card_h + i*2],
            radius=6 + i, outline=(212, 175, 55, alpha), width=1
        )
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Card fill — deep navy
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                            radius=6, fill=(8, 12, 38, 255))

    # Double border (outer gold, inner subtle)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                            radius=6, outline=GOLD, width=2)
    draw.rounded_rectangle([card_x + 6, card_y + 6, card_x + card_w - 6, card_y + card_h - 6],
                            radius=4, outline=(180, 145, 55, 120), width=1)

    # Inner card pattern — star mandala
    mcx = card_x + card_w // 2
    mcy = card_y + card_h // 2

    # concentric circles
    for r in [15, 30, 50, 72, 90]:
        alpha = 80 + (90 - r) if r < 90 else 40
        draw.ellipse([mcx - r, mcy - r, mcx + r, mcy + r],
                     outline=(212, 175, 55, min(alpha, 180)), width=1)

    # radial lines
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        x1 = mcx + math.cos(rad) * 15
        y1 = mcy + math.sin(rad) * 15
        x2 = mcx + math.cos(rad) * 90
        y2 = mcy + math.sin(rad) * 90
        draw.line([(x1, y1), (x2, y2)], fill=(212, 175, 55, 50), width=1)

    # central star
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        x1 = mcx + math.cos(rad) * 4
        y1 = mcy + math.sin(rad) * 4
        x2 = mcx + math.cos(rad) * 18
        y2 = mcy + math.sin(rad) * 18
        draw.line([(x1, y1), (x2, y2)], fill=GOLD_LIGHT, width=2)
    draw.ellipse([mcx-4, mcy-4, mcx+4, mcy+4], fill=GOLD_LIGHT)

    # card label
    f_card_label = load_font("CrimsonPro-Italic.ttf", 11)
    center_text(draw, "THE STAR", f_card_label, card_y + card_h - 22, CREAM_DIM)

    # ── Start Reading button ──
    btn_y = card_y + card_h + 36
    btn_x1, btn_x2 = 80, W - 80
    btn_h = 44

    # Button glow
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(glow2)
    for i in range(8, 0, -1):
        a = int(15 * (1 - i / 8))
        gd2.rounded_rectangle([btn_x1 - i, btn_y - i, btn_x2 + i, btn_y + btn_h + i],
                               radius=22 + i, outline=(212, 175, 55, a), width=1)
    img = Image.alpha_composite(img, glow2)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([btn_x1, btn_y, btn_x2, btn_y + btn_h],
                            radius=22, outline=GOLD, width=2)

    f_btn = load_font("CrimsonPro-Regular.ttf", 14)
    center_text(draw, "BEGIN YOUR READING", f_btn, btn_y + 14, GOLD)

    # ── Bottom nav ──
    nav_y = H - 72
    draw.line([(0, nav_y), (W, nav_y)], fill=(212, 175, 55, 80), width=1)
    draw.rectangle([0, nav_y, W, H], fill=(4, 6, 20, 240))

    nav_items = [("☽", "Cards"), ("✦", "Spread"), ("◈", "Journal"), ("⊕", "Profile")]
    nav_xs = [47, 125, 250, 328]
    f_nav_icon = load_font("CrimsonPro-Regular.ttf", 18)
    f_nav_label = load_font("CrimsonPro-Regular.ttf", 9)

    for i, ((icon, label), nx) in enumerate(zip(nav_items, nav_xs)):
        col = GOLD if i == 1 else CREAM_DIM
        center_text(draw, icon, f_nav_icon, nav_y + 10, col, W)
        # individual x positioning
        bbox = draw.textbbox((0, 0), icon, font=f_nav_icon)
        iw = bbox[2] - bbox[0]
        draw.text((nx - iw // 2, nav_y + 10), icon, font=f_nav_icon, fill=col)
        bbox2 = draw.textbbox((0, 0), label, font=f_nav_label)
        lw = bbox2[2] - bbox2[0]
        draw.text((nx - lw // 2, nav_y + 34), label, font=f_nav_label, fill=col)

    # Active indicator dot
    draw.ellipse([nav_xs[1] - 2, nav_y + 55, nav_xs[1] + 2, nav_y + 59], fill=GOLD)

    # Status bar area
    f_status = load_font("CrimsonPro-Regular.ttf", 10)
    draw.text((28, 28), "9:41", font=f_status, fill=CREAM_DIM)
    draw.text((W - 70, 28), "●●● ▲", font=f_status, fill=CREAM_DIM)

    img = img.convert("RGB")
    img.save(f"{OUT_DIR}\\style1-midnight-mystic.png", "PNG", dpi=(144, 144))
    print("Saved style1-midnight-mystic.png")


# ─────────────────────────────────────────────
# STYLE 2: COSMIC PURPLE
# ─────────────────────────────────────────────
def make_cosmic_purple():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # Gradient: deep violet bottom → dark magenta-violet top
    for y in range(H):
        t = y / H
        # bottom: dark purple, top: dark violet-blue with slight magenta
        r = int(18 + (1 - t) * 30)
        g = int(8 + (1 - t) * 10)
        b = int(52 + (1 - t) * 28)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Radial glow behind card area
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r in range(200, 0, -4):
        a = int(12 * (1 - r / 200))
        gd.ellipse([W//2 - r, 340 - r, W//2 + r, 340 + r],
                   fill=(140, 60, 200, a))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # ── Color palette ──
    VIOLET = (180, 80, 255, 255)
    MAGENTA = (220, 60, 180, 255)
    SILVER = (210, 200, 230, 255)
    WHITE = (255, 255, 255, 255)
    PALE = (200, 180, 230, 180)

    # ── Moon phases strip at top ──
    moon_y = 68
    phases_x = [48, 95, 142, 188, 234, 282, 328]
    moon_sizes = [4, 6, 8, 10, 8, 6, 4]
    for mx, ms in zip(phases_x, moon_sizes):
        # full to crescent simulation
        draw.ellipse([mx - ms, moon_y - ms, mx + ms, moon_y + ms],
                     outline=(200, 170, 240, 160), width=1)
    # highlight center full moon
    cm = phases_x[3]
    draw.ellipse([cm - 10, moon_y - 10, cm + 10, moon_y + 10],
                 fill=(220, 200, 255, 80), outline=(210, 180, 255, 220), width=1)

    f_logo = load_font("PoiretOne-Regular.ttf", 32)
    f_sub = load_font("InstrumentSans-Regular.ttf", 11)
    f_label = load_font("InstrumentSans-Regular.ttf", 10)

    center_text(draw, "SELENE", f_logo, 90, WHITE)
    center_text(draw, "TAROT  ·  ORACLE  ·  INTUITION", f_sub, 130, PALE)

    # Thin magenta line
    draw.line([(40, 152), (W - 40, 152)], fill=(200, 80, 180, 120), width=1)

    # ── Status bar ──
    f_status = load_font("InstrumentSans-Regular.ttf", 10)
    draw.text((28, 28), "9:41", font=f_status, fill=PALE)

    # ── Featured card ──
    cx = W // 2
    card_w, card_h = 158, 256
    card_x = cx - card_w // 2
    card_y = 172

    # Card bg — deep purple gradient
    card_img = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card_img)
    for y in range(card_h):
        t = y / card_h
        r_ = int(22 + t * 12)
        g_ = int(10 + t * 5)
        b_ = int(55 + t * 25)
        cd.line([(0, y), (card_w, y)], fill=(r_, g_, b_, 255))

    # rounded mask
    mask = Image.new("L", (card_w, card_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, card_w - 1, card_h - 1], radius=10, fill=255)
    card_img.putalpha(mask)
    img.paste(card_img, (card_x, card_y), card_img)
    draw = ImageDraw.Draw(img)

    # Outer glow border
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(glow2)
    for i in range(12, 0, -1):
        a = int(18 * (1 - i / 12))
        gd2.rounded_rectangle(
            [card_x - i, card_y - i, card_x + card_w + i, card_y + card_h + i],
            radius=10 + i, outline=(180, 80, 255, a), width=1
        )
    img = Image.alpha_composite(img, glow2)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                            radius=10, outline=VIOLET, width=2)
    draw.rounded_rectangle([card_x + 7, card_y + 7,
                             card_x + card_w - 7, card_y + card_h - 7],
                            radius=7, outline=(200, 100, 255, 80), width=1)

    # Crescent moon on card
    mcx = card_x + card_w // 2
    mcy = card_y + 90
    # outer circle
    draw.ellipse([mcx - 38, mcy - 38, mcx + 38, mcy + 38],
                 outline=(200, 160, 255, 160), width=1)
    # crescent
    draw.ellipse([mcx - 28, mcy - 28, mcx + 28, mcy + 28],
                 outline=(180, 120, 255, 100), width=1)
    # moon disc
    draw.ellipse([mcx - 20, mcy - 20, mcx + 20, mcy + 20],
                 fill=(60, 25, 100, 200), outline=(210, 170, 255, 220), width=2)
    # crescent overlay (erase part for crescent shape)
    draw.ellipse([mcx - 8, mcy - 22, mcx + 22, mcy + 22],
                 fill=(28, 12, 60, 200))

    # stars around moon
    star_pts = [(mcx - 35, mcy - 30), (mcx + 32, mcy - 25),
                (mcx - 28, mcy + 35), (mcx + 35, mcy + 28), (mcx, mcy - 42)]
    for sp in star_pts:
        draw.ellipse([sp[0]-1, sp[1]-1, sp[0]+1, sp[1]+1], fill=(220, 200, 255, 200))

    # vertical symmetry lines on lower card
    card_lx = card_x + card_w // 2
    for xi in [-30, 0, 30]:
        draw.line([(card_lx + xi, mcy + 55), (card_lx + xi, card_y + card_h - 20)],
                  fill=(180, 80, 255, 40), width=1)

    f_card_label = load_font("InstrumentSans-Regular.ttf", 10)
    center_text(draw, "T H E   M O O N", f_card_label, card_y + card_h - 22, PALE)

    # Scattered stars in lower portion
    star_layer2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sl2d = ImageDraw.Draw(star_layer2)
    rng2 = random.Random(77)
    for _ in range(90):
        sx = rng2.randint(10, W - 10)
        sy = rng2.randint(440, H - 80)
        br = rng2.randint(60, 160)
        sl2d.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=(br, int(br * 0.7), br, br))
    img = Image.alpha_composite(img, star_layer2)
    draw = ImageDraw.Draw(img)

    # ── CTA Button ──
    btn_y = card_y + card_h + 28
    btn_x1, btn_x2 = 55, W - 55
    btn_h_val = 48

    # Gradient fill button
    btn_fill = Image.new("RGBA", (btn_x2 - btn_x1, btn_h_val), (0, 0, 0, 0))
    bfd = ImageDraw.Draw(btn_fill)
    for x in range(btn_x2 - btn_x1):
        t = x / (btn_x2 - btn_x1)
        r_ = int(120 + t * 80)
        g_ = int(20 + t * 20)
        b_ = int(220 - t * 40)
        bfd.line([(x, 0), (x, btn_h_val)], fill=(r_, g_, b_, 200))
    btn_mask = Image.new("L", (btn_x2 - btn_x1, btn_h_val), 0)
    bmd = ImageDraw.Draw(btn_mask)
    bmd.rounded_rectangle([0, 0, btn_x2 - btn_x1 - 1, btn_h_val - 1], radius=24, fill=255)
    btn_fill.putalpha(btn_mask)
    img.paste(btn_fill, (btn_x1, btn_y), btn_fill)
    draw = ImageDraw.Draw(img)

    f_btn = load_font("InstrumentSans-Bold.ttf", 13)
    center_text(draw, "START READING", f_btn, btn_y + 16, WHITE)

    # ── Bottom nav ──
    nav_y = H - 75
    nav_bg = Image.new("RGBA", (W, 75), (0, 0, 0, 0))
    nbd = ImageDraw.Draw(nav_bg)
    for y in range(75):
        t = y / 75
        a = int(200 + t * 55)
        nbd.line([(0, y), (W, y)], fill=(14, 6, 38, a))
    img.paste(nav_bg, (0, nav_y), nav_bg)
    draw = ImageDraw.Draw(img)

    draw.line([(0, nav_y), (W, nav_y)], fill=(180, 80, 255, 80), width=1)

    nav_items = [("☾", "Cards"), ("◎", "Spread"), ("✦", "Ritual"), ("◇", "You")]
    nav_xs = [47, 125, 250, 328]
    f_nav = load_font("InstrumentSans-Regular.ttf", 18)
    f_nav_label = load_font("InstrumentSans-Regular.ttf", 9)

    for i, ((icon, label), nx) in enumerate(zip(nav_items, nav_xs)):
        col = (220, 140, 255, 255) if i == 1 else (160, 130, 200, 180)
        bbox = draw.textbbox((0, 0), icon, font=f_nav)
        iw = bbox[2] - bbox[0]
        draw.text((nx - iw // 2, nav_y + 10), icon, font=f_nav, fill=col)
        bbox2 = draw.textbbox((0, 0), label, font=f_nav_label)
        lw = bbox2[2] - bbox2[0]
        draw.text((nx - lw // 2, nav_y + 36), label, font=f_nav_label, fill=col)

    draw.ellipse([nav_xs[1] - 2, nav_y + 57, nav_xs[1] + 2, nav_y + 61],
                 fill=(220, 140, 255, 255))

    img = img.convert("RGB")
    img.save(f"{OUT_DIR}\\style2-cosmic-purple.png", "PNG", dpi=(144, 144))
    print("Saved style2-cosmic-purple.png")


# ─────────────────────────────────────────────
# STYLE 3: DARK MINIMAL
# ─────────────────────────────────────────────
def make_dark_minimal():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # ── Colors ──
    WHITE = (255, 255, 255, 255)
    SILVER = (200, 200, 200, 255)
    SILVER_DIM = (140, 140, 140, 180)
    SILVER_FAINT = (80, 80, 80, 100)
    NEAR_WHITE = (240, 238, 235, 255)

    # Extremely faint gradient — near pure black
    for y in range(H):
        t = y / H
        v = int(t * 6)
        draw.line([(0, y), (W, y)], fill=(v, v, v, 255))

    f_logo = load_font("Jura-Light.ttf", 36)
    f_tag = load_font("Jura-Light.ttf", 10)
    f_sub = load_font("InstrumentSans-Regular.ttf", 10)

    # ── Status bar ──
    draw.text((28, 28), "9:41", font=f_sub, fill=SILVER_DIM)

    # ── Header ──
    # Minimal single hairline across top
    draw.line([(28, 56), (W - 28, 56)], fill=SILVER_FAINT, width=1)

    # Logo: just the word, ultra-thin
    center_text(draw, "VEIL", f_logo, 70, NEAR_WHITE)

    # Tagline in spaced-out caps
    f_tag2 = load_font("InstrumentSans-Regular.ttf", 9)
    center_text(draw, "T A R O T  ·  R E A D I N G S", f_tag2, 114, SILVER_DIM)

    draw.line([(28, 136), (W - 28, 136)], fill=SILVER_FAINT, width=1)

    # ── Featured card ──
    cx = W // 2
    card_w, card_h = 154, 252
    card_x = cx - card_w // 2
    card_y = 162

    # Card background — very slightly dark gray
    draw.rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                   fill=(8, 8, 8, 255))

    # Outer single-pixel white border
    draw.rectangle([card_x, card_y, card_x + card_w, card_y + card_h],
                   outline=(200, 200, 200, 255), width=1)

    # Inner border offset 8px
    draw.rectangle([card_x + 8, card_y + 8,
                    card_x + card_w - 8, card_y + card_h - 8],
                   outline=(80, 80, 80, 120), width=1)

    # Minimal geometric ornament — cross + circle
    mcx = card_x + card_w // 2
    mcy = card_y + card_h // 2

    # Large thin circle
    draw.ellipse([mcx - 55, mcy - 55, mcx + 55, mcy + 55],
                 outline=(100, 100, 100, 100), width=1)
    # Medium circle
    draw.ellipse([mcx - 35, mcy - 35, mcx + 35, mcy + 35],
                 outline=(120, 120, 120, 80), width=1)
    # Cross lines
    draw.line([(mcx - 65, mcy), (mcx + 65, mcy)], fill=(100, 100, 100, 80), width=1)
    draw.line([(mcx, mcy - 100), (mcx, mcy + 100)], fill=(100, 100, 100, 80), width=1)
    # Diagonal lines (lighter)
    for angle in [45, 135]:
        rad = math.radians(angle)
        dx = math.cos(rad) * 55
        dy = math.sin(rad) * 55
        draw.line([(mcx - dx, mcy - dy), (mcx + dx, mcy + dy)],
                  fill=(70, 70, 70, 70), width=1)

    # Center point
    draw.ellipse([mcx - 2, mcy - 2, mcx + 2, mcy + 2], fill=(180, 180, 180, 200))

    # Four corner marks inside inner border
    corners = [
        (card_x + 16, card_y + 16), (card_x + card_w - 16, card_y + 16),
        (card_x + 16, card_y + card_h - 16), (card_x + card_w - 16, card_y + card_h - 16)
    ]
    for (cx_, cy_) in corners:
        draw.ellipse([cx_ - 1, cy_ - 1, cx_ + 1, cy_ + 1], fill=(100, 100, 100, 160))

    # Card label
    f_card = load_font("Jura-Light.ttf", 10)
    center_text(draw, "T H E   W O R L D", f_card, card_y + card_h - 26, SILVER_DIM)

    # Roman numeral top of card
    f_roman = load_font("Jura-Light.ttf", 11)
    center_text(draw, "XXI", f_roman, card_y + 14, SILVER_DIM)

    # ── CTA Button ──
    btn_y = card_y + card_h + 40
    btn_x1, btn_x2 = 80, W - 80
    btn_h_val = 44

    # Outline-only button
    draw.rectangle([btn_x1, btn_y, btn_x2, btn_y + btn_h_val],
                   outline=(200, 200, 200, 255), width=1)

    f_btn = load_font("Jura-Light.ttf", 12)
    center_text(draw, "S T A R T  R E A D I N G", f_btn, btn_y + 15, SILVER)

    # Corner accents on button
    accent_len = 8
    corners_btn = [
        (btn_x1, btn_y), (btn_x2, btn_y),
        (btn_x1, btn_y + btn_h_val), (btn_x2, btn_y + btn_h_val)
    ]
    # just emphasize corners with same color (already drawn by rectangle outline)

    # ── Small tarot card mini-preview row ──
    mini_y = btn_y + btn_h_val + 36
    draw.line([(28, mini_y - 10), (W - 28, mini_y - 10)], fill=SILVER_FAINT, width=1)
    f_section = load_font("InstrumentSans-Regular.ttf", 9)
    center_text(draw, "R E C E N T  R E A D I N G S", f_section, mini_y, SILVER_DIM)

    mini_y += 22
    mini_cards = [(48, 58), (100, 58), (152, 58), (204, 58), (256, 58)]
    for mx, mw in [(60, 40), (108, 40), (156, 40), (204, 40), (252, 40)]:
        mh = 62
        my = mini_y
        draw.rectangle([mx, my, mx + mw, my + mh], fill=(5, 5, 5, 255))
        draw.rectangle([mx, my, mx + mw, my + mh], outline=(55, 55, 55, 200), width=1)
        # tiny cross in mini card
        mmcx = mx + mw // 2
        mmcy = my + mh // 2
        draw.line([(mmcx - 8, mmcy), (mmcx + 8, mmcy)], fill=(50, 50, 50, 150), width=1)
        draw.line([(mmcx, mmcy - 12), (mmcx, mmcy + 12)], fill=(50, 50, 50, 150), width=1)

    # ── Bottom nav ──
    nav_y = H - 72
    draw.line([(0, nav_y), (W, nav_y)], fill=(40, 40, 40, 200), width=1)
    draw.rectangle([0, nav_y, W, H], fill=(0, 0, 0, 240))

    nav_items = [("□", "Cards"), ("◯", "Spread"), ("◇", "Journal"), ("△", "Profile")]
    nav_xs = [47, 125, 250, 328]
    f_nav = load_font("Jura-Light.ttf", 16)
    f_nav_label = load_font("InstrumentSans-Regular.ttf", 8)

    for i, ((icon, label), nx) in enumerate(zip(nav_items, nav_xs)):
        col = (200, 200, 200, 255) if i == 1 else (70, 70, 70, 200)
        bbox = draw.textbbox((0, 0), icon, font=f_nav)
        iw = bbox[2] - bbox[0]
        draw.text((nx - iw // 2, nav_y + 10), icon, font=f_nav, fill=col)
        bbox2 = draw.textbbox((0, 0), label, font=f_nav_label)
        lw = bbox2[2] - bbox2[0]
        draw.text((nx - lw // 2, nav_y + 36), label, font=f_nav_label, fill=col)

    # Active underline
    draw.line([(nav_xs[1] - 10, nav_y + 54), (nav_xs[1] + 10, nav_y + 54)],
              fill=(200, 200, 200, 200), width=1)

    img = img.convert("RGB")
    img.save(f"{OUT_DIR}\\style3-dark-minimal.png", "PNG", dpi=(144, 144))
    print("Saved style3-dark-minimal.png")


if __name__ == "__main__":
    make_midnight_mystic()
    make_cosmic_purple()
    make_dark_minimal()
    print("All 3 mockups generated.")
