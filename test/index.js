/**
 * @typedef {import('../dev/matters.js').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {micromark} from 'micromark'
import {frontmatter as syntax, frontmatterHtml as html} from '../dev/index.js'

const custom = {type: 'custom', marker: {open: '<', close: '>'}}
const json = {type: 'json', fence: {open: '{', close: '}'}}
const yamlAnywhere = {type: 'yaml', marker: '-', anywhere: true}
/** @type {Options} */
const customAndYaml = [
  {type: 'custom', marker: {open: '-', close: '.'}},
  'yaml'
]

test('core', async () => {
  assert.deepEqual(
    Object.keys(await import('micromark-extension-frontmatter')).sort(),
    ['frontmatter', 'frontmatterHtml'],
    'should expose the public api'
  )

  assert.throws(
    () => {
      // @ts-expect-error: runtime.
      syntax([1])
    },
    /^Error: Expected matter to be an object, not `1`/,
    'should throw if not given a preset or a matter'
  )

  assert.throws(
    () => {
      // @ts-expect-error: runtime.
      syntax('jsonml')
    },
    /^Error: Missing matter definition for `jsonml`/,
    'should throw if given an unknown preset'
  )

  assert.throws(
    () => {
      // @ts-expect-error: runtime.
      syntax({marker: '*'})
    },
    /^Error: Missing `type` in matter `{"marker":"\*"}`/,
    'should throw if given a matter without `type`'
  )

  assert.throws(
    () => {
      // @ts-expect-error: runtime.
      syntax({type: 'jsonml'})
    },
    /^Error: Missing `marker` or `fence` in matter `{"type":"jsonml"}`/,
    'should throw if given a matter without `marker`'
  )
})

test('markdown -> html (micromark)', () => {
  assert.deepEqual(
    micromark('---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />',
    'should not support a single yaml fence (thematic break)'
  )

  assert.deepEqual(
    micromark('---\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '',
    'should support empty yaml'
  )

  assert.deepEqual(
    micromark('---\na\n\nb\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '',
    'should support yaml w/ content'
  )

  assert.deepEqual(
    micromark('---\na\n\nb\n---\n# Heading\n***\n    code', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<h1>Heading</h1>\n<hr />\n<pre><code>code\n</code></pre>',
    'should support content after yaml'
  )

  assert.deepEqual(
    micromark('+++\na\n\nb\n+++\na\n=', {
      extensions: [syntax('toml')],
      htmlExtensions: [html('toml')]
    }),
    '<h1>a</h1>',
    'should support toml'
  )

  assert.deepEqual(
    micromark(' ---\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<hr />',
    'should not support a prefix (indent) before a yaml opening fence'
  )

  assert.deepEqual(
    micromark('---\n ---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<hr />',
    'should not support a prefix (indent) before a yaml closing fence'
  )

  assert.deepEqual(
    micromark('---  \n---\t ', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '',
    'should parse an arbitrary suffix after the opening and closing fence of yaml'
  )

  assert.deepEqual(
    micromark('--- --\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<hr />',
    'should not support other characters after the suffix on the opening fence of yaml'
  )

  assert.deepEqual(
    micromark('---\n--- x', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<p>--- x</p>',
    'should not support other characters after the suffix on the closing fence of yaml'
  )

  assert.deepEqual(
    micromark('----\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<hr />',
    'should not support an opening yaml fence of more than 3 characters'
  )

  assert.deepEqual(
    micromark('---\n----', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<hr />',
    'should not support a closing yaml fence of more than 3 characters'
  )

  assert.deepEqual(
    micromark('--\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<h2>--</h2>',
    'should not support an opening yaml fence of less than 3 characters'
  )

  assert.deepEqual(
    micromark('---\n--', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<hr />\n<p>--</p>',
    'should not support a closing yaml fence of less than 3 characters'
  )

  assert.deepEqual(
    micromark('---\na\nb\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '',
    'should support content in yaml'
  )

  assert.deepEqual(
    micromark('---\na\n\nb\n---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '',
    'should support blank lines in yaml'
  )

  const customOptions = {
    extensions: [syntax(custom)],
    htmlExtensions: [html(custom)]
  }

  assert.deepEqual(
    micromark('<<<\na\n\nb\n>>>', customOptions),
    '',
    'should support a custom matter (1)'
  )

  assert.deepEqual(
    micromark('<<<\na\n\nb\n>>>', customOptions),
    '',
    'should support a custom matter (2)'
  )

  assert.deepEqual(
    micromark('{\na\n\nb\n}', {
      extensions: [syntax(json)],
      htmlExtensions: [html(json)]
    }),
    '',
    'should support a custom matter (3)'
  )

  assert.deepEqual(
    micromark('# Hello\n---\na\n\nb\n---\n+++', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<h1>Hello</h1>\n<hr />\n<p>a</p>\n<h2>b</h2>\n<p>+++</p>',
    'should not support yaml frontmatter in the middle'
  )

  assert.deepEqual(
    micromark('# Hello\n---\na\n\nb\n---\n+++', {
      extensions: [syntax(yamlAnywhere)],
      htmlExtensions: [html(yamlAnywhere)]
    }),
    '<h1>Hello</h1>\n<p>+++</p>',
    'should support custom matters anywhere'
  )

  assert.deepEqual(
    micromark('a\n---\nb\n---', {
      extensions: [syntax(yamlAnywhere)],
      htmlExtensions: [html(yamlAnywhere)]
    }),
    '<p>a</p>\n',
    'should prefer anywhere matter that could also be seen as headings (setext)'
  )

  assert.deepEqual(
    micromark('---\nasd\n...', {
      extensions: [syntax(customAndYaml)],
      htmlExtensions: [html(customAndYaml)]
    }),
    '',
    'should support two matters w/ the same start, but different ends'
  )

  assert.deepEqual(
    micromark('---\nasd', {extensions: [syntax()], htmlExtensions: [html()]}),
    '<hr />\n<p>asd</p>',
    'should not support frontmatter w/o closing'
  )

  assert.deepEqual(
    micromark('* ---\n  asd\n  ---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<ul>\n<li>\n<hr />\n<h2>asd</h2>\n</li>\n</ul>',
    'should not support frontmatter in a container (list)'
  )

  assert.deepEqual(
    micromark('> ---\n  asd\n  ---', {
      extensions: [syntax()],
      htmlExtensions: [html()]
    }),
    '<blockquote>\n<hr />\n</blockquote>\n<h2>asd</h2>',
    'should not support frontmatter in a container (block quote)'
  )
})
