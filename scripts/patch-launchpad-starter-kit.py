#!/usr/bin/env python3
"""Create a guarded, reproducible reader-clarity patch; never publish a PDF.

Extract the October 24 baseline as documented in docs/launchpad-business/README.md,
then run from the repository root with explicit paths:
  python scripts/patch-launchpad-starter-kit.py \
    --input tmp/pdfs/issue27/baseline/starter-kit-baseline.pdf \
    --output tmp/pdfs/issue27/starter-kit-reader-clarity.pdf

Add --ascii-safe for an optional 7-bit transport serialization of the same patch.
The normal binary PDF is preferred when direct file upload is available. Both
variants remain static, untagged PDFs; this is not recovery of the editable master.

Tested dependency: pypdf 6.21.4. Metadata uses a fixed patch revision date so
rebuilding the same revision with this version is deterministic. Selected original
BT..ET text blocks are replaced, not covered by opaque overlays; embedded original
fonts and all other drawing/text operations are retained.
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
    ContentStream,
    EncodedStreamObject,
    FloatObject,
    IndirectObject,
    NameObject,
    NullObject,
    StreamObject,
    TextStringObject,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
STAGING_ROOT = REPOSITORY_ROOT / "tmp" / "pdfs" / "issue27"
BASELINE_SHA256 = "b0d245586b9de17d4b77ad42a14e398f4123082f2266e5f69511a7dabf45e06e"
PATCH_REVISION = "reader-clarity-v4"
PATCH_DATE = "D:20261117090000+08'00'"
EDITION = "20261117b"
PAGE_SIZE = (595.2756, 841.8898)
HELP_URL = "https://remote-mom.vercel.app/launchpad/#help"
LINKEDIN_URL = "https://www.linkedin.com/jobs/"
JOBSTREET_URL = "https://ph.jobstreet.com/Remote-jobs/part-time"
# The first baseline and horizontal origin of every replacement are inherited
# from its exact original text block. Additional lines use explicit offsets.
# Each tuple is (text, offset_below_first_baseline, font_name, point_size, URI).
REGULAR = "/F4+0"
BOLD = "/F5+0"
HEADING = "/F3+0"


def row(text: str, offset: float, font: str = REGULAR, size: float = 10.5,
        uri: str | None = None) -> tuple:
    return (text, offset, font, size, uri)


# Exact source strings are a second guard in addition to the whole-file hash.
# Page numbers are human-readable (one-based). No other blocks are changed.
REPLACEMENTS = {
    2: [
        {
            "old": ("Choose the path that matches your current", "stage"),
            "width": 475.8898,
            "rows": [row("Choose the path that matches your current", 0, HEADING, 25),
                     row("goal", 29, HEADING, 25)],
        },
        {
            "old": (
                "Use the Career Path if you are looking for remote work or returning after a career break. Use the",
                "Remote-Life Path if you already work remotely and want calmer boundaries and routines. Complete",
                "only the worksheets that support your next step.",
            ),
            "width": 475.8898,
            "rows": [
                row("Use either or both paths for your next goal. Already working remotely and seeking another", 0),
                row("part-time role? Use the Career Path. For calmer boundaries and routines, use the Remote-Life Path.", 15),
                row("Complete only the worksheets that help you now; you can switch paths as your goals change.", 30),
            ],
        },
        {
            "old": ("You are looking for remote work or", "returning after a break."),
            "width": 163.748,
            "rows": [row("You want your first, next, or", 0),
                     row("additional part-time remote role,", 13),
                     row("including after a career break.", 26)],
        },
        {
            "old": ("You are still deciding what kind of", "work and routine would fit."),
            "width": 163.748,
            "rows": [row("You want to explore roles and", 0),
                     row("improve your routine; goals", 13),
                     row("can overlap.", 26)],
        },
        {
            "old": ("Start with life fit, then choose one", "exercise from each path"),
            "width": 188.929,
            "rows": [row("Start with life fit, then use the", 0),
                     row("exercises that match your goals", 13)],
        },
    ],
    3: [{
        "old": (
            "Do not describe a role as a good fit merely because it is remote. Check the hours, meeting",
            "expectations, employment type, benefits, equipment requirements, and return-to-office",
            "policy.",
        ),
        "width": 475.8898,
        "rows": [
            row("Use your answers next", 0, BOLD, 11),
            row("Mark your must-have hours and conditions. Use pages 4-5 to choose a role, then page 6 to search.", 18),
            row("For one listing, compare location, hours, meetings, employment type, benefits, equipment,", 33),
            row("and return-to-office expectations with your answers. Note what fits, what does not,", 48),
            row("and what you need to ask. Use pages 6-7 to verify the opportunity before applying.", 63),
        ],
    }],
    6: [{
        "old": (
            "Choose two or three sources that fit your role. Possible sources include official company career",
            "pages, LinkedIn, Indeed, reputable remote-work marketplaces, established staffing companies,",
            "professional communities, and referrals.",
        ),
        "width": 475.8898,
        "rows": [
            row('Search your role + "part-time remote" + your country. Verify each listing.', 0),
            row("LinkedIn Jobs: " + LINKEDIN_URL, 15, uri=LINKEDIN_URL),
            row("JobStreet Philippines: " + JOBSTREET_URL, 30, uri=JOBSTREET_URL),
        ],
    }],
    9: [{
        "old": (
            "Choose either the Career Path or the Remote-Life Path each day. This plan assumes about 30",
            "focused minutes a day; adjust it to your circumstances.",
        ),
        "width": 475.8898,
        "rows": [
            row("Keep all useful actions from either path; start with one. Plan about 30 minutes a day,", 0),
            row("adjust the order and pace to your week, and skip actions or review questions that do not apply.", 15),
        ],
    }],
    10: [
        {
            "old": ("Keep a record of where you applied, what you sent, and when to follow up.",),
            "width": 475.8898,
            "rows": [row("Optional: record applications from page 9 here. This tracker is not an automatic result.", 0)],
        },
        {
            "old": ("Your next step",),
            "width": 475.8898,
            "rows": [
                row("After your seven-day plan", 0, BOLD, 11),
                row("Page 9 is your action plan. Use this optional tracker for applications you make.", 20),
                row("For remote-life actions, record what happened on page 9 or in your own notes.", 35),
                row("You do not submit your answers, and this kit does not generate an automatic result.", 50),
                row("Need help with a step?", 72, BOLD, 11),
                row("Tell Vanessa the page number and the instruction that felt unclear.", 88),
                row("Help: " + HELP_URL, 103, uri=HELP_URL),
                row("Edition: " + EDITION, 163, size=10),
            ],
        },
        {
            "old": (
                "Remote Mom's Launchpad is being shaped to help working mothers and career-returning moms",
                "choose a realistic remote-career direction, make remote work more sustainable, verify opportunities,",
                "and take one focused next step.",
            ),
            "width": 475.8898,
            "rows": [],
        },
        {
            "old": (
                "Visit the Launchpad page and share the one section where you still need help. Your response will",
                "guide what is built next.",
            ),
            "width": 475.8898,
            "rows": [],
        },
    ],
}


def text_lines(block: list) -> tuple[str, ...]:
    """Read the baseline's individual Tj lines; reject unexpected text syntax."""
    if any(op in (b"TJ", b"'", b'"') for _, op in block):
        raise ValueError("Baseline text syntax changed; do not guess a replacement")
    return tuple(str(args[0]) for args, op in block if op == b"Tj")


def font_width(page, value: str, name: str, size: float) -> float:
    font = page["/Resources"]["/Font"][name].get_object()
    start, end = int(font["/FirstChar"]), int(font["/LastChar"])
    if any(not start <= ord(char) <= end or ord(char) > 126 for char in value):
        raise ValueError("Replacement must use the reviewed embedded ASCII glyphs")
    return sum(float(font["/Widths"][ord(char) - start]) for char in value) * size / 1000


def numbers(values: tuple | list) -> list:
    return [FloatObject(value) for value in values]


def replace_page_text(page, pdf, page_number: int) -> tuple[ContentStream, list[dict]]:
    """Replace exact original BT..ET blocks while retaining other operations.

    The baseline uses only translation matrices around these blocks. Guard that
    assumption so URL annotation rectangles stay tied to actual text positions.
    """
    stream = ContentStream(page.get_contents(), pdf)
    output, links = [], []
    matrix = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]
    stack = []
    expected = {item["old"]: item for item in REPLACEMENTS[page_number]}
    seen = set()
    index = 0
    while index < len(stream.operations):
        args, operator = stream.operations[index]
        if operator == b"q":
            stack.append(matrix.copy())
        elif operator == b"Q":
            matrix = stack.pop()
        elif operator == b"cm":
            values = list(map(float, args))
            if values[:4] != [1.0, 0.0, 0.0, 1.0]:
                raise ValueError("Unexpected baseline transform; do not infer link coordinates")
            matrix[4] += values[4]
            matrix[5] += values[5]
        if operator != b"BT":
            output.append((args, operator))
            index += 1
            continue
        end = index + 1
        while end < len(stream.operations) and stream.operations[end][1] != b"ET":
            end += 1
        if end == len(stream.operations):
            raise ValueError("Unterminated baseline text block")
        block = stream.operations[index:end + 1]
        key = text_lines(block)
        replacement = expected.get(key)
        if replacement is None:
            output.extend(block)
        else:
            if key in seen:
                raise ValueError("Ambiguous repeated text block")
            seen.add(key)
            positions = [a for a, o in block if o == b"Tm"]
            if len(positions) != 1 or list(map(float, positions[0][:4])) != [1, 0, 0, 1]:
                raise ValueError("Unexpected baseline text position")
            origin_x, origin_y = map(float, positions[0][4:])
            underlines = []
            if replacement["rows"]:
                output.append(([], b"BT"))
            for value, offset, font, size, uri in replacement["rows"]:
                if size < 10:
                    raise ValueError("Replacement body text must not shrink below 10 points")
                width = font_width(page, value, font, size)
                if width > replacement["width"] + 0.01:
                    raise ValueError(f"Replacement exceeds its reviewed width: {value}")
                y = origin_y - offset
                output.extend([
                    (numbers([1, 0, 0, 1, origin_x, y]), b"Tm"),
                    ([NameObject(font), FloatObject(size)], b"Tf"),
                    ([TextStringObject(value)], b"Tj"),
                ])
                if uri:
                    if value.count(uri) != 1:
                        raise ValueError("Visible link must contain its exact URL once")
                    prefix = value[:value.index(uri)]
                    x = origin_x + font_width(page, prefix, font, size)
                    url_width = font_width(page, uri, font, size)
                    absolute_x, absolute_y = matrix[4] + x, matrix[5] + y
                    links.append({
                        "page": page_number,
                        "uri": uri,
                        "rect": (absolute_x - 0.5, absolute_y - 3,
                                 absolute_x + url_width + 0.5, absolute_y + size + 1),
                    })
                    underlines.append((x, y - 1.2, x + url_width))
            if replacement["rows"]:
                output.append(([], b"ET"))
            if underlines:
                output.extend([([], b"q"), (numbers([0.4]), b"w"),
                               (numbers([23 / 255, 61 / 255, 50 / 255]), b"RG")])
                for x1, y, x2 in underlines:
                    output.extend([(numbers([x1, y]), b"m"), (numbers([x2, y]), b"l"), ([], b"S")])
                output.append(([], b"Q"))
        index = end + 1
    if seen != set(expected):
        raise ValueError(f"Page {page_number} is missing an exact target text block")
    stream.operations = output
    return stream, links


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
        page_number = index + 1
        if page_number in REPLACEMENTS:
            expected_stream, _ = replace_page_text(old_page, source, page_number)
            if ContentStream(new_page.get_contents(), candidate).get_data() != expected_stream.get_data():
                raise ValueError(f"Page {page_number} contains changes outside the exact text replacements")
        elif new_page.get_contents().get_data() != old_page.get_contents().get_data():
            raise ValueError(f"Unaffected page {page_number} content changed")
        expected_links = [link for link in links if link["page"] == page_number]
        annotations = new_page.get("/Annots", [])
        if len(annotations) != len(expected_links):
            raise ValueError(f"Unexpected link count on page {page_number}")
        page_text = new_page.extract_text()
        for annotation_ref, expected in zip(annotations, expected_links):
            annotation = annotation_ref.get_object()
            action = annotation.get("/A", {})
            rectangle = tuple(float(value) for value in annotation["/Rect"])
            if (
                annotation.get("/Subtype") != "/Link"
                or action.get("/S") != "/URI"
                or action.get("/URI") != expected["uri"]
                or expected["uri"] not in page_text
                or any(abs(actual - wanted) > 0.001 for actual, wanted in zip(rectangle, expected["rect"]))
                or not (56 <= rectangle[0] < rectangle[2] <= 539)
                or not (55 <= rectangle[1] < rectangle[3] <= 730)
            ):
                raise ValueError(f"A page-{page_number} visible URL, URI action, or rectangle is incorrect")
    final_text = candidate.pages[9].extract_text()
    if "Visit the Launchpad page" in final_text or "Your next step" in final_text:
        raise ValueError("Superseded closing instructions must be removed, not covered")
    if "Edition: " + EDITION not in final_text:
        raise ValueError("Current edition must be visible in the PDF")
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
    links = []
    for page_number in REPLACEMENTS:
        page = writer.pages[page_number - 1]
        content, page_links = replace_page_text(page, writer, page_number)
        page.replace_contents(content)
        links.extend(page_links)
    for link in links:
        writer.add_annotation(page_number=link["page"] - 1, annotation=Link(rect=link["rect"], url=link["uri"]))
    writer._root_object[NameObject("/Lang")] = TextStringObject("en")
    writer.add_metadata({
        "/ModDate": PATCH_DATE,
        "/Creator": "scripts/patch-launchpad-starter-kit.py (" + PATCH_REVISION + ")",
        "/Producer": "pypdf " + pypdf.__version__ + "; original embedded fonts retained",
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
        "patched_pages": list(REPLACEMENTS),
        "unchanged_pages": [1, 4, 5, 7, 8],
        "edition": EDITION,
        "links": links,
        "language": "en",
        "pdf_header": source.pdf_header,
        "pypdf_version": pypdf.__version__,
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
