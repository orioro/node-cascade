import {
  executeMatchingReduceAsync
} from '../src'

describe('executeMatchingReduceAsync(fnSpecs, arg)', () => {
  const delay = (response, timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve.bind(null, response), timeout)
    })
  }

  test('Should apply matching specs in sequence in asynchronous style', () => {
    expect.assertions(3)

    const FN_SPECS = [
      {
        criteria: {
          required: true
        },
        value: data => {
          return delay({
            ...data,
            _validate: data._validate ? {
              ...data._validate,
              presence: true,
            } : {
              presence: true
            }
          }, 50)
        }
      },
      {
        criteria: {
          type: 'text',
        },
        value: data => {
          return delay({
            ...data,
            minLength: 10,
            maxLength: 20
          }, 50)
        }
      }
    ]

    return Promise.all([
      // Both changes
      expect(executeMatchingReduceAsync(FN_SPECS, {
        type: 'text',
        required: true,
        value: 'Hello World'
      }))
      .resolves.toEqual({
        type: 'text',
        value: 'Hello World',
        required: true,
        _validate: {
          presence: true
        },
        minLength: 10,
        maxLength: 20
      }),

      // Only second
      expect(executeMatchingReduceAsync(FN_SPECS, {
        type: 'text',
        required: false,
        value: 'Hello World'
      }))
      .resolves.toEqual({
        type: 'text',
        value: 'Hello World',
        required: false,
        minLength: 10,
        maxLength: 20
      }),

      // No changes
      expect(executeMatchingReduceAsync(FN_SPECS, {
        type: 'number',
        required: false,
        value: 30
      }))
      .resolves.toEqual({
        type: 'number',
        required: false,
        value: 30
      })
    ])
  })
})
