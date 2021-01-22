export type Criteria = (
  (...args:any[]) => boolean |
  any
)
export type Alternative = [Criteria, any] | [any]
export type ExecutableAlternative = (
  [Criteria, (...args:any[]) => any] |
  [(...args:any[]) => any]
)

export type TestFunction = (
  criteria:Criteria,
  ...args:any
) => boolean

export const test:TestFunction = (
  criteria,
  ...args
) => {
  return (criteria instanceof RegExp)
    ? typeof args[0] === 'string' && criteria.test(args[0])
    : typeof criteria === 'function'
      ? criteria(...args)
      : criteria === args[0]
}

const _alternativeTest = (
  test:TestFunction,
  alternative:Alternative,
  args:any[]
) => (
  alternative.length === 1 ||
  (
    alternative.length === 2 &&
    test(alternative[0], ...args)
  )
)

const _alternativeValue = (
  alternative:Alternative
) => (
  alternative.length === 1
    ? alternative[0]
    : alternative[1]
)

export const cascadeFind = (
  test:TestFunction,
  alternatives:Alternative[],
  ...args:any[]
):any => {
  const alternative = alternatives
    .find(alternative => _alternativeTest(test, alternative, args))

  return alternative ? _alternativeValue(alternative) : undefined
}

export const cascadeExec = (
  test:TestFunction,
  alternatives:ExecutableAlternative[],
  ...args:any[]
):any => cascadeFind(test, alternatives, ...args)(...args)

export const cascadeFilter = (
  test:TestFunction,
  alternatives:Alternative[],
  ...args:any[]
):any => alternatives.reduce((acc, alternative) => (
  _alternativeTest(test, alternative, args)
    ? [...acc, _alternativeValue(alternative)]
    : acc
), [])
