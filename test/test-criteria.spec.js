import { testCriteria } from '../src'

describe('testCriteria(criteria, ...args)', () => {
  test('function criteria', () => {
    const criteria = (value, option1, option2) => {
      return value === 'some-value' && option1 && option2
    }

    expect(testCriteria(criteria, 'some-value', true, true)).toEqual(true)
    expect(testCriteria(criteria, 'other-value', true, true)).toEqual(false)
  })

  test('query criteria', () => {
    expect(testCriteria({
      roles: [
        'admin',
        'reader'
      ]
    }, {
      roles: ['admin', 'reader']
    }))
    .toEqual(true)

    expect(testCriteria({
      roles: [
        'admin',
        'reader'
      ]
    }, {
      roles: ['admin']
    }))
    .toEqual(false)

    expect(testCriteria({
      roles: {
        $in: ['admin', 'reader']
      }
    }, {
      roles: 'admin'
    }))
    .toEqual(true)

    expect(testCriteria({
      roles: {
        $in: ['admin', 'reader']
      }
    }, {
      roles: 'another-role'
    }))
    .toEqual(false)
  })

  test('regexp criteria', () => {
    const DIGITS_ONLY = /^[0-9]+$/
    expect(testCriteria(DIGITS_ONLY, '123')).toEqual(true)
    expect(testCriteria(DIGITS_ONLY, '123text')).toEqual(false)
    expect(testCriteria(DIGITS_ONLY, { property: 'value' })).toEqual(false)
  })

  test('boolean criteria', () => {
    expect(testCriteria(true, 'ANY-value')).toEqual(true)
    expect(testCriteria(false, 'ANY-value')).toEqual(false)
  })

  test('string criteria', () => {
    expect(testCriteria('some-value', 'some-value')).toEqual(true)
    expect(testCriteria('some-value', 'other-value')).toEqual(false)
  })
})
