import EventEmitter from 'events'

export default class ActionState {
  constructor() {
    this._emitter = new EventEmitter()
  }

  emitCommit(type) {
    this._emitter.emit(type)
  }

  onCommit(type, handler) {
    this._emitter.on(type, handler)
  }
}
