import test from 'ava';
import { bindMethodContext } from '../class';

test('bindMethodContext: bind specified method context', t => {
  class Foo {
    constructor() {
      bindMethodContext(this, ['getThis']);
    }
    getThis() {
      return this;
    }
    getUnboundThis() {
      return this;
    }
  }
  const foo = new Foo();

  const getThis = foo.getThis;
  t.is(getThis(), foo);

  const getUnboundThis = foo.getUnboundThis;
  t.is(getUnboundThis(), undefined);
});
