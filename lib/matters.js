module.exports = matters

var fault = require('fault')

var own = {}.hasOwnProperty

var markers = {yaml: '-', toml: '+'}

function matters(options = 'yaml') {
  var results = []
  var index = -1

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
  var result = option

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
