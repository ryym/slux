import mapObject from '../mapObject'
import ActionState from './ActionState'
import * as waiters from './waiters'

export const wait = {
  until: waiters.waitAll,
  untilAny: waiters.waitAny,
  commit: waiters.waitCommit,
  timeout: waiters.waitTimeout,
}

export default function waitAction(action, {
  mutations = {}, getters = {}, args = [], wait
}) {
  if (typeof wait !== 'function') {
    throw new Error('waitAction: wait must be a function which returns Promise.')
  }

  const actionState = new ActionState()
  const wrappedMutations = mapObject(mutations, (m, type) => {
    return (...args) => {
      m(...args)
      actionState.emitCommit(type)
    }
  })

  setImmediate(() => {
    action({ mutations: wrappedMutations, getters }, ...args)
  })
  return wait(actionState)
}
