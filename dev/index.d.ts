export {frontmatterHtml} from './lib/html.js'
export {frontmatter} from './lib/syntax.js'
export {toMatters} from './lib/to-matters.js'

/**
 * Sequence.
 *
 * Depending on how this structure is used, it reflects a marker or a fence.
 */
export interface Info {
  /**
   * Closing.
   */
  close: string
  /**
   * Opening.
   */
  open: string
}

/**
 * Fence configuration.
 */
interface FenceFields {
  /**
   * Complete fences.
   *
   * This can be used when fences contain different characters or lengths
   * other than 3.
   * Pass `open` and `close` to interface to specify different characters for opening and
   * closing fences.
   */
  fence: Info | string
  /**
   * If `fence` is set, `marker` must not be set.
   */
  marker?: never
}

/**
 * Marker configuration.
 */
interface MarkerFields {
  /**
   * Character repeated 3 times, used as complete fences.
   *
   * For example the character `'-'` will result in `'---'` being used as the
   * fence
   * Pass `open` and `close` to specify different characters for opening and
   * closing fences.
   */
  marker: Info | string
  /**
   * If `marker` is set, `fence` must not be set.
   */
  fence?: never
}

/**
 * Fields describing a kind of matter.
 */
interface MatterFields {
  /**
   * Node type to tokenize as.
   */
  type: string
  /**
   * Whether matter can be found anywhere in the document, normally, only matter
   * at the start of the document is recognized.
   *
   * > 👉 **Note**: using this is a terrible idea.
   * > It’s called frontmatter, not matter-in-the-middle or so.
   * > This makes your markdown less portable.
   */
  anywhere?: boolean | null | undefined
}

/**
 * Fields describing a kind of matter.
 *
 * > 👉 **Note**: using `anywhere` is a terrible idea.
 * > It’s called frontmatter, not matter-in-the-middle or so.
 * > This makes your markdown less portable.
 *
 * > 👉 **Note**: `marker` and `fence` are mutually exclusive.
 * > If `marker` is set, `fence` must not be set, and vice versa.
 */
export type Matter =
  | (MatterFields & FenceFields)
  | (MatterFields & MarkerFields)

/**
 * Configuration.
 */
export type Options = Matter | Preset | Array<Matter | Preset>

/**
 * Known name of a frontmatter style.
 */
export type Preset = 'toml' | 'yaml'
