export const decomposeMockConfig = pairs => {
  return pairs.reduce((acc, [accessor, mock]) => {
    acc.accessors.push(accessor);
    acc.mocks.push(typeof mock === 'function' ? mock : () => mock);
    return acc;
  }, { accessors: [], mocks: [] });
};
