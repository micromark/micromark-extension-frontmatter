import {matters} from './matters.js'

export function frontmatterHtml(options) {
  var settings = matters(options)
  var index = -1
  var enter = {}
  var exit = {}
  var type

  while (++index < settings.length) {
    type = settings[index].type
    enter[type] = start
    exit[type] = end
  }

  return {enter, exit}

  function start() {
    this.buffer()
  }

  function end() {
    this.resume()
    this.setData('slurpOneLineEnding', true)
  }
}
