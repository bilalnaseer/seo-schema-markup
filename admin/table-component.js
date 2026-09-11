/**
 * "Table" block for the blog post editor.
 *
 * Sveltia's rich text editor has no table block, and its Markdown round-trip
 * does not know about GFM pipe tables, so a table typed by hand gets mangled.
 * An editor component fixes that: Sveltia treats anything matching `pattern`
 * as an opaque block owned by this component, edited through `fields`, and
 * serialised back by `toBlock`. See
 * https://sveltiacms.app/en/docs/api/editor-components
 *
 * Storage format is a plain GFM pipe table — nothing custom — so the Markdown
 * stays portable and tools/build-blog.js renders it with its existing pipe
 * table support (which also honours the `\|` cell escape used here).
 *
 * The editing format is deliberately spreadsheet-friendly: one row per line,
 * the first line is the header, and cells are separated by `|` OR tabs, so a
 * range copied out of Google Sheets / Excel pastes straight in.
 *
 * Loaded from admin/index.html after the CMS bundle and before CMS.init().
 */
(() => {
  /** Split a line into cells on tabs, or on unescaped pipes when there are no tabs. */
  const splitCells = (line) => {
    const trimmed = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
    if (trimmed.includes("\t")) return trimmed.split("\t").map((c) => c.trim());
    // Split on `|` that is not preceded by a backslash, then unescape `\|`.
    return trimmed
      .split(/(?<!\\)\|/)
      .map((c) => c.trim().replace(/\\\|/g, "|"));
  };

  /** Parse the editing text into a rectangular array of rows. */
  const parseRows = (text) => {
    const rows = String(text || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter((l) => l.trim() && !/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(l))
      .map(splitCells);
    const width = Math.max(0, ...rows.map((r) => r.length));
    return rows.map((r) => {
      while (r.length < width) r.push("");
      return r;
    });
  };

  const escapeCell = (c) => String(c).replace(/\|/g, "\\|").replace(/\n/g, " ");

  /** Rows → GFM pipe table. */
  const toPipeTable = (rows) => {
    if (!rows.length) return "";
    const [header, ...body] = rows;
    const line = (r) => "| " + r.map(escapeCell).join(" | ") + " |";
    return [
      line(header),
      "| " + header.map(() => "---").join(" | ") + " |",
      ...body.map(line),
    ].join("\n");
  };

  /** Rows → editing text (pipes, so `\|` escapes survive a round trip). */
  const toEditText = (rows) => rows.map((r) => r.map(escapeCell).join(" | ")).join("\n");

  const escHtml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  CMS.registerEditorComponent({
    id: "table",
    label: "Table",
    icon: "table",
    fields: [
      {
        name: "rows",
        label: "Rows",
        widget: "text",
        hint:
          "One row per line; the first line is the header. Separate cells with | " +
          "— or paste cells straight from Google Sheets / Excel (tabs work too). " +
          "Type \\| for a literal pipe inside a cell.",
      },
    ],
    // A header row, a separator row of dashes, then zero or more body rows.
    pattern:
      /^[ \t]*\|.+\|[ \t]*\n[ \t]*\|[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|[ \t]*(?:\n[ \t]*\|.*\|[ \t]*)*$/m,
    fromBlock: (match) => ({ rows: toEditText(parseRows(match[0])) }),
    toBlock: ({ rows }) => toPipeTable(parseRows(rows)),
    toPreview: ({ rows }) => {
      const data = parseRows(rows);
      if (!data.length) return "";
      const [header, ...body] = data;
      const cells = (r, tag) => r.map((c) => `<${tag}>${escHtml(c)}</${tag}>`).join("");
      return (
        '<table style="border-collapse:collapse;width:100%"><thead><tr>' +
        cells(header, "th") +
        "</tr></thead><tbody>" +
        body.map((r) => "<tr>" + cells(r, "td") + "</tr>").join("") +
        "</tbody></table>"
      );
    },
  });
})();
