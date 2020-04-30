
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


export function mapHash(input, func) {
  const output = {}

  for (const key in input) {
    if (hasOwnProperty.call(input, key)) {
      output[key] = func(input[key], key)
    }
  }

  return output
}
