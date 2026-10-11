import os
import base64
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont

# Source image provided by user
src_path = r"C:\Users\bhara\.gemini\antigravity\brain\10ef83bd-1df7-48ca-b506-deb3a0ae3bce\.user_uploaded\media_1791708546808_7a9a960a.jpg"
public_dir = r"c:\SCHOOL\public"
artifacts_dir = r"C:\Users\bhara\.gemini\antigravity\brain\10ef83bd-1df7-48ca-b506-deb3a0ae3bce"

img = Image.open(src_path)
arr = np.array(img).astype(np.float32)

max_c = arr.max(axis=2)

# Smooth step between 2.5 and 26.0 for clean alpha matte
low = 2.5
high = 26.0
t = np.clip((max_c - low) / (high - low), 0.0, 1.0)
alpha = t * t * (3.0 - 2.0 * t)

# Edge unpremultiplication to prevent dark fringe
rgb = arr.copy()
fringe = (alpha > 0.02) & (alpha < 0.98)
denom = np.maximum(alpha, 0.10)
for c in range(3):
    rgb[:, :, c] = np.where(fringe, np.clip(arr[:, :, c] / denom, 0.0, 255.0), arr[:, :, c])

rgba = np.dstack([rgb, (alpha * 255.0)]).clip(0, 255).astype(np.uint8)
master_rgba = Image.fromarray(rgba, mode="RGBA")

# Bounding box of visible content
alpha_arr = rgba[:, :, 3]
rows = np.where((alpha_arr > 20).any(axis=1))[0]
cols = np.where((alpha_arr > 20).any(axis=0))[0]

r_min, r_max = rows[0], rows[-1]
c_min, c_max = cols[0], cols[-1]
w = c_max - c_min + 1
h = r_max - r_min + 1

# Crop tight with 1px margin
tight = master_rgba.crop((c_min, r_min, c_max + 1, r_max + 1))

# Square master canvas with ~5% optical padding (letter occupies ~90% of canvas)
canvas_dim = int(max(w, h) / 0.90)
master_square = Image.new("RGBA", (canvas_dim, canvas_dim), (0, 0, 0, 0))

offset_x = (canvas_dim - w) // 2
offset_y = (canvas_dim - h) // 2
master_square.paste(tight, (offset_x, offset_y), tight)

# Save master transparent R image
master_path = os.path.join(public_dir, "images", "rainbow-r-logo.png")
os.makedirs(os.path.dirname(master_path), exist_ok=True)
master_square.save(master_path, format="PNG", optimize=True)

# Helper function to generate sharp, scaled icons
def generate_icon(size):
    resized = master_square.resize((size, size), Image.Resampling.LANCZOS)
    if size <= 32:
        resized = resized.filter(ImageFilter.UnsharpMask(radius=0.8, percent=130, threshold=3))
    elif size <= 48:
        resized = resized.filter(ImageFilter.UnsharpMask(radius=0.8, percent=115, threshold=3))
    return resized

icon_16 = generate_icon(16)
icon_32 = generate_icon(32)
icon_48 = generate_icon(48)
icon_180 = generate_icon(180)
icon_192 = generate_icon(192)
icon_512 = generate_icon(512)

# Save PNG sizes in public
icon_16.save(os.path.join(public_dir, "favicon-16x16.png"), format="PNG", optimize=True)
icon_32.save(os.path.join(public_dir, "favicon-32x32.png"), format="PNG", optimize=True)
icon_48.save(os.path.join(public_dir, "favicon-48x48.png"), format="PNG", optimize=True)
icon_180.save(os.path.join(public_dir, "apple-touch-icon.png"), format="PNG", optimize=True)
icon_192.save(os.path.join(public_dir, "favicon.png"), format="PNG", optimize=True)
icon_512.save(os.path.join(public_dir, "favicon-512x512.png"), format="PNG", optimize=True)

# Save multi-resolution ICO
icon_32.save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)]
)

# Generate favicon.svg embedding 512x512 transparent PNG
import io
buffer = io.BytesIO()
icon_512.save(buffer, format="PNG", optimize=True)
b64_png = base64.b64encode(buffer.getvalue()).decode("ascii")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <title>Rainbow Digi School Logo</title>
  <image href="data:image/png;base64,{b64_png}" width="512" height="512" />
</svg>
'''
with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Generated all production icons in public/ successfully.")

# Create comprehensive preview artifact for the user
# 1. Tab Preview
canvas_tab = Image.new("RGBA", (720, 240), (235, 237, 240, 255))
draw = ImageDraw.Draw(canvas_tab)
try:
    font = ImageFont.truetype("arial.ttf", 13)
    font_bold = ImageFont.truetype("arialbd.ttf", 14)
except:
    font = ImageFont.load_default()
    font_bold = font

# Light Tab
draw.rectangle([20, 20, 700, 105], fill=(240, 243, 246, 255))
draw.rounded_rectangle([30, 30, 340, 105], radius=8, fill=(255, 255, 255, 255))
canvas_tab.paste(icon_16, (44, 52), icon_16)
draw.text((70, 52), "Rainbow Digi School, Kandlakoya", fill=(32, 33, 36, 255), font=font)
draw.text((315, 52), "✕", fill=(95, 99, 104, 255), font=font)
draw.text((360, 52), "Light Browser Tab (16x16)", fill=(80, 80, 80, 255), font=font_bold)

# Dark Tab
draw.rectangle([20, 125, 700, 210], fill=(32, 33, 36, 255))
draw.rounded_rectangle([30, 135, 340, 210], radius=8, fill=(53, 54, 58, 255))
canvas_tab.paste(icon_16, (44, 157), icon_16)
draw.text((70, 157), "Rainbow Digi School, Kandlakoya", fill=(241, 243, 244, 255), font=font)
draw.text((315, 157), "✕", fill=(180, 185, 190, 255), font=font)
draw.text((360, 157), "Dark Browser Tab (16x16)", fill=(210, 210, 210, 255), font=font_bold)

tab_preview_path = os.path.join(artifacts_dir, "favicon-tab-preview.png")
canvas_tab.save(tab_preview_path)

# 2. Multi-size Comparison Preview (16, 32, 48, 180 on cream background)
grid_w = 640
grid_h = 280
grid_img = Image.new("RGBA", (grid_w, grid_h), (247, 241, 230, 255))
grid_draw = ImageDraw.Draw(grid_img)

# Paste 180x180
grid_img.paste(icon_180, (40, 50), icon_180)
grid_draw.text((40, 240), "180x180 (Apple Touch)", fill=(50, 40, 30, 255), font=font_bold)

# Paste 48x48
grid_img.paste(icon_48, (280, 116), icon_48)
grid_draw.text((280, 180), "48x48", fill=(50, 40, 30, 255), font=font_bold)

# Paste 32x32
grid_img.paste(icon_32, (380, 132), icon_32)
grid_draw.text((380, 180), "32x32", fill=(50, 40, 30, 255), font=font_bold)

# Paste 16x16
grid_img.paste(icon_16, (470, 148), icon_16)
grid_draw.text((470, 180), "16x16", fill=(50, 40, 30, 255), font=font_bold)

sizes_preview_path = os.path.join(artifacts_dir, "favicon-sizes-preview.png")
grid_img.save(sizes_preview_path)

print("Saved preview images in artifacts.")
