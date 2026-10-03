from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "marketing" / "launchpad-social"
WIDTH, HEIGHT = 1080, 1350

BG = "#F3F4EF"
SURFACE = "#E0EADF"
GREEN = "#245C45"
DARK = "#17221D"
MUTED = "#58645E"
AMBER = "#C87B25"
WHITE = "#F8FBF8"

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Avenir Next.ttc",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
]


def font(size, bold=False):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            index = 1 if bold and path.endswith(".ttc") else 0
            return ImageFont.truetype(path, size=size, index=index)
    return ImageFont.load_default()


DISPLAY = font(78, bold=True)
DISPLAY_SMALL = font(66, bold=True)
BODY = font(36)
BODY_BOLD = font(36, bold=True)
SMALL = font(24, bold=True)
CTA = font(28, bold=True)


def wrap_text(draw, text, selected_font, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=selected_font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(draw, text, xy, selected_font, fill, max_width, line_gap=10):
    x, y = xy
    lines = wrap_text(draw, text, selected_font, max_width)
    for line in lines:
        bbox = draw.textbbox((x, y), line, font=selected_font)
        draw.text((x, y), line, font=selected_font, fill=fill)
        y += bbox[3] - bbox[1] + line_gap
    return y


def base_canvas(number, accent=GREEN):
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((56, 50, 1024, 1300), radius=42, fill="#FCFCF8", outline="#CBD4CD", width=2)
    draw.text((92, 84), "REMOTE MOM'S LAUNCHPAD", font=SMALL, fill=accent)
    draw.text((914, 84), f"0{number}", font=SMALL, fill=MUTED)
    return image, draw


def finish(draw, cta):
    draw.rounded_rectangle((92, 1168, 710, 1248), radius=40, fill=GREEN)
    draw.text((126, 1190), cta, font=CTA, fill=WHITE)
    draw.text((92, 1270), "For Filipino moms exploring remote work", font=SMALL, fill=MUTED)


def post_one():
    image, draw = base_canvas(1)
    y = draw_wrapped(draw, "Hindi lahat ng WFH job ay flexible.", (92, 210), DISPLAY, DARK, 840, 8)
    y += 40
    draw.rounded_rectangle((92, y, 988, y + 250), radius=28, fill=SURFACE)
    draw.text((132, y + 38), "REMOTE", font=SMALL, fill=GREEN)
    draw_wrapped(draw, "Where you work", (132, y + 88), BODY_BOLD, DARK, 330)
    draw.line((520, y + 35, 520, y + 215), fill="#A9B7AE", width=3)
    draw.text((570, y + 38), "FLEXIBLE", font=SMALL, fill=AMBER)
    draw_wrapped(draw, "When and how you work", (570, y + 88), BODY_BOLD, DARK, 330)
    draw_wrapped(draw, "Check shifts, meetings, childcare, benefits, and return-to-office expectations.", (92, y + 310), BODY, MUTED, 850, 12)
    finish(draw, "Get the free starter kit")
    return image


def post_two():
    image, draw = base_canvas(2, accent=AMBER)
    y = draw_wrapped(draw, "May nag-message ng easy WFH job?", (92, 210), DISPLAY_SMALL, DARK, 860, 8)
    y += 26
    draw_wrapped(draw, "Check these before sending your information.", (92, y), BODY, MUTED, 820, 10)
    y += 150
    checks = ["Official company website", "Careers page", "Recruiter email domain", "Real duties and hours", "No application payment"]
    for item in checks:
        draw.rounded_rectangle((92, y, 128, y + 36), radius=8, outline=GREEN, width=4)
        draw.text((158, y - 5), item, font=BODY_BOLD, fill=DARK)
        y += 78
    finish(draw, "Save and verify first")
    return image


def post_three():
    image, draw = base_canvas(3)
    y = draw_wrapped(draw, "VA is not the only remote path.", (92, 210), DISPLAY_SMALL, DARK, 860, 8)
    y += 38
    pairs = [
        ("Customer service", "Remote support"),
        ("Scheduling", "Operations support"),
        ("Invoices", "Bookkeeping support"),
        ("Recruiting", "Talent coordination"),
        ("Writing", "Content support"),
    ]
    for left, right in pairs:
        draw.rounded_rectangle((92, y, 450, y + 82), radius=18, fill=SURFACE)
        draw.text((122, y + 22), left, font=SMALL, fill=DARK)
        draw.line((470, y + 41, 535, y + 41), fill=AMBER, width=6)
        draw.rounded_rectangle((555, y, 988, y + 82), radius=18, fill=GREEN)
        draw.text((585, y + 22), right, font=SMALL, fill=WHITE)
        y += 104
    finish(draw, "Start with your real skills")
    return image


def post_four():
    image, draw = base_canvas(4)
    y = draw_wrapped(draw, "Only 30 minutes for your job search?", (92, 210), DISPLAY_SMALL, DARK, 870, 8)
    y += 36
    days = [
        ("MON", "Collect five matching roles"),
        ("TUE", "Find repeated requirements"),
        ("WED", "Improve one resume section"),
        ("THU", "Prepare one work sample"),
        ("FRI", "Verify three opportunities"),
        ("SAT", "Submit one careful application"),
    ]
    for day, task in days:
        draw.text((92, y + 6), day, font=SMALL, fill=GREEN)
        draw.text((225, y), task, font=BODY_BOLD, fill=DARK)
        draw.line((92, y + 62, 988, y + 62), fill="#D9DFDA", width=2)
        y += 82
    finish(draw, "Use the seven-day plan")
    return image


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assets = [
        ("post-01-remote-vs-flexible.png", post_one()),
        ("post-02-verify-before-applying.png", post_two()),
        ("post-03-va-not-only-path.png", post_three()),
        ("post-04-thirty-minute-search.png", post_four()),
    ]
    for filename, image in assets:
        path = OUTPUT / filename
        image.save(path, format="PNG", optimize=True)
        print(path)


if __name__ == "__main__":
    main()
