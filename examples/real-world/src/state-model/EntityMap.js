
export const normalizeKey = key => key && key.toLowerCase()

export default class EntityMap extends KeyNormalizable {
  constructor() {
    super(normalizeKey)
  }
}
