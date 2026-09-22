// The OpenScript language, as the documentation build reads it.
//
// Nothing about the language is typed into this repository. Every signature,
// parameter, default, accepted value, warmup, summary and error in the /script
// reference comes from the published `openalgo-script` package: the same
// compiler, manifest and error catalogue the /trading editor runs. A fact read
// here cannot drift from the language, because it is the language answering.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PKG = path.join(ROOT, "node_modules", "openalgo-script");

const core = await import(pathToFileURL(path.join(PKG, "dist", "core", "index.js")).href);
const editor = await import(pathToFileURL(path.join(PKG, "dist", "editor", "index.js")).href);

export { core, editor };

export const PACKAGE_VERSION = JSON.parse(fs.readFileSync(path.join(PKG, "package.json"), "utf8")).version;

const catalogue = JSON.parse(fs.readFileSync(path.join(PKG, "spec", "errors.json"), "utf8"));
export const ERROR_RANGES = catalogue.ranges;
export const ERRORS = catalogue.entries;
export const ERROR_BY_CODE = new Map(ERRORS.map((e) => [e.code, e]));

/** The reserved words and operator marks, the lexer's own tables. */
export const RESERVED_WORDS = [...core.RESERVED_WORDS];
export const PUNCTUATORS = [...core.PUNCTUATORS];

export const NAMED_COLOURS = ["aqua", "black", "blue", "brown", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "orange", "pink", "purple", "red", "silver", "teal", "white", "yellow"];

/**
 * Every documented key. A value is its bare name (`close`), a function is its
 * name with brackets (`close()`), so a name the library gives both a value and
 * a call to has two keys and two entries.
 */
export const LIBRARY_KEYS = [...core.libraryNames()].sort().flatMap((name) => {
  const entries = core.libraryEntries(name);
  const keys = [];
  if (entries.some((e) => !e.callable)) keys.push(name);
  if (entries.some((e) => e.callable)) keys.push(`${name}()`);
  return keys;
});

const KEY_SET = new Set(LIBRARY_KEYS);
export const isLibraryKey = (key) => KEY_SET.has(key);

/** The HTML id of an entry: `draw.line()` is `draw-line`, `close()` is `close-fn`. */
export function anchorFor(key) {
  const callable = key.endsWith("()");
  const name = callable ? key.slice(0, -2) : key;
  const base = name.replace(/\./g, "-");
  if (callable && KEY_SET.has(name)) return `${base}-fn`;
  return base;
}

function probe(name) {
  // A strategy file, so the strategy-only names resolve as well as the rest.
  const src = `version 1\nstrategy("probe")\nx = ${name}\n`;
  return editor.hover(src, src.lastIndexOf(name) + name.length - 1);
}

function describeWarmup(rule) {
  if (!rule) return undefined;
  switch (rule.kind) {
    case "delay": return rule.bars === 0 ? "bar 0" : `bar ${rule.bars}`;
    case "total": return "bar 0, whatever its arguments";
    case "data": return "decided by the data";
    case "argument": return `the warmup of \`${rule.param}\``;
    case "either": return `as soon as the earlier of ${rule.params.map((p) => `\`${p}\``).join(" or ")} is present`;
    default: return undefined;
  }
}

/** Everything the reference shows about one key, from the compiler. */
const shown = (t) => t.replace(/\bunknown\b/g, "any");

export function entryFacts(key) {
  const callable = key.endsWith("()");
  const name = callable ? key.slice(0, -2) : key;
  const entries = core.libraryEntries(name).filter((e) => e.callable === callable);
  if (!entries.length) throw new Error(`${key} is not in the library`);
  const hover = probe(name);
  const signatures = (hover?.signatures ?? []).map(shown).filter((s) => (callable ? s.startsWith(`${name}(`) : !s.startsWith(`${name}(`)));

  const overloads = entries.map((e) => ({
    returns: shown(core.typeText(e.returns)),
    parameters: e.parameters.map((p) => {
      const def = p.defaultText ?? (core.DECLARATION_CALLS.has(name) ? core.declarationDefaultText(name, p.name) : undefined);
      return {
        name: p.name,
        type: shown(core.typeText(p.type)),
        // The manifest records whether a parameter has a default; one without
        // is required, and omitting it is OS3012.
        required: !p.optional,
        default: def,
        values: e.values?.[p.name] ?? [],
        whole: e.whole?.[p.name] ? true : false,
        constant: (e.constant ?? []).includes(p.name),
      };
    }),
  }));

  const first = entries[0];
  // The hover's warmup is the sentence the specification's own row states,
  // which is better than any rendering of the rule; it covers both kinds of
  // key on a name, so it is only trusted where the name has one kind.
  const bothKinds = core.libraryEntries(name).some((e) => e.callable !== callable);
  const warmup = (!bothKinds && hover?.warmup) || describeWarmup(first.warmup);

  return {
    key,
    name,
    anchor: anchorFor(key),
    callable,
    signatures: signatures.length ? signatures : overloads.map((o) => `${name}${callable ? `(${o.parameters.map((p) => `${p.name}${p.required ? "" : "?"}: ${p.type}${p.default !== undefined ? ` = ${p.default}` : ""}`).join(", ")}) -> ${o.returns}` : `: ${o.returns}`}`),
    summary: bothKinds ? undefined : hover?.summary,
    warmup: callable || !bothKinds ? warmup : describeWarmup(first.warmup),
    overloads,
    planned: entries.every((e) => e.planned),
    strategyOnly: entries.some((e) => e.strategyOnly),
    stateful: entries.some((e) => e.stateful),
    topLevel: entries.some((e) => e.topLevel),
    colour: hover?.colour,
  };
}

/**
 * Compile one documentation code block and say whether it holds up.
 *
 * A block with its own declaration is compiled as written. A fragment is
 * wrapped in a study, and in a strategy when the fragment uses a strategy-only
 * name, because that is how a reader would paste it.
 */
export function compileBlock(code) {
  const hasDecl = /^\s*(study|strategy)\s*\(/m.test(code);
  const attempt = (src) => editor.diagnose(src).map((d) => ({ code: d.code, severity: d.severity, message: d.message, line: d.span?.line }));
  // A complete script is compiled exactly as a reader would paste it, so one
  // missing its version line reports OS8003 and the check refuses it.
  if (hasDecl) return { wrapped: false, diagnostics: attempt(code) };
  let diags = attempt(`version 1\nstudy("doc")\n${code}\n`);
  if (diags.some((d) => d.code === "OS7001")) diags = attempt(`version 1\nstrategy("doc")\n${code}\n`);
  return { wrapped: true, diagnostics: diags.map((d) => ({ ...d, line: d.line ? d.line - 2 : d.line })) };
}
