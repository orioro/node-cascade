import { findMatching } from '../src'

describe('findMatching(options, ...args)', () => {
  test('basic', () => {
    const options = [
      {
        criteria: (...args) => {
          return args.length === 2
        },
        value: 'has-two-options',
      },
      {
        criteria: option => {
          return option === 'option-1'
        },
        value: 'value-for-option-1'
      },
      {
        criteria: option => {
          return option === 'option-2'
        },
        value: 'value-for-option-2'
      }
    ]

    expect(findMatching(options, 'option-1', 'option-2')).toEqual('has-two-options')
    expect(findMatching(options, 'option-1')).toEqual('value-for-option-1')
    expect(findMatching(options, 'option-2')).toEqual('value-for-option-2')
    expect(findMatching(options, 'option-123')).toEqual(undefined)
  })
})
