
export default function mapObject(o, func) {
  return Object.keys(o).reduce((n, key) => {
    n[key] = func(o[key], key)
    return n
  }, {})
}
