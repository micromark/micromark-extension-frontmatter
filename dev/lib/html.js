/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').Handle} Handle
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 * @typedef {import('../matters.js').Options} Options
 */

import {matters} from '../matters.js'

/**
 * Add support for turning frontmatter in markdown to HTML.
 *
 * Function that can be called to get an HTML extension for micromark (passed
 * in `htmlExtensions`).
 *
 * This makes sure nothing is generated for frontmatter.
 *
 * Supports YAML by default.
 * Can be configured to support other things.
 *
 * @param {Options} [options='yaml']
 *   Configuration (optional).
 * @returns {HtmlExtension}
 *   HTML extension for micromark (passed in `htmlExtensions`).
 */
export function frontmatterHtml(options) {
  const settings = matters(options)
  /** @type {HtmlExtension['enter']} */
  const enter = {}
  /** @type {HtmlExtension['exit']} */
  const exit = {}
  let index = -1

  while (++index < settings.length) {
    const type = settings[index].type
    enter[type] = start
    exit[type] = end
  }

  return {enter, exit}

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function start() {
    this.buffer()
  }

  /**
   * @this {CompileContext}
   * @type {Handle}
   */
  function end() {
    this.resume()
    this.setData('slurpOneLineEnding', true)
  }
}
