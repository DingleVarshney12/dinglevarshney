import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFName,
  PDFString,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { PublicPortfolioData } from "@/api/portfolio/portfolio.type";
import type { LeetcodeSolvedStats } from "@/api/leetcode/leetcode.type";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const INK = rgb(0.08, 0.08, 0.08);
const MUTED = rgb(0.28, 0.28, 0.28);
const RULE = rgb(0.22, 0.22, 0.22);
const LINK = rgb(0.0, 0.42, 0.38);
const safeText = (value: string) =>
  value
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\x7E]/g, "");

type SectionRow = {
  title: string;
  subtitle?: string;
  meta?: string;
  details?: string;
  bullets?: string[];
  technologyTags?: string[];
  actions?: { label: string; url: string }[];
};

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = safeText(text).trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  width: number,
  font: PDFFont,
  size: number,
  color = MUTED,
  lineHeight = size * 1.35,
) {
  const lines = wrap(text, font, size, width);
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

export async function generateResumePdf(
  data: PublicPortfolioData,
  leetcode: LeetcodeSolvedStats | null,
) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - 44;
  const width = PAGE_WIDTH - MARGIN * 2;
  const name = data.profile?.name || "Dingle Varshney";

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  }
  function ensure(height: number) {
    if (y - height < MARGIN) newPage();
  }
  function section(title: string) {
    ensure(38);
    y -= 10;
    page.drawText(safeText(title), {
      x: MARGIN,
      y,
      size: 14,
      font: bold,
      color: INK,
    });
    y -= 5;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.7,
      color: RULE,
    });
    y -= 13;
  }
  function addLinkAnnotation(
    targetPage: PDFPage,
    x: number,
    bottom: number,
    linkWidth: number,
    height: number,
    url: string,
  ) {
    const annotation = pdf.context.obj({
      Type: PDFName.of("Annot"),
      Subtype: PDFName.of("Link"),
      Rect: [x, bottom, x + linkWidth, bottom + height],
      Border: [0, 0, 0],
      A: pdf.context.obj({
        Type: PDFName.of("Action"),
        S: PDFName.of("URI"),
        URI: PDFString.of(url),
      }),
    });
    targetPage.node.addAnnot(pdf.context.register(annotation));
  }
  function drawArrow(targetPage: PDFPage, x: number, baseline: number) {
    targetPage.drawLine({
      start: { x, y: baseline + 1 },
      end: { x: x + 4, y: baseline + 5 },
      thickness: 0.7,
      color: LINK,
    });
    targetPage.drawLine({
      start: { x: x + 1.5, y: baseline + 5 },
      end: { x: x + 4, y: baseline + 5 },
      thickness: 0.7,
      color: LINK,
    });
    targetPage.drawLine({
      start: { x: x + 4, y: baseline + 2.5 },
      end: { x: x + 4, y: baseline + 5 },
      thickness: 0.7,
      color: LINK,
    });
  }
  function row(item: SectionRow) {
    ensure(44);
    const meta = item.meta ? safeText(item.meta) : "";
    const metaWidth = meta ? regular.widthOfTextAtSize(meta, 8.5) : 0;
    const actionText = (item.actions ?? []).map((action) => safeText(action.label));
    const actionWidths = actionText.map((label) => regular.widthOfTextAtSize(label, 8));
    const actionGroupWidth = actionWidths.reduce((sum, itemWidth) => sum + itemWidth + 13, 0);
    const rightWidth = Math.max(metaWidth < width * 0.47 ? metaWidth : 0, actionGroupWidth);
    const titleWidth = rightWidth > 0 ? width - rightWidth - 10 : width;
    const headingY = y;
    for (const line of wrap(item.title, bold, 10.1, titleWidth)) {
      page.drawText(line, { x: MARGIN, y, size: 10.1, font: bold, color: INK });
      y -= 12;
    }
    if (item.actions?.length) {
      let x = PAGE_WIDTH - MARGIN - actionGroupWidth;
      item.actions.forEach((action, index) => {
        const label = actionText[index];
        const textWidth = actionWidths[index];
        page.drawText(label, { x, y: headingY, size: 8, font: regular, color: LINK });
        drawArrow(page, x + textWidth + 1, headingY);
        addLinkAnnotation(page, x, headingY - 1, textWidth + 6, 10, action.url);
        x += textWidth + 13;
      });
    } else if (item.meta) {
      if (metaWidth <= width * 0.47)
        page.drawText(meta, {
          x: PAGE_WIDTH - MARGIN - metaWidth,
          y: y + 13,
          size: 8.5,
          font: regular,
          color: MUTED,
        });
    }
    if (item.subtitle) {
      y = drawLines(page, item.subtitle, MARGIN, y, width, regular, 8.8, MUTED, 10.6);
    }
    if (item.details) {
      y = drawLines(page, item.details, MARGIN, y, width, regular, 8.7, MUTED, 11.2);
    }
    if (item.technologyTags?.length) {
      const tagFontSize = 7.2;
      const tagHeight = 13;
      const tagGap = 5;
      const tagRowGap = 4;
      const tags = item.technologyTags.map((tag) => {
        const label = safeText(tag);
        return {
          label,
          width: Math.min(regular.widthOfTextAtSize(label, tagFontSize) + 10, width),
        };
      });
      const rows: (typeof tags)[] = [[]];
      let rowWidth = 0;
      for (const tag of tags) {
        const nextWidth = rowWidth ? rowWidth + tagGap + tag.width : tag.width;
        if (nextWidth > width) {
          rows.push([tag]);
          rowWidth = tag.width;
        } else {
          rows[rows.length - 1].push(tag);
          rowWidth = nextWidth;
        }
      }
      ensure(rows.length * (tagHeight + tagRowGap) + 2);
      for (const tagRow of rows) {
        let x = MARGIN;
        for (const tag of tagRow) {
          page.drawRectangle({
            x,
            y: y - 3,
            width: tag.width,
            height: tagHeight,
            color: rgb(0.93, 0.97, 0.95),
            borderColor: rgb(0.82, 0.9, 0.86),
            borderWidth: 0.45,
          });
          page.drawText(tag.label, { x: x + 5, y, size: tagFontSize, font: regular, color: LINK });
          x += tag.width + tagGap;
        }
        y -= tagHeight + tagRowGap;
      }
      y -= 1;
    }
    for (const bullet of item.bullets ?? []) {
      const bulletLines = wrap(bullet, regular, 8.5, width - 12);
      ensure(bulletLines.length * 10.5 + 2);
      page.drawCircle({ x: MARGIN + 2, y: y + 2.5, size: 1.15, color: INK });
      y = drawLines(page, bullet, MARGIN + 10, y, width - 10, regular, 8.5, MUTED, 10.5);
    }
    y -= 7;
  }

  const contact = [data.profile?.location, data.profile?.phone, data.profile?.email]
    .filter(Boolean)
    .join("  |  ");
  const nameWidth = bold.widthOfTextAtSize(safeText(name), 21);
  page.drawText(safeText(name), {
    x: Math.max(MARGIN, (PAGE_WIDTH - nameWidth) / 2),
    y,
    size: 21,
    font: bold,
    color: INK,
  });
  y -= 20;
  if (contact) {
    const contactLines = wrap(contact, regular, 8.5, width);
    for (const line of contactLines) {
      const textWidth = regular.widthOfTextAtSize(line, 8.5);
      page.drawText(line, {
        x: Math.max(MARGIN, (PAGE_WIDTH - textWidth) / 2),
        y,
        size: 8.5,
        font: regular,
        color: MUTED,
      });
      y -= 12;
    }
  }
  const links = data.profile?.socialLinks.filter((link) => link.url) ?? [];
  if (links.length) {
    const socialRows: (typeof links)[] = [[]];
    let socialRowWidth = 0;
    for (const link of links) {
      const labelWidth = regular.widthOfTextAtSize(safeText(link.label), 7.5);
      const nextWidth = socialRowWidth ? socialRowWidth + 13 + labelWidth : labelWidth;
      if (nextWidth > width && socialRows[socialRows.length - 1].length) {
        socialRows.push([link]);
        socialRowWidth = labelWidth;
      } else {
        socialRows[socialRows.length - 1].push(link);
        socialRowWidth = nextWidth;
      }
    }
    for (const socialRow of socialRows) {
      const rowWidth =
        socialRow.reduce(
          (sum, link) => sum + regular.widthOfTextAtSize(safeText(link.label), 7.5),
          0,
        ) +
        (socialRow.length - 1) * 13;
      let x = (PAGE_WIDTH - rowWidth) / 2;
      for (const link of socialRow) {
        const label = safeText(link.label);
        const labelWidth = regular.widthOfTextAtSize(label, 7.5);
        page.drawText(label, { x, y, size: 7.5, font: regular, color: LINK });
        addLinkAnnotation(page, x, y - 1, labelWidth, 10, link.url);
        x += labelWidth + 13;
      }
      y -= 10;
    }
  }
  y -= 4;

  if (data.profile?.shortBio) {
    section("Overview");
    y = drawLines(page, data.profile.shortBio, MARGIN, y, width, regular, 8.8, MUTED, 11.5);
    y -= 3;
  }

  const education = data.resumeEntries.filter((entry) => entry.kind === "education");
  if (education.length) {
    section("Education");
    for (const entry of education)
      row({
        title: entry.title,
        subtitle: [entry.organization, entry.location].filter(Boolean).join(" | "),
        meta: [entry.startDate, entry.endDate].filter(Boolean).join(" - "),
        details: entry.details ?? undefined,
        bullets: entry.bullets,
      });
  }

  const experience = data.resumeEntries.filter((entry) => entry.kind === "experience");
  if (experience.length) {
    section("Experience");
    for (const entry of experience)
      row({
        title: entry.title,
        subtitle: [entry.organization, entry.location].filter(Boolean).join(" | "),
        meta: [entry.startDate, entry.endDate].filter(Boolean).join(" - "),
        details: entry.details ?? undefined,
        bullets: entry.bullets,
      });
  }

  if (data.projects.length) {
    section("Projects");
    for (const project of data.projects)
      row({
        title: project.title,
        subtitle: [project.role, project.year?.toString()].filter(Boolean).join(" | "),
        details: project.longDescription || project.description,
        technologyTags: project.technologies,
        actions: [
          ...(project.demoUrl ? [{ label: "Live", url: project.demoUrl }] : []),
          ...(project.githubUrl ? [{ label: "GitHub", url: project.githubUrl }] : []),
        ],
      });
  }

  const activities = data.resumeEntries.filter((entry) => entry.kind === "activity");
  if (activities.length) {
    section("Activities");
    for (const entry of activities)
      row({
        title: entry.title,
        subtitle: [entry.organization, entry.location].filter(Boolean).join(" | "),
        meta: [entry.startDate, entry.endDate].filter(Boolean).join(" - "),
        details: entry.details ?? undefined,
        bullets: entry.bullets,
      });
  }

  if (data.skills.length) {
    section("Technical Skills");
    const groups = new Map<string, string[]>();
    for (const skill of data.skills)
      groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill.name]);
    for (const [category, skills] of groups) {
      ensure(18);
      const label = `${safeText(category)}: `;
      const labelWidth = bold.widthOfTextAtSize(label, 8.7);
      page.drawText(label, { x: MARGIN, y, size: 8.7, font: bold, color: INK });
      const skillLines = wrap(skills.join(", "), regular, 8.7, width - labelWidth);
      skillLines.forEach((line, index) => {
        page.drawText(line, {
          x: index === 0 ? MARGIN + labelWidth : MARGIN,
          y,
          size: 8.7,
          font: regular,
          color: MUTED,
        });
        y -= 11;
      });
      y -= 2;
    }
  }

  const additional: string[] = [];
  const languages = data.resumeEntries.filter((entry) => entry.kind === "language");
  const interests = data.resumeEntries.filter((entry) => entry.kind === "interest");
  if (languages.length)
    additional.push(
      `Languages: ${languages.map((entry) => [entry.title, entry.details].filter(Boolean).join(" - ")).join(", ")}`,
    );
  if (interests.length)
    additional.push(
      `Interests: ${interests.map((entry) => [entry.title, entry.details].filter(Boolean).join(" - ")).join(", ")}`,
    );
  if (leetcode)
    additional.push(
      `LeetCode: ${leetcode.totalSolved} solved (Easy ${leetcode.easySolved}, Medium ${leetcode.mediumSolved}, Hard ${leetcode.hardSolved})`,
    );
  if (additional.length) {
    section("Additional");
    for (const item of additional) {
      ensure(16);
      y = drawLines(page, item, MARGIN, y, width, regular, 8.5, MUTED, 11);
      y -= 2;
    }
  }
  if (data.certificates.length) {
    if (!additional.length) section("Additional");
    ensure(16);
    page.drawText("Certificates", { x: MARGIN, y, size: 8.2, font: bold, color: MUTED });
    y -= 12;
    for (const certificate of data.certificates) {
      const line = `${safeText(certificate.title)} - ${safeText(certificate.issuer)}`;
      const date = certificate.issuedAt ? safeText(certificate.issuedAt) : "";
      const dateFontSize = 7.2;
      const dateWidth = date ? regular.widthOfTextAtSize(date, dateFontSize) : 0;
      const leftWidth = date ? width - dateWidth - 10 : width;
      const lines = wrap(line, regular, 7.8, leftWidth);
      ensure(lines.length * 9.5 + 2);
      page.drawText(lines[0] ?? "", { x: MARGIN, y, size: 7.8, font: regular, color: MUTED });
      if (date)
        page.drawText(date, {
          x: PAGE_WIDTH - MARGIN - dateWidth,
          y,
          size: dateFontSize,
          font: regular,
          color: rgb(0.48, 0.49, 0.49),
        });
      y -= 9.5;
      for (const linePart of lines.slice(1)) {
        page.drawText(linePart, { x: MARGIN, y, size: 7.8, font: regular, color: MUTED });
        y -= 9.5;
      }
      y -= 1;
    }
  }

  pdf.setTitle(`${name} - Resume`);
  pdf.setAuthor(name);
  return pdf.save();
}

export function downloadResumePdf(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${
    name
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || "resume"
  }.pdf`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
