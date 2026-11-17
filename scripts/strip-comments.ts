import ts from "typescript";

// Rubric and anti-pattern rules are about code, so a comment that mentions
// `.first()` or `force: true` must not trip them (starters are full of such
// hints). Comments are removed; string contents are left alone.
export function stripComments(source: string, python: boolean): string {
  return python ? stripPython(source) : stripTypeScript(source);
}

function stripTypeScript(source: string): string {
  const file = ts.createSourceFile("spec.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const ranges = new Map<number, number>();
  const visit = (node: ts.Node) => {
    const children = node.getChildren(file);
    if (children.length === 0) {
      for (const range of ts.getLeadingCommentRanges(source, node.getFullStart()) ?? []) ranges.set(range.pos, range.end);
      for (const range of ts.getTrailingCommentRanges(source, node.getEnd()) ?? []) ranges.set(range.pos, range.end);
    }
    children.forEach(visit);
  };
  visit(file);
  let out = "";
  let at = 0;
  for (const [pos, end] of Array.from(ranges).sort((a, b) => a[0] - b[0])) {
    out += source.slice(at, pos);
    at = end;
  }
  return out + source.slice(at);
}

// Walks the text once, remembering whether it is inside a string (single,
// double or triple quoted), and drops `#` comments. Comment-only lines go away
// completely so decorator/def blocks stay adjacent.
function stripPython(source: string): string {
  let out = "";
  let quote = "";
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      out += c;
      if (c === "\\") out += source[++i] ?? "";
      else if (source.startsWith(quote, i)) {
        out += quote.slice(1);
        i += quote.length - 1;
        quote = "";
      }
    } else if (c === '"' || c === "'") {
      quote = source.startsWith(c.repeat(3), i) ? c.repeat(3) : c;
      out += quote;
      i += quote.length - 1;
    } else if (c === "#") {
      while (i < source.length && source[i] !== "\n") i++; // i now sits on the newline (the loop skips it)
      const lineStart = out.lastIndexOf("\n") + 1;
      if (out.slice(lineStart).trim() === "") out = out.slice(0, lineStart); // comment-only line: drop it whole
      else out += "\n";
    } else out += c;
  }
  return out;
}
