# Writing the /script documentation

The documentation for OpenScript, also called OpenAlgo Script, the open trading
language that runs in the /trading page of OpenAlgo. It is a reference for
learners: professional, exact, and easy to read from top to bottom or to land
on from search.

## Where things live

- `content/script/nav.json` is the table of contents. Every page is
  `content/script/<section>/<page>.md`. Do not add, rename or reorder pages in
  nav.json; write the pages it lists.
- `content/script/screens.json` lists the screenshots. Show one with
  `{{screen: id}}` on its own line.
- The language itself is the `openalgo-script` package in `node_modules`. Its
  source and its original specification are in `D:/OpenAlgo-Voice/openscript`
  (`docs/`, `spec/`, `examples/`). Those are your sources of truth. When a
  source and the compiler disagree, the compiler wins: test it.

## What the /trading editor has today

The Scripts panel in /trading has: the language's own syntax highlighting, a
numbered gutter, save on Ctrl+S (every save compiles, and a script that does
not compile is still saved), a console under the editor listing each
diagnostic with its line, code and fix, a Study or Strategy kind label, a
script picker with recent scripts and New script, and a button that applies
the script to the chart. It does NOT have completion, hover cards or
signature help in this release: the language ships those as headless
functions for integrators (see the Integrate section), and the documentation
site's own code viewer uses them. Never tell a reader the /trading editor
completes or explains code.

## Checking your work

    node scripts/check-script-docs.mjs --page reference/math,reference/string

Run it on your pages until it prints OK. It compiles every code block with the
real compiler, checks reference coverage, links, anchors, screenshots and the
wording rules below. Warnings about pages other agents have not written yet
are expected; problems on your own pages are not.

`node scripts/gen-script-docs.mjs` renders everything; you do not need to run
it, the check renders in memory.

## Page format

    ---
    title: Plots
    description: One or two plain sentences. Used as the page lede and for search engines.
    ---

    Opening paragraph: what this page covers and when you need it.

    ## A section
    ...

- Start headings at `##`. The page title comes from the front matter.
- Short paragraphs. Tables where a reader compares things. A callout only when
  it earns its place:

      :::tip
      Text.
      :::

  Kinds: `tip`, `note`, `warn`, `key`.
- Link to another page with a normal link: `[Warmup](/script/language/warmup)`.
  Link to a reference entry anywhere with `[[ema()]]` or `[[close]]`: a value is
  its bare name, a function has brackets.

## Code

Fence OpenScript as `openscript`:

    ```openscript
    version 1
    study("EMA cross", overlay = true)

    fast = input(9, "Fast")
    plot(ema(close, fast), "Fast EMA", aqua)
    ```

- Every block is compiled. A complete script (one with `study(` or
  `strategy(`) must start with `version 1` and compile with no error.
- A fragment without a declaration is compiled inside a study (or a strategy,
  when it uses a strategy-only name). Fragments are fine for one-line
  illustrations; prefer complete scripts for anything a reader will paste.
- To show a mistake, fence it as `openscript expect=OS2001`; the block must
  raise that code.
- `openscript nocheck` skips the compiler. Use it only for grammar notation
  that is not a program. Almost nothing needs it.
- `openscript title="Supertrend"` gives the block a title bar.
- Other languages: `js`, `python`, `bash`, `json`, `text`.
- `plot()` needs a title: `plot(x, "Title")`.

Test anything you are unsure about by writing a block and running the check.
Never document a behaviour you have not either read in the sources or seen the
compiler accept.

## Reference pages

A reference page (section `reference`) documents exactly the keys nav.json
lists under its `entries`, each once:

    {{entry: ema()}}

    Exponential moving average of `src` over `len` bars. Reacts faster than
    [[sma()]] because recent bars weigh more.

    ```openscript
    version 1
    study("EMA", overlay = true)
    plot(ema(close, 21), "EMA 21", orange)
    ```

    **Remarks.** Seeded on bar `len - 1` with the simple average of the first
    `len` values, so it has no value before that bar.

    **See also.** [[sma()]], [[rma()]], [[ma()]]

The directive renders the heading, the signature, a parameter table with types,
defaults and accepted values, the return type and the first bar with a value,
all read from the compiler. Do not retype any of that. You write:

1. A description paragraph directly below the directive (required). Plain
   language: what it computes and when you would use it.
2. At least one `openscript` example (required unless the entry is planned).
   Real, useful, and on Indian market thinking where it fits (NSE equities,
   index futures and options, the 09:15 to 15:30 session).
3. `**Remarks.**` for warmup, absence, edge cases, performance (when useful).
4. `**See also.**` with `[[...]]` links (when useful).

Group entries under `##` headings by purpose (for example Moving averages,
Oscillators, Volatility). The prose of an entry runs until the next directive
or `##` heading.

Entries marked planned in the language render a Planned badge and a note. Give
them a one or two sentence description of what they will do. No example (it
would not compile).

## Error pages

Pages in the `errors` section document every catalogue code in their range.
`{{error: OS2001}}` renders the code, title, message, fix and the before and
after example from the catalogue. The catalogue's own "cause" text is written
for specification readers; write a clear learner explanation below each
directive (one short paragraph, two at most). It replaces the catalogue cause
on the page. `{{errors: OS1}}` renders every code in a range with the catalogue
cause, for any you do not override; prefer one `{{error:}}` per code.

## Voice and wording rules

- Write for a trader learning to code as much as for a programmer learning to
  trade. Define a term the first time you use it, or link the glossary.
- Present tense, second person, active voice. Say what a thing does, then how.
- No emoji and no icons. No em dashes or en dashes anywhere: use a comma, a
  colon, parentheses or a full stop. A hyphen in a compound word is fine.
- Name no outside product, platform, company or broker. Never compare
  OpenScript with any other language or product. Describe prior art
  generically if you must.
- Never say data is "live"; say "real" or "latest" market data. Say "sandbox
  trading (analyzer mode in OpenAlgo)", never "paper trading" or "virtual
  trading".
- Indian options are priced with Black-76 off the synthetic future.
- OpenScript is the language's name. Mention once per landing context that it
  is also called OpenAlgo Script. The two libraries are `openalgo-script` on
  npm (JavaScript and TypeScript) and `openscript` on PyPI (Python), both
  Apache 2.0.
- Be honest about the release: say what is planned rather than implying it
  works. The package version is 0.5.0.
