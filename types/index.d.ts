// TypeScript Version: 4.0

import {SyntaxExtension} from 'micromark/dist/shared-types'

/**
 * Support frontmatter (YAML, TOML, and more).
 *
 * The exports are functions that can be called with options and return extensions
 * for the micromark parser (to tokenize frontmatter; can be passed in
 * `extensions`) and the default HTML compiler (to ignore frontmatter; can be
 * passed in `htmlExtensions`).
 *
 * @param options One preset or Matter, or an array of them, defining all the
 * supported frontmatters (default: `'yaml'`).
 */
declare function syntax(
  options?: syntax.FrontmatterOptions | syntax.FrontmatterOptions[]
): SyntaxExtension

declare namespace syntax {
  interface Fence {
    open: string
    close: string
  }

  interface Matter {
    /**
     * Type to tokenize as.
     */
    type: string

    /**
     * If `true`, matter can be found anywhere in the document. If `false`, only
     * matter at the start of the document is recognized.
     *
     * @default false
     */
    anywhere?: boolean
  }

  interface MarkerMatter extends Matter {
    /**
     * Character used to construct fences. By providing an object with `open`
     * and `close`. different characters can be used for opening and closing
     * fences. For example the character `'-'` will result in `'---'` being
     * used as the fence.
     */
    marker: Fence | string
  }

  interface FenceMatter extends Matter {
    /**
     * String used as the complete fence. By providing an object with `open`
     * and `close` different values can be used for opening and closing fences.
     * This can be used too if fences contain different characters or lengths
     * other than 3.
     */
    fence: Fence | string
  }

  type FrontmatterOptions = 'yaml' | 'toml' | MarkerMatter | FenceMatter
}

export = syntax
