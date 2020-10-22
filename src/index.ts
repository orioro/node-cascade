export type Criteria = (...args:any[]) => boolean | any
export type Option = [Criteria, any] | [any]

export const test = (criteria, ...args) => {
  return (criteria instanceof RegExp)
    ? typeof args[0] === 'string' && criteria.test(args[0])
    : typeof criteria === 'function'
      ? criteria(...args)
      : criteria === args[0]
}

const _optionTest = (test, option, args) => (
  option.length === 1 ||
  (
    option.length === 2 &&
    test(option[0], ...args)
  )
)

const _optionValue = (option) => option.length === 1 ? option[0] : option[1]

export const cascadeFind = (test, options, ...args) => {
  const option = options.find(option => _optionTest(test, option, args))

  return option ? _optionValue(option) : undefined
}

export const cascadeExec = (test, options, ...args) => (
  cascadeFind(test, options, ...args)(...args)
)

export const cascadeFilter = (test, options, ...args) => (
  options.reduce((acc, option) => (
    _optionTest(test, option, args)
      ? [...acc, _optionValue(option)]
      : acc
  ), [])
)
