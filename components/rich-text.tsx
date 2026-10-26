import { Fragment } from "react";

// Renders the small markdown subset used in lesson theory: paragraphs,
// "- " bullet lists, ``` fenced code, `inline code`, **bold** and *italic*.
function inline(text: string) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function RichText({ text }: { text: string }) {
  const blocks = text.split(/```\n?/);
  return (
    <div className="rich-text">
      {blocks.map((block, blockIndex) =>
        blockIndex % 2 === 1 ? (
          <pre key={blockIndex}><code>{block.replace(/\n$/, "")}</code></pre>
        ) : (
          block
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => {
              const lines = paragraph.split("\n");
              const key = `${blockIndex}-${index}`;
              if (lines.every((line) => line.startsWith("- "))) {
                return <ul key={key}>{lines.map((line) => <li key={line}>{inline(line.slice(2))}</li>)}</ul>;
              }
              const bullets = lines.findIndex((line) => line.startsWith("- "));
              if (bullets > 0) {
                return (
                  <Fragment key={key}>
                    <p>{inline(lines.slice(0, bullets).join(" "))}</p>
                    <ul>{lines.slice(bullets).map((line) => <li key={line}>{inline(line.slice(2))}</li>)}</ul>
                  </Fragment>
                );
              }
              return <p key={key}>{inline(lines.join(" "))}</p>;
            })
        )
      )}
    </div>
  );
}
