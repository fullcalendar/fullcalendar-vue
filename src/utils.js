
/*
works with objects and arrays
*/
export function shallowCopy(val) {
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      val = Array.prototype.slice.call(val)
    } else if (val) { // non-null
      val = { ...val }
    }
  }

  return val
}


export function diffProps(oldProps, newProps) {
  let updates = {}
  let removals = []
  let anyChanges = false

  for (let propName in newProps) {
    if (newProps[propName] !== oldProps[propName]) {
      updates[propName] = newProps[propName]
      anyChanges = true
    }
  }

  for (let propName in oldProps) {
    if (!(propName in newProps)) {
      removals.push(propName)
      anyChanges = true
    }
  }

  return { updates, removals, anyChanges }
}


export function mapHash(input, func) {
  const output = {}

  for (const key in input) {
    if (hasOwnProperty.call(input, key)) {
      output[key] = func(input[key], key)
    }
  }

  return output
}
