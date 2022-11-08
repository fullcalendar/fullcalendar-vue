
// TODO: add types!

/*
works with objects and arrays
*/
export function shallowCopy(val: any) {
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      val = Array.prototype.slice.call(val)
    } else if (val) { // non-null
      val = { ...val }
    }
  }

  return val
}
