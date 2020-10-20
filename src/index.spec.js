import { cascadeFind, test as testFn } from '../src'

describe('cascadeFind(test, options, ...args)', () => {
	test('string', () => {
    const options = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
      ['key4', 'value4'],
      ['default value']
    ]

    expect(cascadeFind(testFn, options, 'key3')).toEqual('value3')
    expect(cascadeFind(testFn, options, 'key4')).toEqual('value4')
    expect(cascadeFind(testFn, options, 'key9999')).toEqual('default value')
	})

  test('number', () => {
    const options = [
      [1, 'value1'],
      [2, 'value2'],
      [4, 'value3'],
      [5, 'value4'],
      ['default value']
    ]
    expect(cascadeFind(testFn, options, 1)).toEqual('value1')
    expect(cascadeFind(testFn, options, 3)).toEqual('default value')
    expect(cascadeFind(testFn, options, 1000)).toEqual('default value')
  })

  test('regexp', () => {
    const options = [
      [/^abcde$/, 'value1'],
      [/^abcde/, 'value2'],
      [/^abcd/, 'value3'],
      [/^abc/, 'value4'],
      ['default value']
    ]
    expect(cascadeFind(testFn, options, 'abcde')).toEqual('value1')
    expect(cascadeFind(testFn, options, 'abcdef')).toEqual('value2')
    expect(cascadeFind(testFn, options, 'abcxyz')).toEqual('value4')
    expect(cascadeFind(testFn, options, 'xyz')).toEqual('default value')
  })

  test('function', () => {
    const options = [
      [value => value < 20, '<20'],
      [value => value >= 20 && value < 50, '>=20 && <50'],
      [value => value > 50, '>50']
    ]

    expect(cascadeFind(testFn, options, 19)).toEqual('<20')
    expect(cascadeFind(testFn, options, 20)).toEqual('>=20 && <50')
    expect(cascadeFind(testFn, options, 51)).toEqual('>50')
  })
})
