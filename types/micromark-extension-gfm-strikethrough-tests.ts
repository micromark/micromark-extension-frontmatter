import * as syntax from 'micromark-extension-frontmatter'
import micromark from 'micromark'
import * as html from 'micromark-extension-frontmatter/html'

micromark('', {
  extensions: [
    syntax(),
    syntax('yaml'),
    syntax('toml'),
    syntax({type: 'grass', fence: 'bulbasaur'}),
    syntax({type: 'fire', marker: 'charmander'}),
    syntax({type: 'water', fence: 'squirtle', anywhere: true}),
    syntax({type: 'electric', marker: 'pikachu', anywhere: true}),
    syntax({type: 'grass', fence: {open: 'bulbasaur', close: 'venusaur'}}),
    syntax({type: 'fire', marker: {open: 'charmander', close: 'charizard'}}),
    syntax({
      type: 'water',
      fence: {open: 'squirtle', close: 'blastoise'},
      anywhere: true
    }),
    syntax({
      type: 'electric',
      marker: {open: 'pikachu', close: 'raichu'},
      anywhere: true
    }),
    syntax([
      'yaml',
      'toml',
      {type: 'grass', fence: 'bulbasaur'},
      {type: 'fire', marker: 'charmander'},
      {type: 'water', fence: 'squirtle', anywhere: true},
      {type: 'electric', marker: 'pikachu', anywhere: true},
      {type: 'grass', fence: {open: 'bulbasaur', close: 'venusaur'}},
      {type: 'fire', marker: {open: 'charmander', close: 'charizard'}},
      {
        type: 'water',
        fence: {open: 'squirtle', close: 'blastoise'},
        anywhere: true
      },
      {
        type: 'electric',
        marker: {open: 'pikachu', close: 'raichu'},
        anywhere: true
      }
    ])
  ],
  htmlExtensions: [
    html(),
    html('yaml'),
    html('toml'),
    html({type: 'grass', fence: 'bulbasaur'}),
    html({type: 'fire', marker: 'charmander'}),
    html({type: 'water', fence: 'squirtle', anywhere: true}),
    html({type: 'electric', marker: 'pikachu', anywhere: true}),
    html({type: 'grass', fence: {open: 'bulbasaur', close: 'venusaur'}}),
    html({type: 'fire', marker: {open: 'charmander', close: 'charizard'}}),
    html({
      type: 'water',
      fence: {open: 'squirtle', close: 'blastoise'},
      anywhere: true
    }),
    html({
      type: 'electric',
      marker: {open: 'pikachu', close: 'raichu'},
      anywhere: true
    }),
    html([
      'yaml',
      'toml',
      {type: 'grass', fence: 'bulbasaur'},
      {type: 'fire', marker: 'charmander'},
      {type: 'water', fence: 'squirtle', anywhere: true},
      {type: 'electric', marker: 'pikachu', anywhere: true},
      {type: 'grass', fence: {open: 'bulbasaur', close: 'venusaur'}},
      {type: 'fire', marker: {open: 'charmander', close: 'charizard'}},
      {
        type: 'water',
        fence: {open: 'squirtle', close: 'blastoise'},
        anywhere: true
      },
      {
        type: 'electric',
        marker: {open: 'pikachu', close: 'raichu'},
        anywhere: true
      }
    ])
  ]
})
