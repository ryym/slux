// Use immutable js

export default class KeyNormalizable {
  constructor(normalizeKey) {
    this._normalizeKey = normalizeKey
    this._data = {}
  }

  get(key) {
    return this._data[this._normalizeKey(key)]
  }

  set(key, value) {
    this._data[this._normalizeKey(key)] = value
  }

  update(rawKey, update, notSetValue) {
    const key = this._normalizeKey(rawKey)
    if (! this._data.hasOwnProperty(key)) {
      this._data[key] = notSetValue
    }
    this._data[key]= update(this._data[key])
  }

  manipulateRawObject(manipulate) {
    this._data = manipulate(this._data)
  }

  getRawObject() {
    return this._data
  }
}
