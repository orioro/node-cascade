/**
 * Function that returns boolean
 * 
 * @typedef Criteria
 */
export type Criteria = (
  (...args:any[]) => boolean |
  any
)

/**
 * Tuple consisting of either:
 * - `[Criteria, value]`
 * - `[value]`
 * @typedef {[Criteria, any] | [any]} Alternative
 */
export type Alternative = [Criteria, any] | [any]

/**
 * Tuple consisting of either:
 * - `[Criteria, Function]`
 * - `[Function]`
 * @typedef {[Criteria, any] | [any]} Alternative
 */
export type ExecutableAlternative = (
  [Criteria, (...args:any[]) => any] |
  [(...args:any[]) => any]
)

/**
 * Function that interprets a given criteria.
 * Takes as arguments:
 * - {Criteria} criteria
 * - ...args Remaining arguments
 * 
 * @typedef TestFunction
 */
export type TestFunction = (
  criteria:Criteria,
  ...args:any
) => boolean

/**
 * @function test
 * @param {Criteria} criteria
 * @param {...args[]} args
 */
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

/**
 * @function cascadeFind
 * @param {TestFunction} test
 * @param {Alternative[]} alternatives
 * @param {...args[]} args
 * @returns {*}
 */
export const cascadeFind = (
  test:TestFunction,
  alternatives:Alternative[],
  ...args:any[]
):any => {
  const alternative = alternatives
    .find(alternative => _alternativeTest(test, alternative, args))

  return alternative ? _alternativeValue(alternative) : undefined
}

/**
 * @function cascadeExec
 * @param {TestFunction} test
 * @param {ExecutableAlternative[]} alternatives
 * @param {...args[]} args
 * @returns {*}
 */
export const cascadeExec = (
  test:TestFunction,
  alternatives:ExecutableAlternative[],
  ...args:any[]
):any => cascadeFind(test, alternatives, ...args)(...args)

/**
 * @function cascadeFind
 * @param {TestFunction} test
 * @param {Alternative[]} alternatives
 * @param {...args[]} args
 * @returns {*[]}
 */
export const cascadeFilter = (
  test:TestFunction,
  alternatives:Alternative[],
  ...args:any[]
):any => alternatives.reduce((acc, alternative) => (
  _alternativeTest(test, alternative, args)
    ? [...acc, _alternativeValue(alternative)]
    : acc
), [])
