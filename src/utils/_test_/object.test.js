import test from 'ava';
import { mapObject, filterObject } from '../object';

test('mapObject: map each value of given object', t => {
  const obj = { a: 1, b: 2, c: 3 };
  const actual = mapObject(obj, v => v * 2);
  const expected = { a: 2, b: 4, c: 6 };
  t.deepEqual(actual, expected);
});

test('mapObject: give each key as second argument', t => {
  const obj = { a: 1, b: 2 };
  const actual = mapObject(obj, (v, k) => [v, k]);
  const expected = { a: [1, 'a'], b: [2, 'b'] };
  t.deepEqual(actual, expected);
});

test('filterObject: filter each value of given object', t => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  const actual = filterObject(obj, v => v % 2 === 0);
  const expected = { b: 2, d: 4 };
  t.deepEqual(actual, expected);
});

test('filterObject: give each key as second argument', t => {
  const obj = { a: 1, b: 2 };
  const actual = filterObject(obj, (v, k) => k === 'b');
  const expected = { b: 2 };
  t.deepEqual(actual, expected);
});
