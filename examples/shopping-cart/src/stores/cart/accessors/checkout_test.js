import test from 'ava';
import sinon from 'sinon';
import { mockQuery, mockCommit } from 'slux/testutils';
import { getState } from 'slux/getters';
import {
  checkout,
  startCheckout,
  finishCheckout,
  restore,
} from './checkout';

test('checkout: clear cart', async t => {
  const query = mockQuery([getState, {}]);

  const commit = mockCommit(
    [startCheckout, sinon.spy()],
    [finishCheckout, sinon.spy()],
    [restore, sinon.spy()]
  );

  const mockShop = {
    buyProducts: () => Promise.resolve(),
  };

  await checkout.with(mockShop)({ query, commit }, []);

  t.deepEqual(
    commit.mocks.map(m => m.callCount),
    [1, 1, 0]
  );
});
