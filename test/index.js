/**
 * @typedef {import('micromark-extension-frontmatter').Options} Options
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {micromark} from 'micromark'
import {frontmatter, frontmatterHtml} from 'micromark-extension-frontmatter'

test('frontmatter', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('micromark-extension-frontmatter')).sort(),
      ['frontmatter', 'frontmatterHtml', 'toMatters']
    )
  })

  await t.test(
    'should throw if not given a preset or a matter',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check that the runtime throws too.
        frontmatter([1])
      }, /^Error: Expected matter to be an object, not `1`/)
    }
  )

  await t.test('should throw if given an unknown preset', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that the runtime throws too.
      frontmatter('jsonml')
    }, /^Error: Missing matter definition for `jsonml`/)
  })

  await t.test(
    'should throw if given a matter without `type`',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check that the runtime throws too.
        frontmatter({marker: '*'})
      }, /^Error: Missing `type` in matter `{"marker":"\*"}`/)
    }
  )

  await t.test(
    'should throw if given a matter without `marker`',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check that the runtime throws too.
        frontmatter({type: 'jsonml'})
      }, /^Error: Missing `marker` or `fence` in matter `{"type":"jsonml"}`/)
    }
  )

  await t.test(
    'should not support a single yaml fence (thematic break)',
    async function () {
      assert.deepEqual(
        micromark('---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />'
      )
    }
  )

  await t.test('should support empty yaml', async function () {
    assert.deepEqual(
      micromark('---\n---', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      ''
    )
  })

  await t.test('should support yaml w/ content', async function () {
    assert.deepEqual(
      micromark('---\na\n\nb\n---', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      ''
    )
  })

  await t.test('should support content after yaml', async function () {
    assert.deepEqual(
      micromark('---\na\n\nb\n---\n# Heading\n***\n    code', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      '<h1>Heading</h1>\n<hr />\n<pre><code>code\n</code></pre>'
    )
  })

  await t.test('should support toml', async function () {
    assert.deepEqual(
      micromark('+++\na\n\nb\n+++\na\n=', {
        extensions: [frontmatter('toml')],
        htmlExtensions: [frontmatterHtml('toml')]
      }),
      '<h1>a</h1>'
    )
  })

  await t.test(
    'should not support a prefix (indent) before a yaml opening fence',
    async function () {
      assert.deepEqual(
        micromark(' ---\n---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<hr />'
      )
    }
  )

  await t.test(
    'should not support a prefix (indent) before a yaml closing fence',
    async function () {
      assert.deepEqual(
        micromark('---\n ---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<hr />'
      )
    }
  )

  await t.test(
    'should parse an arbitrary suffix after the opening and closing fence of yaml',
    async function () {
      assert.deepEqual(
        micromark('---  \n---\t ', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        ''
      )
    }
  )

  await t.test(
    'should not support other characters after the suffix on the opening fence of yaml',
    async function () {
      assert.deepEqual(
        micromark('--- --\n---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<hr />'
      )
    }
  )

  await t.test(
    'should not support other characters after the suffix on the closing fence of yaml',
    async function () {
      assert.deepEqual(
        micromark('---\n--- x', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<p>--- x</p>'
      )
    }
  )

  await t.test(
    'should not support an opening yaml fence of more than 3 characters',
    async function () {
      assert.deepEqual(
        micromark('----\n---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<hr />'
      )
    }
  )

  await t.test(
    'should not support a closing yaml fence of more than 3 characters',
    async function () {
      assert.deepEqual(
        micromark('---\n----', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<hr />'
      )
    }
  )

  await t.test(
    'should not support an opening yaml fence of less than 3 characters',
    async function () {
      assert.deepEqual(
        micromark('--\n---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<h2>--</h2>'
      )
    }
  )

  await t.test(
    'should not support a closing yaml fence of less than 3 characters',
    async function () {
      assert.deepEqual(
        micromark('---\n--', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<hr />\n<p>--</p>'
      )
    }
  )

  await t.test('should support content in yaml', async function () {
    assert.deepEqual(
      micromark('---\na\nb\n---', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      ''
    )
  })

  await t.test('should support blank lines in yaml', async function () {
    assert.deepEqual(
      micromark('---\na\n\nb\n---', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      ''
    )
  })

  await t.test('should support a custom matter (1)', async function () {
    const options = {type: 'custom', marker: {open: '<', close: '>'}}

    assert.deepEqual(
      micromark('<<<\na\n\nb\n>>>', {
        extensions: [frontmatter(options)],
        htmlExtensions: [frontmatterHtml(options)]
      }),
      ''
    )
  })

  await t.test('should support a custom matter (2)', async function () {
    const options = {type: 'custom', marker: {open: '<', close: '>'}}

    assert.deepEqual(
      micromark('<<<\na\n\nb\n>>>', {
        extensions: [frontmatter(options)],
        htmlExtensions: [frontmatterHtml(options)]
      }),
      ''
    )
  })

  await t.test('should support a custom matter (3)', async function () {
    const json = {type: 'json', fence: {open: '{', close: '}'}}

    assert.deepEqual(
      micromark('{\na\n\nb\n}', {
        extensions: [frontmatter(json)],
        htmlExtensions: [frontmatterHtml(json)]
      }),
      ''
    )
  })

  await t.test(
    'should not support yaml frontmatter in the middle',
    async function () {
      assert.deepEqual(
        micromark('# Hello\n---\na\n\nb\n---\n+++', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<h1>Hello</h1>\n<hr />\n<p>a</p>\n<h2>b</h2>\n<p>+++</p>'
      )
    }
  )

  await t.test('should support custom matters anywhere', async function () {
    const yamlAnywhere = {type: 'yaml', marker: '-', anywhere: true}
    assert.deepEqual(
      micromark('# Hello\n---\na\n\nb\n---\n+++', {
        extensions: [frontmatter(yamlAnywhere)],
        htmlExtensions: [frontmatterHtml(yamlAnywhere)]
      }),
      '<h1>Hello</h1>\n<p>+++</p>'
    )
  })

  await t.test(
    'should prefer anywhere matter that could also be seen as headings (setext)',
    async function () {
      const yamlAnywhere = {type: 'yaml', marker: '-', anywhere: true}
      assert.deepEqual(
        micromark('a\n---\nb\n---', {
          extensions: [frontmatter(yamlAnywhere)],
          htmlExtensions: [frontmatterHtml(yamlAnywhere)]
        }),
        '<p>a</p>\n'
      )
    }
  )

  await t.test(
    'should support two matters w/ the same start, but different ends',
    async function () {
      /** @type {Options} */
      const customAndYaml = [
        {type: 'custom', marker: {open: '-', close: '.'}},
        'yaml'
      ]

      assert.deepEqual(
        micromark('---\nasd\n...', {
          extensions: [frontmatter(customAndYaml)],
          htmlExtensions: [frontmatterHtml(customAndYaml)]
        }),
        ''
      )
    }
  )

  await t.test('should not support frontmatter w/o closing', async function () {
    assert.deepEqual(
      micromark('---\nasd', {
        extensions: [frontmatter()],
        htmlExtensions: [frontmatterHtml()]
      }),
      '<hr />\n<p>asd</p>'
    )
  })

  await t.test(
    'should not support frontmatter in a container (list)',
    async function () {
      assert.deepEqual(
        micromark('* ---\n  asd\n  ---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<ul>\n<li>\n<hr />\n<h2>asd</h2>\n</li>\n</ul>'
      )
    }
  )

  await t.test(
    'should not support frontmatter in a container (block quote)',
    async function () {
      assert.deepEqual(
        micromark('> ---\n  asd\n  ---', {
          extensions: [frontmatter()],
          htmlExtensions: [frontmatterHtml()]
        }),
        '<blockquote>\n<hr />\n</blockquote>\n<h2>asd</h2>'
      )
    }
  )
})
