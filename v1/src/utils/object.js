/**
 * Transform each value of the given object
 * and return a new object.
 */
export function mapObject(obj, transform) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = transform(obj[key], key);
    return newObj;
  }, {});
}

/**
 * Filter each value of the given object
 * and return a new object.
 */
export function filterObject(obj, filter) {
  return Object.keys(obj).reduce((newObj, key) => {
    const value = obj[key];
    if (filter(value, key)) {
      newObj[key] = value;
    }
    return newObj;
  }, {});
}
