import { decomposeMockConfig } from './utils';

/**
 * @example
 *   mockCombinedQuery()
 *     .define(foo, [ [getA, "a"], [getB, "b"] ])
 *     .define(bar, [ [getC, c => c * 2] ])
 */
const makeMockApplier = () => {
  const pairsPerStore = [];
  const stores = [];

  const findMocks = store => {
    const idx = stores.indexOf(store);
    if (idx < 0) {
      throw new Error(`Slux: testutils: Not registered store: ${store}`);
    }
    return pairsPerStore[idx];
  };

  const mockApplier = (store, accessor, payload) => {
    const { accessors, mocks } = findMocks(store);
    const idx = accessors.indexOf(accessor);
    if (idx < 0) {
      throw new Error(`Slux: testutils: Not registered accessor: ${accessor.toString()}`);
    }
    return mocks[idx](payload);
  };

  mockApplier.define = (store, pairs) => {
    const { accessors, mocks } = decomposeMockConfig(pairs);
    pairsPerStore.push({ accessors, mocks });
    stores.push(store);
    return mockApplier;
  };

  return mockApplier;
};

export const mockCombinedQuery = makeMockApplier;
export const mockCombinedCommit = makeMockApplier;
export const mockCombinedRun = makeMockApplier;
