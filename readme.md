# cascade

Small set of utility functions that help implement conditional selection/execution
of options/functions. Summary:
- Provide a set of ordered alternatives
- Each alternative consists of a `criteria` and a `value`
- For each alternative, test the criteria against a given `input` and find the
  corresponding `value`

It's like a `switch` statement that the `cases` are provided through an array of
alternatives.

## Executing corresponding function

```js
import { [test](#testcriteria-args), [cascadeExec](#cascadeexectest-alternatives-args) } from '@orioro/cascade'

const alternatives = [
  [
    item => item.type === 'book',
    item => `${item.title} - por ${item.authors.join(' e ')}`
  ],
  [
    item => item.type === 'plant',
    item => `${item.name} (${item.scientificName})`
  ],
  [
    item => item.type === 'person',
    item => `${item.firstName} ${item.middleName} ${item.lastName}, ${item.profession}`
  ],
  [
    item => `Unknown: ${(item.name || item.title)}`
  ]
]

const summarize = item => cascadeExec(testFn, alternatives, item)

console.log(summarize({
  type: 'book',
  title: 'Psicogênese da Língua Escrita',
  authors: ['Emília Ferreiro', 'Ana Teberosky']
}))
// 'Psicogênese da Língua Escrita - por Emília Ferreiro e Ana Teberosky'

console.log(summarize({
  type: 'plant',
  name: 'Samambaiaçu',
  scientificName: 'Dicksonia sellowiana'
}))
// 'Samambaiaçu (Dicksonia sellowiana)'

console.log(summarize({
  type: 'person',
  firstName: 'João',
  lastName: 'Nunes',
  middleName: 'Silveira',
  profession: 'Desenvolvedor de software'
}))
// 'João Silveira Nunes, Desenvolvedor de software'

console.log(summarize({
  type: 'something_else',
  title: 'Something else'
}))
// 'Unknown: Something else'
```

## Purpose

This pattern is geared towards allowing developers to expose APIs that allow users
to compose and customize an algorithm's behavior. Lib developers can provide some
built-in alternatives that resolve common situations and allow users to provide
additional alternatives to solve domain-specific requirements.

Example usage at:
- https://github.com/orioro/node-tree-source-nodes
- https://github.com/orioro/node-nested-map

## API

- [`Criteria`](#criteria)
- [`Alternative`](#alternative)
- [`Alternative`](#alternative)
- [`TestFunction`](#testfunction)
- [`test(criteria, args)`](#testcriteria-args)
- [`cascadeFind(test, alternatives, args)`](#cascadefindtest-alternatives-args)
- [`cascadeExec(test, alternatives, args)`](#cascadeexectest-alternatives-args)
- [`cascadeFind(test, alternatives, args)`](#cascadefindtest-alternatives-args)

##### `Criteria`

Function that returns boolean



##### `Alternative`

Tuple consisting of either:
- `[Criteria, value]`
- `[value]`



##### `Alternative`

Tuple consisting of either:
- `[Criteria, Function]`
- `[Function]`



##### `TestFunction`

Function that interprets a given criteria.
Takes as arguments:
- {[Criteria](#criteria)} criteria
- ...args Remaining arguments



##### `test(criteria, args)`

- `criteria` {[Criteria](#criteria)}
- `args` {...args[]}

##### `cascadeFind(test, alternatives, args)`

- `test` {[TestFunction](#[test](#testcriteria-args)function)}
- `alternatives` {[[Alternative](#alternative)](#alternative)[]}
- `args` {...args[]}
- Returns: {*} 

##### `cascadeExec(test, alternatives, args)`

- `test` {[TestFunction](#[test](#testcriteria-args)function)}
- `alternatives` {Executable[[Alternative](#alternative)](#alternative)[]}
- `args` {...args[]}
- Returns: {*} 

##### `cascadeFind(test, alternatives, args)`

- `test` {[TestFunction](#[test](#testcriteria-args)function)}
- `alternatives` {[[Alternative](#alternative)](#alternative)[]}
- `args` {...args[]}
- Returns: {*[]}
