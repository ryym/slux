import { decomposeMockConfig } from './utils';

/**
 * @example
 *   mockQuery([getFoo, 123], [getBar, sinon.spy()])
 */
const makeMockApplier = (...pairs) => {
  const { accessors, mocks } = decomposeMockConfig(pairs);

  const mockApplier = (accessor, payload) => {
    const idx = accessors.indexOf(accessor);
    if (idx < 0) {
      throw new Error(`Slux(testutils): Not registered accessor: ${accessor.toString()}`);
    }
    return mocks[idx](payload);
  };
  mockApplier.mocks = mocks;

  return mockApplier;
};

export const mockQuery = makeMockApplier;
export const mockCommit = makeMockApplier;
export const mockRun = makeMockApplier;
