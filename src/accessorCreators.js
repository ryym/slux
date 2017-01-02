export function getter(func) {
  return {
    exec: func,
  };
}

export function getterWith(dependency, funcWithoutDep) {
  return {
    exec: funcWithoutDep(dependency),
    with: funcWithoutDep,
  };
}

export function mutation(type, func) {
  return {
    type,
    exec: func,
  };
}

export function mutationWith(dependency, type, func) {
  return {
    type,
    exec: func(dependency),
    with: func,
  };
}

export function action(type, func) {
  return {
    type,
    exec: func,
  };
}

export function actionWith(dependency, type, func) {
  return {
    type,
    exec: func(dependency),
    with: func,
  };
}
