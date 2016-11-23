export const waitAll = (...waiters) => actionState => {
  return Promise.all(waiters.map(w => w(actionState)))
}

export const waitAny = (...waiters) => actionState => {
  return Promise.race(waiters.map(w => w(actionState)))
}

export const waitCommit = (expectedType, expectedCount = 1) => actionState => {
  if (typeof expectedType === 'undefined') {
    throw new Error('The expected commit type is undefined.')
  }
  if (typeof expectedType === 'function') {
    expectedType = expectedType.name
  }

  return new Promise(resolve => {
    let nCommits = 0
    actionState.onCommit(expectedType, () => {
      nCommits += 1
      if (nCommits >= expectedCount) {
        resolve()
      }
    })
  })
}

export const waitTimeout = timeout => () => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}
