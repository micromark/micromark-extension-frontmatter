import {markdownLineEnding, markdownSpace} from 'micromark-util-character'
import {codes} from 'micromark-util-symbol/codes.js'
import {types} from 'micromark-util-symbol/types.js'
import {matters} from './matters.js'

export function frontmatter(options) {
  const settings = matters(options)
  const flow = {}
  let index = -1
  let matter
  let code

  while (++index < settings.length) {
    matter = settings[index]
    code = fence(matter, 'open').charCodeAt(0)
    if (code in flow) {
      flow[code].push(parse(matter))
    } else {
      flow[code] = [parse(matter)]
    }
  }

  return {flow}
}

function parse(matter) {
  const name = matter.type
  const anywhere = matter.anywhere
  const valueType = name + 'Value'
  const fenceType = name + 'Fence'
  const sequenceType = fenceType + 'Sequence'
  const fenceConstruct = {tokenize: tokenizeFence, partial: true}
  let buffer

  return {tokenize: tokenizeFrontmatter, concrete: true}

  function tokenizeFrontmatter(effects, ok, nok) {
    const self = this

    return start

    function start(code) {
      const position = self.now()

      if (position.column !== 1 || (!anywhere && position.line !== 1)) {
        return nok(code)
      }

      effects.enter(name)
      buffer = fence(matter, 'open')
      return effects.attempt(fenceConstruct, afterOpeningFence, nok)(code)
    }

    function afterOpeningFence(code) {
      buffer = fence(matter, 'close')
      return lineEnd(code)
    }

    function lineStart(code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        return lineEnd(code)
      }

      effects.enter(valueType)
      return lineData(code)
    }

    function lineData(code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        effects.exit(valueType)
        return lineEnd(code)
      }

      effects.consume(code)
      return lineData
    }

    function lineEnd(code) {
      // Require a closing fence.
      if (code === codes.eof) {
        return nok(code)
      }

      // Can only be an eol.
      effects.enter(types.lineEnding)
      effects.consume(code)
      effects.exit(types.lineEnding)
      return effects.attempt(fenceConstruct, after, lineStart)
    }

    function after(code) {
      effects.exit(name)
      return ok(code)
    }
  }

  function tokenizeFence(effects, ok, nok) {
    let bufferIndex = 0

    return start

    function start(code) {
      if (code === buffer.charCodeAt(bufferIndex)) {
        effects.enter(fenceType)
        effects.enter(sequenceType)
        return insideSequence(code)
      }

      return nok(code)
    }

    function insideSequence(code) {
      if (bufferIndex === buffer.length) {
        effects.exit(sequenceType)

        if (markdownSpace(code)) {
          effects.enter(types.whitespace)
          return insideWhitespace(code)
        }

        return fenceEnd(code)
      }

      if (code === buffer.charCodeAt(bufferIndex)) {
        effects.consume(code)
        bufferIndex++
        return insideSequence
      }

      return nok(code)
    }

    function insideWhitespace(code) {
      if (markdownSpace(code)) {
        effects.consume(code)
        return insideWhitespace
      }

      effects.exit(types.whitespace)
      return fenceEnd(code)
    }

    function fenceEnd(code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        effects.exit(fenceType)
        return ok(code)
      }

      return nok(code)
    }
  }
}

function fence(matter, prop) {
  let marker

  if (matter.marker) {
    marker = pick(matter.marker, prop)
    return marker + marker + marker
  }

  return pick(matter.fence, prop)
}

function pick(schema, prop) {
  return typeof schema === 'string' ? schema : schema[prop]
}
