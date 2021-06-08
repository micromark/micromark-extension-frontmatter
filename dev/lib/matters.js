import {fault} from 'fault'

const own = {}.hasOwnProperty

const markers = {yaml: '-', toml: '+'}

export function matters(options = 'yaml') {
  const results = []
  let index = -1

  // One preset or matter.
  if (!Array.isArray(options)) {
    options = [options]
  }

  while (++index < options.length) {
    results[index] = matter(options[index])
  }

  return results
}

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
