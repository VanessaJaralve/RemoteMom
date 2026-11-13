"""Protect the published Starter Kit from historical generator output."""

from pathlib import Path
from shutil import copyfile
import subprocess
import sys
import tempfile
import unittest


GENERATOR = Path(__file__).resolve().parents[1] / "scripts" / "build-launchpad-starter-kit.py"
PDF_NAME = "remote-moms-work-fit-safety-starter-kit.pdf"


class StarterKitStagingTests(unittest.TestCase):
    def generate_in(self, root):
        script = root / "scripts" / GENERATOR.name
        script.parent.mkdir()
        copyfile(GENERATOR, script)
        result = subprocess.run(
            [sys.executable, str(script)],
            cwd=root,
            capture_output=True,
            text=True,
            check=True,
        )
        pdf = (root / "output" / "pdf" / PDF_NAME).read_bytes()
        self.assertTrue(pdf.startswith(b"%PDF-"))
        self.assertTrue(pdf.rstrip().endswith(b"%%EOF"))
        self.assertIn(b"/Type /Catalog", pdf)
        self.assertIn(b"/Type /Pages", pdf)
        self.assertIn("Staging only", result.stdout)
        self.assertIn("docs/launchpad-business/README.md", result.stdout)

    def test_preserves_existing_distribution_file(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            published = root / "landing" / "launchpad" / "download" / PDF_NAME
            published.parent.mkdir(parents=True)
            sentinel = b"Published redesign: preserve these exact bytes."
            published.write_bytes(sentinel)

            self.generate_in(root)

            self.assertEqual(published.read_bytes(), sentinel)

    def test_does_not_create_a_distribution_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)

            self.generate_in(root)

            self.assertFalse((root / "landing").exists())


if __name__ == "__main__":
    unittest.main()
