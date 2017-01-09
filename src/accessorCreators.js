export const getter = func => {
  return {
    exec: func,
  };
};

export const getterWith = dependency => func => {
  return {
    exec: func(dependency),
    with: func,
  };
};

export const mutation = (type, func) => {
  return {
    type,
    exec: func,
  };
};

export const mutationWith = dependency => (type, func) => {
  return {
    type,
    exec: func(dependency),
    with: func,
  };
};

export const action = (type, func) => {
  return {
    type,
    exec: func,
  };
};

export const actionWith = dependency => (type, func) => {
  return {
    type,
    exec: func(dependency),
    with: func,
  };
};
