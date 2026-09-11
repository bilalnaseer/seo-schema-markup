/**
 * Focus keyword + live SEO checks for the blog collection.
 *
 * Registers the `seo-keyword` custom field type used by the `focus_keyword`
 * field in config.yml. The control is the keyword input itself; underneath it
 * renders a checklist scoring the page <title> and meta description against
 * that keyword.
 *
 * Ported from new-websensepro/public/admin/seo-panel.js. The difference here is
 * that this site has no separate meta title / meta description fields:
 * tools/build-blog.js renders `<title>` as `title + TITLE_SUFFIX` and uses the
 * `description` field as the meta description. So the checks score those two
 * fields, resolved exactly as the builder does.
 *
 * Why it lives on the keyword field rather than wrapping Title / Description:
 * those two fields have Sveltia's character counter and hints, which come from
 * their `maxlength`. Wrapping their controls risked losing that, so the panel
 * sits next to them instead. `focus_keyword` is declared immediately above
 * `description`, so the advice is adjacent to what it is about.
 *
 * Sveltia exposes `h`, `createClass` and `CMS` globally and re-renders the
 * control whenever ANY field in the entry changes, so `this.props.entry` is
 * always current — that is what makes the checks live. See
 * https://sveltiacms.app/en/docs/api/field-types
 *
 * Advisory only: nothing here implements `isValid`, so no check can ever block
 * a save. The field is CMS-only — the builder ignores `focus_keyword`.
 */
(() => {
  // Mirrors tools/build-blog.js (`title: \`${p.title} — SEO Schema Markup Blog\``).
  // Keep in sync if the suffix there changes.
  const TITLE_SUFFIX = " — SEO Schema Markup Blog";

  const TITLE_MIN = 50;
  const TITLE_MAX = 60;
  const DESC_MIN = 120;
  const DESC_MAX = 160;

  const get = (entry, name) => {
    const value = entry?.getIn(["data", name]);
    return typeof value === "string"
      ? value
      : value == null
        ? ""
        : String(value);
  };

  /** Case- and punctuation-insensitive, so "WordPress MCP" matches "wordpress mcp:". */
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[‘’“”]/g, "'")
      .replace(/[^a-z0-9']+/g, " ")
      .trim();

  const contains = (haystack, needle) => {
    const h = normalize(haystack);
    const n = normalize(needle);
    return !!n && h.includes(n);
  };

  /** Where the keyword starts, as a fraction of the string. Null if absent. */
  const position = (haystack, needle) => {
    const h = normalize(haystack);
    const n = normalize(needle);
    const i = h.indexOf(n);
    return i === -1 || !h.length ? null : i / h.length;
  };

  const STATUS = {
    good: { icon: "●", color: "#15803d", label: "Good" },
    warn: { icon: "●", color: "#b45309", label: "Could be better" },
    bad: { icon: "●", color: "#b91c1c", label: "Needs work" },
    idle: { icon: "○", color: "#6b7280", label: "Not checked" },
  };

  /** Effective <title>, resolved exactly as tools/build-blog.js does. */
  const effectiveTitle = (entry) => {
    const title = get(entry, "title").trim();
    return { value: title ? title + TITLE_SUFFIX : "" };
  };

  /** Effective meta description — the `description` field, verbatim. */
  const effectiveDescription = (entry) => ({
    value: get(entry, "description").trim(),
  });

  const plural = (n) => n + (n === 1 ? " character" : " characters");

  const lengthCheck = (label, text, min, max) => {
    const n = text.length;
    if (!n) return { status: "bad", text: label + " is empty." };
    if (n < min)
      return {
        status: "warn",
        text:
          label +
          " is " +
          plural(n) +
          " — short of the " +
          min +
          "–" +
          max +
          " target.",
      };
    if (n > max)
      return {
        status: "warn",
        text:
          label +
          " is " +
          plural(n) +
          " — over " +
          max +
          ", so Google will truncate it.",
      };
    return {
      status: "good",
      text:
        label +
        " is " +
        plural(n) +
        ", inside the " +
        min +
        "–" +
        max +
        " target.",
    };
  };

  const keywordCheck = (label, text, keyword, checkPosition) => {
    if (!text)
      return {
        status: "bad",
        text: label + " is empty, so the keyword cannot appear in it.",
      };
    if (!contains(text, keyword))
      return {
        status: "bad",
        text: label + " does not contain the focus keyword.",
      };
    if (!checkPosition)
      return { status: "good", text: label + " contains the focus keyword." };
    const at = position(text, keyword);
    if (at !== null && at > 0.5) {
      return {
        status: "warn",
        text:
          label +
          " contains the keyword, but past the halfway point — move it nearer the front.",
      };
    }
    return { status: "good", text: label + " leads with the focus keyword." };
  };

  const buildChecks = (entry, keyword) => {
    const title = effectiveTitle(entry);
    const desc = effectiveDescription(entry);
    const checks = [];

    checks.push(keywordCheck("Page title", title.value, keyword, true));
    checks.push(lengthCheck("Page title", title.value, TITLE_MIN, TITLE_MAX));
    checks.push(keywordCheck("Meta description", desc.value, keyword, false));
    checks.push(
      lengthCheck("Meta description", desc.value, DESC_MIN, DESC_MAX),
    );

    const notes = [];
    if (title.value)
      notes.push(
        "Page title is scored as it ships: your Title plus “" +
          TITLE_SUFFIX.trim() +
          "” (" +
          TITLE_SUFFIX.length +
          " characters), which the build appends automatically.",
      );

    return { checks, notes };
  };

  const row = (check, i) =>
    h(
      "li",
      {
        key: i,
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          padding: "4px 0",
          lineHeight: 1.45,
        },
      },
      h(
        "span",
        {
          style: { color: STATUS[check.status].color, flexShrink: 0 },
          "aria-hidden": "true",
        },
        STATUS[check.status].icon,
      ),
      h("span", { style: { color: "inherit" } }, check.text),
      h(
        "span",
        {
          style: {
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          },
        },
        STATUS[check.status].label,
      ),
    );

  // `CMS.getFieldType()` only exists in newer Sveltia builds; the vendored
  // bundle's API proxy returns undefined for unknown names. Reuse the built-in
  // string control when it is there, otherwise render the plain input from the
  // docs' minimal example — same behaviour, no dependency on the bundle version.
  const builtinString =
    typeof CMS.getFieldType === "function" ? CMS.getFieldType("string") : null;
  const StringControl = builtinString ? builtinString.control : null;

  const SeoKeywordControl = createClass({
    render: function () {
      const { value, field, forID, classNameWrapper, onChange, entry } =
        this.props;
      const keyword = (value || "").trim();

      const input = StringControl
        ? h(StringControl, {
            field: { name: field.get("name") },
            value: value,
            forID: forID,
            onChange: onChange,
          })
        : h("input", {
            id: forID,
            className: classNameWrapper,
            type: "text",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
          });

      const panelStyle = {
        marginTop: "12px",
        padding: "12px 14px",
        border: "1px solid rgba(128,128,128,0.35)",
        borderRadius: "6px",
        fontSize: "13px",
      };

      if (!keyword) {
        return h(
          "div",
          null,
          input,
          h(
            "div",
            { style: panelStyle },
            h(
              "span",
              { style: { color: STATUS.idle.color } },
              "Enter a focus keyword to check the page title and meta description against it.",
            ),
          ),
        );
      }

      const { checks, notes } = buildChecks(entry, keyword);
      const failing = checks.filter((c) => c.status !== "good").length;
      const summary =
        failing === 0
          ? "All " + checks.length + " checks pass."
          : failing + " of " + checks.length + " checks need attention.";

      return h(
        "div",
        null,
        input,
        h(
          "div",
          { style: panelStyle },
          h(
            "div",
            { style: { fontWeight: 600, marginBottom: "6px" } },
            "SEO checks for “" + keyword + "” — " + summary,
          ),
          h(
            "ul",
            {
              style: {
                listStyle: "none",
                margin: 0,
                padding: 0,
                position: "relative",
              },
            },
            checks.map(row),
          ),
          notes.length
            ? h(
                "div",
                {
                  style: {
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid rgba(128,128,128,0.25)",
                    color: STATUS.idle.color,
                  },
                },
                notes.map((n, i) =>
                  h("div", { key: i, style: { padding: "2px 0" } }, n),
                ),
              )
            : null,
          h(
            "div",
            { style: { marginTop: "8px", color: STATUS.idle.color } },
            "Advisory only — none of this blocks saving.",
          ),
        ),
      );
    },
  });

  const SeoKeywordPreview = createClass({
    render: function () {
      return h("span", null, this.props.value || "");
    },
  });

  CMS.registerFieldType("seo-keyword", SeoKeywordControl, SeoKeywordPreview);
})();
