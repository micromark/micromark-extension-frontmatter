# micromark-extension-frontmatter

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[micromark][] extension to support frontmatter (YAML, TOML, etc).

## Contents

*   [What is this?](#what-is-this)
*   [When to use this](#when-to-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`frontmatter(options?)`](#frontmatteroptions)
    *   [`frontmatterHtml(options?)`](#frontmatterhtmloptions)
*   [Examples](#examples)
*   [Authoring](#authoring)
*   [HTML](#html)
*   [CSS](#css)
*   [Syntax](#syntax)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package contains extensions that add support for frontmatter.

As there is no spec for frontmatter in markdown, this extension follows how YAML
frontmatter works on github.com.
For the HTML part, instead of rendering YAML, it is ignored.
Other types of frontmatter can be parsed, which will by default also work the
same as on github.com.

## When to use this

These tools are all low-level.
In many cases, you want to use [`remark-frontmatter`][plugin] with remark
instead.

When you do want to use `micromark`, you can use this.
When working with `mdast-util-from-markdown`, you must combine this package
with [`mdast-util-frontmatter`][util].

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install micromark-extension-frontmatter
```

In Deno with [`esm.sh`][esmsh]:

```js
import {frontmatter, frontmatterHtml} from 'https://esm.sh/micromark-extension-frontmatter@1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {frontmatter, frontmatterHtml} from 'https://esm.sh/micromark-extension-frontmatter@1?bundle'
</script>
```

## Use

```js
import {micromark} from 'micromark'
import {frontmatter, frontmatterHtml} from 'micromark-extension-frontmatter'

const output = micromark('---\na: b\n---\n# c', {
  extensions: [frontmatter()],
  htmlExtensions: [frontmatterHtml()]
})

console.log(output)
```

Yields:

```html
<h1>c</h1>
```

## API

This package exports the identifiers `frontmatter` and `frontmatterHtml`.
There is no default export.

The export map supports the endorsed [`development` condition][condition].
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `frontmatter(options?)`

Add support for parsing frontmatter in markdown.

Function that can be called to get a syntax extension for micromark (passed
in `extensions`).

Supports YAML by default.
Can be configured to support TOML and more.

##### `options`

Configuration (optional).

One [`preset`][preset] or [`Matter`][matter], or an array of them, defining all
the supported frontmatters (default: `'yaml'`).

##### `preset`

Either `'yaml'` or `'toml'`:

*   `'yaml'` — [`Matter`][matter] defined as `{type: 'yaml', marker: '-'}`
*   `'toml'` — [`Matter`][matter] defined as `{type: 'toml', marker: '+'}`

##### `Matter`

An object with a `type` and either a `marker` or a `fence`:

*   `type` (`string`)
    — type to tokenize as
*   `marker` (`string` or `{open: string, close: string}`)
    — character used to construct fences.
    By providing an object with `open` and `close` different characters can be
    used for opening and closing fences.
    For example the character `'-'` will result in `'---'` being used as the
    fence
*   `fence` (`string` or `{open: string, close: string}`)
    — string used as the complete fence.
    By providing an object with `open` and `close` different values can be used
    for opening and closing fences.
    This can be used too if fences contain different characters or lengths other
    than 3
*   `anywhere` (`boolean`, default: `false`)
    – if `true`, matter can be found anywhere in the document.
    If `false` (default), only matter at the start of the document is recognized

### `frontmatterHtml(options?)`

Add support for turning frontmatter in markdown to HTML.

Function that can be called to get an HTML extension for micromark (passed
in `htmlExtensions`).

This makes sure nothing is generated for frontmatter.

Supports YAML by default.
Can be configured to support other things.

See `options` above for more info.

## Examples

Here are a couple of example of different matter objects and what frontmatter
they match.

To match frontmatter with the same opening and closing fence, namely three of
the same markers, use for example `{type: 'yaml', marker: '-'}`, which matches:

```yaml
---
key: value
---
```

To match frontmatter with different opening and closing fences, which each use
three different markers, use for example
`{type: 'custom', marker: {open: '<', close: '>'}}`, which matches:

```text
<<<
data
>>>
```

To match frontmatter with the same opening and closing fences, which both use
the same custom string, use for example `{type: 'custom', fence: '+=+=+=+'}`,
which matches:

```text
+=+=+=+
data
+=+=+=+
```

To match frontmatter with different opening and closing fences, which each use
different custom strings, use for example
`{type: 'json', fence: {open: '{', close: '}'}}`, which matches:

```json
{
  "key": "value"
}
```

## Authoring

When authoring markdown with frontmatter, it’s recommended to use YAML
frontmatter if possible.
While YAML has some warts, it works in the most places, so using it guarantees
the highest chance of portability.

In certain ecosystems, other flavors are widely used.
For example, in the Rust ecosystem, TOML is often used.
In such cases, using TOML is an okay choice.

When possible, do not use other types of frontmatter, and do not allow
frontmatter anywhere.

## HTML

Frontmatter does not relate to HTML elements.
It is typically stripped, which is what this plugin does.

## CSS

This package does not relate to CSS.

## Syntax

Frontmatter forms with, roughly, the following BNF:

```bnf
; Note: `fence` is an arbitrary, configured, fence.
frontmatter ::= fence *space_or_tab eol *( *code eol ) fence *space_or_tab
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`remarkjs/remark-frontmatter`][plugin]
    — remark plugin using this to support frontmatter
*   [`syntax-tree/mdast-util-frontmatter`][util]
    — mdast utility to support frontmatter

## Contribute

See [`contributing.md` in `micromark/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/micromark/micromark-extension-frontmatter/workflows/main/badge.svg

[build]: https://github.com/micromark/micromark-extension-frontmatter/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark-extension-frontmatter.svg

[coverage]: https://codecov.io/github/micromark/micromark-extension-frontmatter

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-frontmatter.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-frontmatter

[size-badge]: https://img.shields.io/bundlephobia/minzip/micromark-extension-frontmatter.svg

[size]: https://bundlephobia.com/result?p=micromark-extension-frontmatter

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/micromark/micromark/discussions

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/micromark/.github/blob/main/contributing.md

[support]: https://github.com/micromark/.github/blob/main/support.md

[coc]: https://github.com/micromark/.github/blob/main/code-of-conduct.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[condition]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions

[micromark]: https://github.com/micromark/micromark

[util]: https://github.com/syntax-tree/mdast-util-frontmatter

[plugin]: https://github.com/remarkjs/remark-frontmatter

[preset]: #preset

[matter]: #matter
