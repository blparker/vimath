import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import utils from '../src/utils';


type Foo = { a: number; b: string; c: boolean; };


test('should extract values from type when all properties are present', () => {
    const o = { a: 1, b: '2', c: true, d: 'foo', e: 3 };
    const extracted = utils.extractType<Foo>(o);

    expect(extracted).toMatchObject({ a: 1, b: '2', c: true });
});


test('should extract values from type when not all properties are present', () => {
    // Missing 'b' and 'c'
    const o = { a: 1, d: 'foo', e: 3 };
    const extracted = utils.extractType<Foo>(o);

    expect(extracted).toMatchObject({ a: 1 });
});
