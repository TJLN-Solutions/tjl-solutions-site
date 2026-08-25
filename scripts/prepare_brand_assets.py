"""Prepare lossless web variants from the supplied official raster logo."""

from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "assets" / "brand"
SOURCE = BRAND / "base4-logo-original.png"


def extract_from_white(image: Image.Image) -> Image.Image:
    """Remove the pale backdrop without remapping the logo's original colors."""
    source = image.convert("RGB")
    output = Image.new("RGBA", source.size)
    pixels = []
    for red, green, blue in source.get_flattened_data():
        darkest = min(red, green, blue)
        spread = max(red, green, blue) - darkest
        # The supplied artwork is already antialiased on a very pale backdrop.
        # Keep every opaque logo pixel byte-for-byte so charcoal shading does
        # not collapse to black; fade only light, low-chroma backdrop pixels.
        alpha = 0 if darkest >= 150 and spread <= 72 else 255
        pixels.append((red, green, blue, alpha))
    output.putdata(pixels)
    alpha = output.getchannel("A").filter(ImageFilter.GaussianBlur(0.35))
    output.putalpha(alpha)
    return output


def trim(image: Image.Image, padding: int = 20) -> Image.Image:
    bounds = image.getchannel("A").getbbox()
    if not bounds:
        return image
    left, top, right, bottom = bounds
    return image.crop((max(0, left - padding), max(0, top - padding), min(image.width, right + padding), min(image.height, bottom + padding)))


def contain(image: Image.Image, size: tuple[int, int], background=None, padding=0) -> Image.Image:
    target = Image.new("RGBA", size, background or (0, 0, 0, 0))
    usable = (size[0] - padding * 2, size[1] - padding * 2)
    item = image.copy()
    item.thumbnail(usable, Image.Resampling.LANCZOS)
    target.alpha_composite(item, ((size[0] - item.width) // 2, (size[1] - item.height) // 2))
    return target


def save(image: Image.Image, name: str) -> None:
    image.save(BRAND / name, optimize=True)


def white_wordmark(image: Image.Image) -> Image.Image:
    result = image.copy()
    converted = []
    for red, green, blue, alpha in result.get_flattened_data():
        is_brand_blue = blue > red * 1.25 and blue > green * 1.18
        converted.append((red, green, blue, alpha) if is_brand_blue else (244, 247, 251, alpha))
    result.putdata(converted)
    return result


def main() -> None:
    original = Image.open(SOURCE)
    transparent = extract_from_white(original)
    width, height = transparent.size

    full = trim(transparent, 24)
    symbol = trim(transparent.crop((int(width * .12), int(height * .08), int(width * .89), int(height * .79))), 18)
    wordmark = trim(transparent.crop((int(width * .13), int(height * .805), int(width * .88), int(height * .9))), 12)
    wordmark_dark = white_wordmark(wordmark)

    save(full, "base4-logo-transparent.png")
    save(symbol, "base4-symbol-transparent.png")
    save(wordmark, "base4-wordmark-transparent.png")
    save(wordmark_dark, "base4-wordmark-white.png")
    save(contain(symbol, (512, 512), padding=22), "base4-symbol-512.png")
    save(contain(symbol, (128, 128), padding=8), "base4-favicon.png")
    save(contain(full, (1200, 1200), (247, 249, 252, 255), 80).convert("RGB"), "base4-logo-light.jpg")

    dark_full = Image.new("RGBA", (1200, 1200), (4, 7, 13, 255))
    dark_full.alpha_composite(contain(symbol, (850, 850), padding=35), (175, 70))
    dark_full.alpha_composite(contain(wordmark_dark, (850, 170), padding=12), (175, 955))
    save(dark_full.convert("RGB"), "base4-logo-dark.jpg")

    social = Image.new("RGBA", (1200, 630), (4, 7, 13, 255))
    symbol_social = contain(symbol, (520, 520), padding=28)
    wordmark_social = contain(wordmark_dark, (610, 180), padding=18)
    social.alpha_composite(symbol_social, (42, 55))
    social.alpha_composite(wordmark_social, (540, 225))
    save(social.convert("RGB"), "base4-social.jpg")

    header = Image.new("RGBA", (760, 190), (0, 0, 0, 0))
    header_symbol = contain(symbol, (180, 180), padding=10)
    header_wordmark = contain(wordmark_dark, (565, 150), padding=14)
    header.alpha_composite(header_symbol, (0, 5))
    header.alpha_composite(header_wordmark, (185, 20))
    save(trim(header, 4), "base4-logo-horizontal.png")


if __name__ == "__main__":
    main()
