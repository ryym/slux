export function getter(func) {
  return func.bind(null);
}

export function getterWith(dependency, funcWithoutDep) {
  const func = funcWithoutDep(dependency);
  func.with = funcWithoutDep;
  return func;
}

export function mutation(type, func) {
  const boundFunc = func.bind(null);
  boundFunc.type = type;
  return boundFunc;
}

export function mutationWith(dependency, type, funcWithoutDep) {
  const func = funcWithoutDep(dependency);
  func.with = funcWithoutDep;
  func.type = type;
  return func;
}

export function action(type, func) {
  const boundFunc = func.bind(null);
  boundFunc.type = type;
  return boundFunc;
}

export function actionWith(dependency, type, funcWithoutDep) {
  const func = funcWithoutDep(dependency);
  func.with = funcWithoutDep;
  func.type = type;
  return func;
}
