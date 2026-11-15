#!/usr/bin/env python3
"""Create a guarded, reproducible page-10 link patch; never publish a PDF.

Extract the October 24 baseline as documented in docs/launchpad-business/README.md,
then run from the repository root with explicit paths:
  python scripts/patch-launchpad-starter-kit.py \
    --input tmp/pdfs/issue27/baseline/starter-kit-baseline.pdf \
    --output tmp/pdfs/issue27/starter-kit-useful-next-step.pdf

Add --ascii-safe for an optional 7-bit transport serialization of the same patch.
The normal binary PDF is preferred when direct file upload is available. Both
variants remain static, untagged PDFs; this is not recovery of the editable master.

Tested dependencies: pypdf 6.21.4 and ReportLab 4.4.9. Metadata uses a fixed patch
revision date so rebuilding the same revision with these versions is deterministic.
Render and review the staging candidate before any separately approved release.
"""

from __future__ import annotations

import argparse
import binascii
from collections import Counter
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path

import pypdf
from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Link
from pypdf.generic import (
    ArrayObject,
    EncodedStreamObject,
    IndirectObject,
    NameObject,
    NullObject,
    StreamObject,
    TextStringObject,
)
import reportlab
from reportlab.lib.colors import HexColor
from reportlab.pdfgen.canvas import Canvas


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
STAGING_ROOT = REPOSITORY_ROOT / "tmp" / "pdfs" / "issue27"
BASELINE_SHA256 = "b0d245586b9de17d4b77ad42a14e398f4123082f2266e5f69511a7dabf45e06e"
PATCH_REVISION = "next-step-v2"
PATCH_DATE = "D:20261116060000+08'00'"
PAGE_SIZE = (595.2756, 841.8898)
# PDF coordinates use the bottom-left origin. The original closing paragraph ends
# above y=131.93; the existing footer line/text is below this reviewed blank band.
PATCH_BOUNDS = (56.69291, 54.0, 538.58271, 122.0)
TEXT_X = 62.69291
BETA_URL = "https://remote-mom.vercel.app/beta/"
HELP_URL = "https://remote-mom.vercel.app/launchpad/#help"


def overlay(source: PdfReader) -> tuple[PdfReader, list[dict]]:
    # The guarded baseline embeds Arial with the full printable-ASCII mapping.
    # Reuse those original font objects and widths so the new block does not
    # depend on a viewer's substitute for unembedded standard Helvetica fonts.
    original_fonts = source.pages[9]["/Resources"]["/Font"]
    regular_font = original_fonts["/F4+0"].get_object()

    def width(value: str, size: float = 10) -> float:
        first_char = int(regular_font["/FirstChar"])
        return sum(float(regular_font["/Widths"][ord(char) - first_char]) for char in value) * size / 1000

    buffer = BytesIO()
    canvas = Canvas(buffer, pagesize=PAGE_SIZE, invariant=1, pageCompression=1)
    canvas.setStrokeColor(HexColor("#b1c4aa"))
    canvas.setLineWidth(0.4)
    canvas.line(PATCH_BOUNDS[0], 122, PATCH_BOUNDS[2], 122)
    canvas.setFillColor(HexColor("#173d32"))
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(TEXT_X, 108, "Choose your next step")
    canvas.setFont("Helvetica", 10)
    canvas.drawString(TEXT_X, 92, "Choose one Career or Remote-Life action from page 9.")

    links = []
    for label, url, baseline in (
        ("Optional Android beta interest: ", BETA_URL, 76),
        ("Help or feedback: ", HELP_URL, 60),
    ):
        canvas.setFont("Helvetica", 10)
        canvas.drawString(TEXT_X, baseline, label)
        url_x = TEXT_X + width(label)
        url_width = width(url)
        canvas.drawString(url_x, baseline, url)
        canvas.setStrokeColor(HexColor("#173d32"))
        canvas.line(url_x, baseline - 1.2, url_x + url_width, baseline - 1.2)
        links.append({
            "uri": url,
            "rect": (url_x - 0.5, baseline - 2, url_x + url_width + 0.5, baseline + 11),
        })

    canvas.showPage()
    canvas.save()
    reader = PdfReader(BytesIO(buffer.getvalue()))
    fonts = reader.pages[0]["/Resources"]["/Font"]
    fonts[NameObject("/F1")] = original_fonts.raw_get("/F4+0")
    fonts[NameObject("/F2")] = original_fonts.raw_get("/F5+0")
    return reader, links


def assert_patch(source: PdfReader, candidate: PdfReader, links: list[dict]) -> None:
    if candidate.pdf_header != source.pdf_header:
        raise ValueError("Candidate must retain the reviewed baseline PDF version")
    if len(candidate.pages) != 10 or candidate.trailer["/Root"].get("/Lang") != "en":
        raise ValueError("Candidate must retain ten pages and declare English document language")
    for index, (old_page, new_page) in enumerate(zip(source.pages, candidate.pages)):
        for box in ("mediabox", "cropbox"):
            if tuple(getattr(old_page, box)) != tuple(getattr(new_page, box)):
                raise ValueError(f"Page {index + 1} geometry changed")
        if old_page.get("/Rotate", 0) != new_page.get("/Rotate", 0):
            raise ValueError(f"Page {index + 1} rotation changed")
        old_text = (old_page.extract_text() or "").split()
        new_text = (new_page.extract_text() or "").split()
        if new_text[:len(old_text)] != old_text:
            raise ValueError(f"Original page {index + 1} text was not preserved")
        if index < 9 and (
            new_text != old_text
            or new_page.get_contents().get_data() != old_page.get_contents().get_data()
        ):
            raise ValueError(f"Page {index + 1} content changed")

    annotations = candidate.pages[9].get("/Annots", [])
    if len(annotations) != 2:
        raise ValueError("Expected exactly two page-10 link annotations")
    last_text = candidate.pages[9].extract_text()
    for annotation_ref, expected in zip(annotations, links):
        annotation = annotation_ref.get_object()
        action = annotation.get("/A", {})
        rectangle = tuple(float(value) for value in annotation["/Rect"])
        if (
            annotation.get("/Subtype") != "/Link"
            or action.get("/S") != "/URI"
            or action.get("/URI") != expected["uri"]
            or expected["uri"] not in last_text
            or any(abs(actual - wanted) > 0.001 for actual, wanted in zip(rectangle, expected["rect"]))
            or not (PATCH_BOUNDS[0] <= rectangle[0] < rectangle[2] <= PATCH_BOUNDS[2])
            or not (PATCH_BOUNDS[1] <= rectangle[1] < rectangle[3] <= PATCH_BOUNDS[3])
        ):
            raise ValueError("A page-10 visible URL, URI action, or rectangle is incorrect")
    root = candidate.trailer["/Root"]
    if root.get("/StructTreeRoot") or candidate.get_fields():
        raise ValueError("The patch must not claim new structure tags or interactive form fields")


def decoded_stream_fingerprints(reader: PdfReader) -> Counter:
    """Cover every written stream, including unreferenced original stream objects."""
    fingerprints = Counter()
    for generation, objects in reader.xref.items():
        if generation == 65535:
            continue
        for number in objects:
            if number == 0:
                continue
            obj = reader.get_object(IndirectObject(number, generation, reader))
            if isinstance(obj, StreamObject):
                data = obj.get_data()
                fingerprints[(len(data), sha256(data).hexdigest())] += 1
    return fingerprints


class AsciiHeaderBuffer(BytesIO):
    """Adapt only pypdf's known, nonsemantic binary header comment while writing.

    Object serialization and all stream lengths/xref offsets remain pypdf's job.
    The replacement is the same length and cannot match a stream or object body.
    """

    def __init__(self, header_length: int):
        super().__init__()
        self.header_length = header_length
        self.header_adapted = False

    def write(self, data: bytes) -> int:
        if self.tell() == self.header_length and data == b"%\xe2\xe3\xcf\xd3\n":
            data = b"%ASCI\n"
            self.header_adapted = True
        return super().write(data)


def ascii_safe_bytes(writer: PdfWriter, normal_bytes: bytes) -> tuple[bytes, int]:
    """Add a standard outer ASCIIHexDecode filter; do not reinterpret stream data.

    pypdf exposes raw encoded stream bytes as _data and writer objects as _objects.
    Keeping the prior filters and aligned DecodeParms preserves fonts/content and
    avoids recompression or regex rewriting of an already serialized PDF.
    """
    stream_count = 0
    for obj in writer._objects:
        if not isinstance(obj, StreamObject):
            continue
        if "/F" in obj:
            raise ValueError("External-file streams are unsupported by ASCII transport")
        old_filter = obj.get("/Filter")
        if old_filter is not None:
            old_filter = old_filter.get_object()
        old_filters = list(old_filter) if isinstance(old_filter, ArrayObject) else (
            [old_filter] if old_filter is not None else []
        )
        if "/DecodeParms" in obj:
            parameters = obj["/DecodeParms"]
            if isinstance(parameters, ArrayObject):
                old_parameters = list(parameters)
            elif len(old_filters) == 1:
                old_parameters = [parameters]
            elif isinstance(parameters, NullObject):
                old_parameters = [NullObject() for _ in old_filters]
            else:
                raise ValueError("Unexpected filter parameters; do not guess a transport encoding")
            if len(old_parameters) != len(old_filters):
                raise ValueError("Filter parameter count is inconsistent")
            obj[NameObject("/DecodeParms")] = ArrayObject([NullObject(), *old_parameters])
        raw_bytes = obj._data
        # Call the base setter: EncodedStreamObject.set_data assumes recompression
        # with FlateDecode, which would be incorrect for this outer-filter wrapper.
        StreamObject.set_data(obj, binascii.hexlify(raw_bytes) + b">")
        obj[NameObject("/Filter")] = ArrayObject([NameObject("/ASCIIHexDecode"), *old_filters])
        if isinstance(obj, EncodedStreamObject):
            obj.decoded_self = None
        stream_count += 1

    writer.generate_file_identifiers()
    buffer = AsciiHeaderBuffer(len(writer.pdf_header.encode()) + 1)
    writer.write(buffer)
    data = buffer.getvalue()
    if not buffer.header_adapted or any(byte not in (9, 10) and not 32 <= byte <= 126 for byte in data):
        raise ValueError("ASCII transport must contain only printable 7-bit ASCII, LF, or TAB")
    original = PdfReader(BytesIO(normal_bytes), strict=True)
    candidate = PdfReader(BytesIO(data), strict=True)
    if decoded_stream_fingerprints(original) != decoded_stream_fingerprints(candidate):
        raise ValueError("ASCII transport changed a decoded stream")
    return data, stream_count


def build(input_path: Path, output_path: Path, ascii_safe: bool) -> dict:
    input_path = input_path.resolve(strict=True)
    output_path = output_path.resolve()
    if STAGING_ROOT.resolve() != STAGING_ROOT:
        raise ValueError("The staging directory and its parents must not be redirected by symlinks")
    if input_path == output_path or not output_path.is_relative_to(STAGING_ROOT):
        raise ValueError("Output must be a separate file inside tmp/pdfs/issue27; publishing is not supported")
    if output_path.suffix.lower() != ".pdf" or output_path.exists():
        raise ValueError("Choose a new .pdf staging output; existing files are never overwritten")
    source_bytes = input_path.read_bytes()
    if sha256(source_bytes).hexdigest() != BASELINE_SHA256:
        raise ValueError("Input does not match the reviewed published baseline SHA-256")
    source = PdfReader(BytesIO(source_bytes), strict=True)
    if len(source.pages) != 10:
        raise ValueError("Expected the reviewed ten-page baseline")

    writer = PdfWriter(clone_from=source)
    writer.pdf_header = source.pdf_header
    overlay_reader, links = overlay(source)
    writer.pages[9].merge_page(overlay_reader.pages[0], over=True, expand=False)
    for link in links:
        writer.add_annotation(page_number=9, annotation=Link(rect=link["rect"], url=link["uri"]))
    writer._root_object[NameObject("/Lang")] = TextStringObject("en")
    writer.add_metadata({
        "/ModDate": PATCH_DATE,
        "/Creator": "scripts/patch-launchpad-starter-kit.py (" + PATCH_REVISION + ")",
        "/Producer": "pypdf " + pypdf.__version__ + "; ReportLab " + reportlab.Version,
    })
    writer.generate_file_identifiers()
    buffer = BytesIO()
    writer.write(buffer)
    normal_bytes = buffer.getvalue()
    assert_patch(source, PdfReader(BytesIO(normal_bytes), strict=True), links)
    data, wrapped_streams = ascii_safe_bytes(writer, normal_bytes) if ascii_safe else (normal_bytes, 0)
    assert_patch(source, PdfReader(BytesIO(data), strict=True), links)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("xb") as output:
        output.write(data)
    return {
        "revision": PATCH_REVISION,
        "input": str(input_path),
        "input_sha256": BASELINE_SHA256,
        "output": str(output_path),
        "output_bytes": len(data),
        "output_sha256": sha256(data).hexdigest(),
        "normal_binary_sha256": sha256(normal_bytes).hexdigest(),
        "ascii_safe": ascii_safe,
        "wrapped_streams": wrapped_streams,
        "page_count": 10,
        "patched_page": 10,
        "patch_bounds_bottom_left_points": PATCH_BOUNDS,
        "links": links,
        "language": "en",
        "pdf_header": source.pdf_header,
        "pypdf_version": pypdf.__version__,
        "reportlab_version": reportlab.Version,
        "limits": "Static, untagged PDF; editable source master not recovered; staging only",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", required=True, type=Path, help="Exact reviewed baseline PDF")
    parser.add_argument("--output", required=True, type=Path, help="New staging PDF inside tmp/pdfs/issue27")
    parser.add_argument("--ascii-safe", action="store_true", help="Optional equivalent 7-bit ASCII transport encoding")
    args = parser.parse_args()
    try:
        result = build(args.input.expanduser().resolve(strict=True), args.output.expanduser().resolve(), args.ascii_safe)
    except (OSError, ValueError, pypdf.errors.PdfReadError) as error:
        parser.exit(1, f"Patch not produced: {error}\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
