import { Fragment, type ReactNode } from "react";

const INLINE_FORMATTING =
  /(\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\n)/g;
const HEADING = /^(#{1,3})\s+(.+)$/;
const UNORDERED_ITEM = /^[-*]\s+(.+)$/;
const ORDERED_ITEM = /^\d+\.\s+(.+)$/;

function isSectionLabel(line: string) {
  const label = line.replace(/^[^A-Za-z0-9]+/, "").trim();
  return label.length > 2 && /[A-Z]/.test(label) && label === label.toUpperCase();
}

function renderInline(content: string): ReactNode[] {
  return content.split(INLINE_FORMATTING).map((segment, index) => {
    if (segment === "\n") return <br key={index} />;
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={index}>{segment.slice(2, -2)}</strong>;
    }
    if (segment.startsWith("__") && segment.endsWith("__")) {
      return <u key={index}>{segment.slice(2, -2)}</u>;
    }
    if (segment.startsWith("~~") && segment.endsWith("~~")) {
      return <del key={index}>{segment.slice(2, -2)}</del>;
    }
    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={index}>{segment.slice(1, -1)}</em>;
    }
    if (segment.startsWith("_") && segment.endsWith("_")) {
      return <em key={index}>{segment.slice(1, -1)}</em>;
    }
    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-[#e8e0d1] px-1 py-0.5 font-mono text-[0.9em]">
          {segment.slice(1, -1)}
        </code>
      );
    }

    const link = segment.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#2a6355] underline underline-offset-2"
        >
          {link[1]}
        </a>
      );
    }

    return <Fragment key={index}>{segment}</Fragment>;
  });
}

function renderHeading(level: number, content: string, key: number) {
  const className =
    level === 1
      ? "my-2 font-serif text-xl font-bold leading-tight text-[#332b20]"
      : level === 2
        ? "my-2 font-serif text-lg font-bold leading-tight text-[#332b20]"
        : "my-1.5 font-serif text-base font-bold leading-tight text-[#332b20]";

  if (level === 1)
    return (
      <h3 key={key} className={className}>
        {renderInline(content)}
      </h3>
    );
  if (level === 2)
    return (
      <h4 key={key} className={className}>
        {renderInline(content)}
      </h4>
    );
  return (
    <h5 key={key} className={className}>
      {renderInline(content)}
    </h5>
  );
}

function isBlockStart(line: string) {
  return (
    HEADING.test(line) ||
    isSectionLabel(line) ||
    line.startsWith("> ") ||
    UNORDERED_ITEM.test(line) ||
    ORDERED_ITEM.test(line) ||
    /^(---|\*\*\*|___)\s*$/.test(line)
  );
}

export function renderStoryFormatting(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      blocks.push(<div key={`space-${index}`} className="h-2" aria-hidden="true" />);
      index += 1;
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      blocks.push(renderHeading(heading[1].length, heading[2], index));
      index += 1;
      continue;
    }

    if (isSectionLabel(line)) {
      blocks.push(
        <h4 key={`label-${index}`} className="story-section-label">
          {line}
        </h4>,
      );
      index += 1;
      continue;
    }

    if (/^(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push(<hr key={index} className="my-3 border-[#c7a96c]" />);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quote.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="my-2 border-l-2 border-[#c7a96c] pl-3 italic text-[#6b5844]"
        >
          {renderInline(quote.join("\n"))}
        </blockquote>,
      );
      continue;
    }

    const unorderedItem = line.match(UNORDERED_ITEM);
    const orderedItem = line.match(ORDERED_ITEM);
    if (unorderedItem || orderedItem) {
      const items: string[] = [];
      const pattern = unorderedItem ? UNORDERED_ITEM : ORDERED_ITEM;
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      const listItems = items.map((item, itemIndex) => (
        <li key={itemIndex}>{renderInline(item)}</li>
      ));
      blocks.push(
        unorderedItem ? (
          <ul key={`list-${index}`} className="my-2 list-disc space-y-1 pl-5">
            {listItems}
          </ul>
        ) : (
          <ol key={`list-${index}`} className="my-2 list-decimal space-y-1 pl-5">
            {listItems}
          </ol>
        ),
      );
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`} className="my-1">
        {renderInline(paragraph.join("\n"))}
      </p>,
    );
  }

  return blocks;
}
