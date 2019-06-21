import mingo from 'mingo'

const switchType = (value, fns) => {
  if (Array.isArray(value)) {
    return fns.array ? fns.array() : fns.default()
  } else if (value instanceof RegExp) {
    return fns.regexp ? fns.regexp() : fns.default()
  } else {
    switch (typeof value) {
      case 'function':
        return fns.function ? fns.function() : fns.default()
      case 'boolean':
        return fns.boolean ? fns.boolean() : fns.default()
      case 'string':
        return fns.string ? fns.string() : fns.default()
      case 'number':
        return fns.number ? fns.number() : fns.default()
      case 'object':
        return fns.object ? fns.object() : fns.default()
      default:
        return fns.default()
    }
  }
}

export const testCriteria = (criteria, ...args) => {
  return switchType(criteria, {
    array: () => {
      return criteria.every((crit, index) => testCriteria(crit, args[index]))
    },
    regexp: () => {
      return typeof args[0] === 'string' && criteria.test(args[0])
    },
    object: () => {
      return (new mingo.Query(criteria)).test(args[0])
    },
    function: () => {
      return criteria(...args)
    },
    boolean: () => {
      return criteria
    },
    default: () => {
      return criteria === args[0]
    }
  })
}

export const findMatching = (options, ...args) => {
  const matching = options.find(option => testCriteria(option.criteria, ...args))

  return matching ? matching.value : undefined
}

export const filterMatching = (options, ...args) => {
  return options.reduce((matching, option) => {
    return testCriteria(option.criteria, ...args) ? [...matching, option.value] : matching
  }, [])
}

export const executeMatching = (options, ...args) => {
  const matchingFn = findMatching(options, ...args)

  if (!matchingFn) {
    throw new Error('No matching function found')
  } else {
    return matchingFn(...args)
  }
}

export const executeMatchingReduce = (options, start, ...injectedArgs) => {
  return options.reduce((acc, option) => {
    return testCriteria(option.criteria, start, ...injectedArgs) ?
      option.value(acc, ...injectedArgs) :
      acc
  }, start)
}

export const executeMatchingReduceAsync = (options, start, ...injectedArgs) => {
  return options.reduce((previousPromise, option) => {
    return previousPromise.then(acc => {
      return testCriteria(option.criteria, acc, ...injectedArgs) ?
        option.value(acc, ...injectedArgs) :
        acc
    })
  }, Promise.resolve(start))
}
