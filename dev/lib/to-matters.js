/**
 * @import {Matter, Options, Preset} from 'micromark-extension-frontmatter'
 */

import {fault} from 'fault'

const own = {}.hasOwnProperty
const markers = {yaml: '-', toml: '+'}

/**
 * Simplify options by normalizing them to an array of matters.
 *
 * @param {Options | null | undefined} [options='yaml']
 *   Configuration (default: `'yaml'`).
 * @returns {Array<Matter>}
 *   List of matters.
 */
export function toMatters(options) {
  /** @type {Array<Matter>} */
  const result = []
  let index = -1

  /** @type {Array<Matter | Preset>} */
  const presetsOrMatters = Array.isArray(options)
    ? options
    : options
      ? [options]
      : ['yaml']

  while (++index < presetsOrMatters.length) {
    result[index] = matter(presetsOrMatters[index])
  }

  return result
}

/**
 * Simplify an option.
 *
 * @param {Matter | Preset} option
 *   Configuration.
 * @returns {Matter}
 *   Matter.
 */
function matter(option) {
  let result = option

  if (typeof result === 'string') {
    if (!own.call(markers, result)) {
      throw fault('Missing matter definition for `%s`', result)
    }

    result = {type: result, marker: markers[result]}
  } else if (typeof result !== 'object') {
    throw fault('Expected matter to be an object, not `%j`', result)
  }

  if (!own.call(result, 'type')) {
    throw fault('Missing `type` in matter `%j`', result)
  }

  if (!own.call(result, 'fence') && !own.call(result, 'marker')) {
    throw fault('Missing `marker` or `fence` in matter `%j`', result)
  }

  return result
}
