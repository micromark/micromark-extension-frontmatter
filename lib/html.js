import {matters} from './matters.js'

export function frontmatterHtml(options) {
  const settings = matters(options)
  const enter = {}
  const exit = {}
  let index = -1
  let type

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
