import { cascadeFind, cascadeExec, test as testFn } from '../src'

describe('cascadeFind(test, alternatives, ...args)', () => {
  test('string', () => {
    const alternatives = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
      ['key4', 'value4'],
      ['default value'],
    ]

    expect(cascadeFind(testFn, alternatives, 'key3')).toEqual('value3')
    expect(cascadeFind(testFn, alternatives, 'key4')).toEqual('value4')
    expect(cascadeFind(testFn, alternatives, 'key9999')).toEqual(
      'default value'
    )
  })

  test('number', () => {
    const alternatives = [
      [1, 'value1'],
      [2, 'value2'],
      [4, 'value3'],
      [5, 'value4'],
      ['default value'],
    ]
    expect(cascadeFind(testFn, alternatives, 1)).toEqual('value1')
    expect(cascadeFind(testFn, alternatives, 3)).toEqual('default value')
    expect(cascadeFind(testFn, alternatives, 1000)).toEqual('default value')
  })

  test('regexp', () => {
    const alternatives = [
      [/^abcde$/, 'value1'],
      [/^abcde/, 'value2'],
      [/^abcd/, 'value3'],
      [/^abc/, 'value4'],
      ['default value'],
    ]
    expect(cascadeFind(testFn, alternatives, 'abcde')).toEqual('value1')
    expect(cascadeFind(testFn, alternatives, 'abcdef')).toEqual('value2')
    expect(cascadeFind(testFn, alternatives, 'abcxyz')).toEqual('value4')
    expect(cascadeFind(testFn, alternatives, 'xyz')).toEqual('default value')
  })

  test('function', () => {
    const alternatives = [
      [(value) => value < 20, '<20'],
      [(value) => value >= 20 && value < 50, '>=20 && <50'],
      [(value) => value > 50, '>50'],
    ]

    expect(cascadeFind(testFn, alternatives, 19)).toEqual('<20')
    expect(cascadeFind(testFn, alternatives, 20)).toEqual('>=20 && <50')
    expect(cascadeFind(testFn, alternatives, 51)).toEqual('>50')
  })
})

test('cascadeExec(test, alternatives, ...args)', () => {
  const alternatives = [
    [
      (item) => item.type === 'book',
      (item) => `${item.title} - por ${item.authors.join(' e ')}`,
    ],
    [
      (item) => item.type === 'plant',
      (item) => `${item.name} (${item.scientificName})`,
    ],
    [
      (item) => item.type === 'person',
      (item) =>
        `${item.firstName} ${item.middleName} ${item.lastName}, ${item.profession}`,
    ],
    [(item) => `Unknown: ${item.name || item.title}`],
  ]

  const summarize = (item) => cascadeExec(testFn, alternatives, item)

  expect(
    summarize({
      type: 'book',
      title: 'Psicogênese da Língua Escrita',
      authors: ['Emília Ferreiro', 'Ana Teberosky'],
    })
  ).toEqual(
    'Psicogênese da Língua Escrita - por Emília Ferreiro e Ana Teberosky'
  )

  expect(
    summarize({
      type: 'plant',
      name: 'Samambaiaçu',
      scientificName: 'Dicksonia sellowiana',
    })
  ).toEqual('Samambaiaçu (Dicksonia sellowiana)')

  expect(
    summarize({
      type: 'person',
      firstName: 'João',
      lastName: 'Nunes',
      middleName: 'Silveira',
      profession: 'Desenvolvedor de software',
    })
  ).toEqual('João Silveira Nunes, Desenvolvedor de software')

  expect(
    summarize({
      type: 'something_else',
      title: 'Something else',
    })
  ).toEqual('Unknown: Something else')
})
