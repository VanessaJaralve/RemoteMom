from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "pinay-mom-remote-work-fit-safety-starter-kit.pdf"
LANDING_COPY = (
    ROOT
    / "landing"
    / "launchpad"
    / "download"
    / "pinay-mom-remote-work-fit-safety-starter-kit.pdf"
)

GREEN = colors.HexColor("#245C45")
DARK = colors.HexColor("#17221D")
MUTED = colors.HexColor("#58645E")
PALE = colors.HexColor("#E7EFE8")
CREAM = colors.HexColor("#F5F6F1")
LINE = colors.HexColor("#CBD4CD")
AMBER = colors.HexColor("#C87B25")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=GREEN,
        spaceAfter=14,
        uppercase=True,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=31,
        leading=33,
        textColor=DARK,
        alignment=TA_LEFT,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverDeck",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=19,
        textColor=MUTED,
        spaceAfter=20,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=25,
        textColor=DARK,
        spaceBefore=5,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionIntro",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=MUTED,
        spaceAfter=13,
    )
)
styles.add(
    ParagraphStyle(
        name="BodySmall",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=DARK,
    )
)
styles.add(
    ParagraphStyle(
        name="Cell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=DARK,
    )
)
styles.add(
    ParagraphStyle(
        name="CellHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="Callout",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=16,
        textColor=GREEN,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9,
        textColor=MUTED,
    )
)


def p(text, style="Cell"):
    return Paragraph(text, styles[style])


def worksheet_table(headers, rows, widths, row_heights=None):
    data = [[p(item, "CellHeader") for item in headers]]
    data.extend([[p(item) for item in row] for row in rows])
    table = Table(data, colWidths=widths, rowHeights=row_heights, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), GREEN),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def checkbox_lines(items):
    rows = [[p("[ ]", "BodySmall"), p(item, "BodySmall")] for item in items]
    table = Table(rows, colWidths=[9 * mm, 162 * mm])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 14 * mm, 190 * mm, 14 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 9 * mm, "Remote Mom's Launchpad | Philippines")
    canvas.drawRightString(190 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    LANDING_COPY.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title="Pinay Mom's Remote Work Fit and Safety Starter Kit",
        author="RemoteMom",
        subject="Remote career planning and job verification worksheet for Filipino mothers",
    )

    story = []
    story.extend(
        [
            Spacer(1, 18 * mm),
            p("REMOTE MOM'S LAUNCHPAD", "CoverLabel"),
            p("Pinay Mom's Remote Work Fit and Safety Starter Kit", "CoverTitle"),
            p(
                "Choose a remote-work direction that fits your existing skills, your family schedule, and the way you need to work.",
                "CoverDeck",
            ),
            Spacer(1, 10 * mm),
            Table(
                [
                    [p("ROLE FIT", "CellHeader"), p("SCHEDULE FIT", "CellHeader")],
                    [p("TRANSFERABLE SKILLS", "CellHeader"), p("JOB VERIFICATION", "CellHeader")],
                    [p("PRIVACY", "CellHeader"), p("7-DAY PLAN", "CellHeader")],
                ],
                colWidths=[85 * mm, 85 * mm],
                rowHeights=[20 * mm, 20 * mm, 20 * mm],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
                        ("GRID", (0, 0), (-1, -1), 1, colors.HexColor("#86AA98")),
                        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ]
                ),
            ),
            Spacer(1, 13 * mm),
            p(
                "This resource provides general career-organization information. It does not guarantee employment, income, or that a job offer is legitimate.",
                "Footer",
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("1. Start with the life the job must fit", "SectionTitle"),
            p(
                "Remote work can remove a commute, but it does not automatically provide flexible hours, reliable income, childcare, or a manageable day. Write down the conditions your next role must fit.",
                "SectionIntro",
            ),
            worksheet_table(
                ["Question", "Your answer"],
                [
                    ["How many focused work hours can I protect each weekday?", ""],
                    ["Which hours are reliably available?", ""],
                    ["Do I need a fixed shift, flexible schedule, or output-based work?", ""],
                    ["Can I work Philippine night hours for an overseas client?", ""],
                    ["Who will handle childcare during calls or focused work?", ""],
                    ["What happens when my child is sick or school is closed?", ""],
                    ["What is the longest commute I would accept for hybrid work?", ""],
                    ["Which benefits matter: HMO, leave, 13th-month pay, equipment, taxes?", ""],
                    ["What is my minimum sustainable monthly income after work expenses?", ""],
                ],
                [92 * mm, 78 * mm],
                [10 * mm] + [17 * mm] * 9,
            ),
            Spacer(1, 6 * mm),
            p(
                "Do not describe a role as a good fit merely because it is remote. Check the hours, meeting expectations, employment type, benefits, equipment requirements, and return-to-office policy.",
                "Callout",
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("2. Translate your existing experience", "SectionTitle"),
            p(
                "List work you have already done. Include paid roles, business work, volunteering, and substantial projects. Use only skills you can demonstrate honestly.",
                "SectionIntro",
            ),
            worksheet_table(
                ["Previous responsibility", "Skill", "Evidence", "Possible role"],
                [
                    ["Answered customer questions", "Customer communication", "Response time, satisfaction, resolved issues", "Customer support"],
                    ["Organized schedules or records", "Administration and coordination", "Records maintained, appointments handled", "Virtual assistant or operations support"],
                    ["Prepared reports or spreadsheets", "Data organization", "Reports delivered, errors reduced", "Reporting or data support"],
                    ["Managed invoices or expenses", "Basic bookkeeping", "Records reconciled, payments tracked", "Bookkeeping support"],
                    ["Created posts or promotions", "Content support", "Campaigns or portfolio samples", "Marketing support"],
                    ["Your example", "", "", ""],
                    ["Your example", "", "", ""],
                    ["Your example", "", "", ""],
                ],
                [43 * mm, 37 * mm, 47 * mm, 43 * mm],
                [12 * mm] + [19 * mm] * 8,
            ),
            Spacer(1, 7 * mm),
            p(
                "Do not turn ordinary parenting responsibilities into inflated corporate claims. Do recognize the professional experience you already earned.",
                "Callout",
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("3. Choose one primary role direction", "SectionTitle"),
            p("Score each possibility from 0 to 2. Use 0 for not yet true, 1 for partly true, and 2 for clearly true.", "SectionIntro"),
            worksheet_table(
                ["Fit question", "Role A", "Role B", "Role C"],
                [
                    ["I already have relevant experience.", "", "", ""],
                    ["I can show proof through work history or a small portfolio.", "", "", ""],
                    ["The usual schedule fits my family constraints.", "", "", ""],
                    ["I have the required equipment and internet connection.", "", "", ""],
                    ["I understand the typical responsibilities.", "", "", ""],
                    ["I can explain why I fit this role in two sentences.", "", "", ""],
                    ["Total out of 12", "", "", ""],
                ],
                [101 * mm, 23 * mm, 23 * mm, 23 * mm],
                [12 * mm] + [17 * mm] * 7,
            ),
            Spacer(1, 10 * mm),
            worksheet_table(
                ["Decision", "Your answer"],
                [["My primary role direction", ""], ["My backup direction", ""]],
                [70 * mm, 100 * mm],
                [12 * mm, 23 * mm, 23 * mm],
            ),
            Spacer(1, 7 * mm),
            p("Choose one primary direction and one backup. Avoid applying for unrelated roles with one generic resume.", "Callout"),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("4. Focus your search and verify opportunities", "SectionTitle"),
            p(
                "Choose two or three sources that fit your role. Possible sources include official company career pages, LinkedIn, JobStreet, Indeed, Kalibrr, OnlineJobs.ph, Upwork, established outsourcing companies, and referrals.",
                "SectionIntro",
            ),
            worksheet_table(
                ["Search source", "Why it fits my role", "Days I will check"],
                [["", "", ""], ["", "", ""], ["", "", ""]],
                [48 * mm, 83 * mm, 39 * mm],
                [12 * mm, 19 * mm, 19 * mm, 19 * mm],
            ),
            Spacer(1, 7 * mm),
            p("Verification checklist", "Callout"),
            checkbox_lines(
                [
                    "I found the employer's official website independently.",
                    "I checked whether the role appears on the official careers page.",
                    "The recruiter's email domain matches the organization or has a credible explanation.",
                    "The description explains responsibilities, qualifications, hours, and employment type.",
                    "The compensation is plausible for the work and experience requested.",
                    "I searched the company name with terms such as review, scam, and complaint.",
                    "The recruiter did not request payment for an application, interview, equipment release, or placement.",
                    "I have not shared passwords, one-time PINs, full banking credentials, or unnecessary identity documents.",
                    "If overseas recruitment is involved, I checked DMW authorization and job-order requirements.",
                    "I will stop if I am pressured to act before I can verify the offer.",
                ]
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("5. Protect your information", "SectionTitle"),
            p("Before sending a document, ask whether the recipient needs it at this stage.", "SectionIntro"),
            Table(
                [
                    [p("Keep off a public resume", "CellHeader"), p("Keep out of unsolicited messages", "CellHeader")],
                    [
                        p("Full home address<br/>Children's names and schools<br/>Government account numbers<br/>Detailed family health information"),
                        p("Passwords and one-time PINs<br/>Full banking credentials<br/>Identity documents without a clear need<br/>Money for a guaranteed job"),
                    ],
                ],
                colWidths=[85 * mm, 85 * mm],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
                        ("BACKGROUND", (0, 1), (-1, 1), CREAM),
                        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                        ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 9),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                        ("TOPPADDING", (0, 0), (-1, -1), 9),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                    ]
                ),
            ),
            Spacer(1, 10 * mm),
            p("Philippine safety references", "Callout"),
            p("DOLE: car.dole.gov.ph/news/fake-accounts-websites-and-jobs-on-social-media/", "BodySmall"),
            p("DMW guidance: pia.gov.ph/news/dmw-car-warns-public-vs-bogus-job-offers-shares-illegal-recruitment-red-flags/", "BodySmall"),
            p("NTC guidance: pia.gov.ph/news/dream-job-or-digital-trap-ntc-warns-jobseekers-vs-online-scams/", "BodySmall"),
            Spacer(1, 9 * mm),
            p(
                "A checklist cannot certify an opportunity as safe. If an offer may involve fraud, illegal recruitment, identity theft, or financial loss, contact the appropriate Philippine authority or qualified adviser.",
                "SectionIntro",
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("6. Use a seven-day application plan", "SectionTitle"),
            p("This plan assumes about 30 focused minutes a day. Adjust it to your circumstances.", "SectionIntro"),
            worksheet_table(
                ["Day", "Focus", "Done"],
                [
                    ["1", "Choose one primary role and collect five suitable descriptions.", "[ ]"],
                    ["2", "Highlight repeated skills and requirements.", "[ ]"],
                    ["3", "Update the top third of your resume for the target role.", "[ ]"],
                    ["4", "Prepare one relevant work sample or portfolio example.", "[ ]"],
                    ["5", "Find and verify three strong opportunities.", "[ ]"],
                    ["6", "Tailor and submit one or two careful applications.", "[ ]"],
                    ["7", "Follow up where appropriate and review what slowed you down.", "[ ]"],
                ],
                [18 * mm, 132 * mm, 20 * mm],
                [12 * mm] + [18 * mm] * 7,
            ),
            Spacer(1, 9 * mm),
            p("Weekly review", "Callout"),
            checkbox_lines(
                [
                    "Did the roles match my actual skills?",
                    "Did their schedules fit my family situation?",
                    "Which qualification appeared most often?",
                    "Where did I spend time without improving an application?",
                    "What is the smallest useful improvement for next week?",
                ]
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            p("7. Track quality, not only quantity", "SectionTitle"),
            p("Keep a record of where you applied, what you sent, and when to follow up.", "SectionIntro"),
            worksheet_table(
                ["Date", "Company and role", "Source", "Verified", "Tailored", "Status", "Follow-up"],
                [["", "", "", "", "", "", ""] for _ in range(8)],
                [19 * mm, 47 * mm, 25 * mm, 19 * mm, 19 * mm, 22 * mm, 19 * mm],
                [12 * mm] + [17 * mm] * 8,
            ),
            Spacer(1, 10 * mm),
            p("Your next step", "Callout"),
            p(
                "Remote Mom's Launchpad is being shaped to help Filipino mothers choose a realistic remote-career direction, present existing skills clearly, verify opportunities, and run a focused application process.",
                "SectionIntro",
            ),
            p(
                "Visit the Launchpad page and share the one section where you still need help. Your response will guide what is built next.",
                "SectionIntro",
            ),
        ]
    )

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    copyfile(OUTPUT, LANDING_COPY)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
    print(LANDING_COPY)
