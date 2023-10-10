// import { Decimal } from 'decimal.js';
import { Decimal } from '../node_modules/decimal.js/decimal.js';


function decimalToInt(...args: number[]) {
    function shift(x: number) {
        const parts = x.toString().split('.');
        return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
    }

    return args.reduce((p, n) => Math.max(p, shift(n)), -Infinity);
}


export function pSubtract(l: number, r: number) {
    const f = decimalToInt(l, r);
    return (l * f - r * f) / f;
}


export function pAdd(...args: number[]) {
    const f = decimalToInt(...args);
    return args.reduce((acc, v) => acc + f * v, 0) / f;
}


export function pMultiply(...args: number[]) {
    const f = decimalToInt(...args);
    return args.reduce((acc, v) => (acc * f) * (v * f) / (f * f), 1) / f;
}


export function pDivide(l: number, r: number) {
    const f = decimalToInt(l, r);
    return (l * f) / (r * f);
}


export function* zip<T extends any[][]>(...args: T) {
    for (let i = 0; i < Math.min(...args.map((e) => { return e.length })); ++i) {
        yield args.map((e) => { return e[i]; }) as
            { [I in keyof T]: T[I][number] };
    }
}


function standardizeArrays(l: number | number[], r: number | number[]): [number[], number[]] {
    if (!Array.isArray(l)) {
        l = [l];
    }

    if (!Array.isArray(r)) {
        r = [r];
    }

    if (l.length !== r.length) {
        throw new Error('Expected arrays to be of equal length');
    }

    return [l, r];
}


export function subtract(l: number, r: number): number;
export function subtract(l: number[], r: number[]): number[];

export function subtract(l: unknown, r: unknown): unknown {
    /*[l, r] = standardizeArrays(l, r);

    const res = [];

    for (const [a, b] of zip(l, r)) {
        res.push(a - b);
    }

    return res;*/

    if (Array.isArray(l) && Array.isArray(r)) {
        if (l.length !== r.length) {
            throw new Error('Cannot subtract arrays of uneven length');
        }

        const res = [];
        for (const [a, b] of zip(l, r)) {
            res.push(Decimal.sub(a, b).toNumber());
        }
        return res;
    } else if (typeof l === 'number' && typeof r === 'number') {
        return Decimal.sub(l, r).toNumber();
    } else {
        throw new Error('Must subtract elements of common type');
    }
}


export function add(l: number, r: number): number;
export function add(l: number[], r: number[]): number[];

export function add(l: unknown, r: unknown): unknown {
    if (Array.isArray(l) && Array.isArray(r)) {
        if (l.length !== r.length) {
            throw new Error('Cannot add arrays of uneven length');
        }

        const res = [];
        for (const [a, b] of zip(l, r)) {
            // res.push(pAdd(a + b));
            res.push(Decimal.add(a, b).toNumber());
        }
        return res;
    } else if (typeof l === 'number' && typeof r === 'number') {
        // return pAdd(l, r);
        return Decimal.add(l, r).toNumber();
    } else {
        throw new Error('Must add elements of common type');
    }
}


export function mult(l: number, r: number): number {
    return Decimal.mul(l, r).toNumber();
}


export function div(l: number, r: number): number {
    return Decimal.div(l, r).toNumber();
}

// export function add(l: number | number[], r: number | number[]): number[] {
//     [l, r] = standardizeArrays(l, r);

//     const res = [];

//     for (const [a, b] of zip(l, r)) {
//         // res.push(a + b);
//         res.push(pAdd(a, b));
//     }

//     return res;
// }


function toArray(a: number | number[]) {
    return Array.isArray(a) ? a : [a];
}


export function toDecimal(a: number | number[]) {
    return toArray(a).map(v => new Decimal(v));
}


export function scalarMultiply(arr: number[], v: number) {
    // return arr.map(a => pMultiply(a, v))
    return arr.map(a => Decimal.mul(a, v).toNumber());
}


export function lerp(n1: number, n2: number, p: number) {
    return (1 - p) * n1 + p * n2;
}


export function arrLerp(a1: number[], a2: number[], p: number) {
    if (a1.length !== a2.length) {
        throw new Error('Cannot interpolate arrays of differing sizes');
    }

    const res = [];
    for (const [a, b] of zip(a1, a2)) {
        res.push(lerp(a, b, p));
    }
    return res;
}


export function clamp(v: number, min: number = 0, max: number = 1) {
    return Math.min(max, Math.max(min, v));
}


export function invlerp(n1: number, n2: number, v: number) {
    return clamp((v - n1) / (n2 - n1));
}


export function distance(a: number, b: number): number;
export function distance(a: number[], b: number[]): number;
export function distance(a: unknown, b: unknown): number {
    if (Array.isArray(a) && Array.isArray(b)) {
        const [x, y] = subtract(b, a).map(Math.abs);
        return Math.sqrt(add(y * y, x * x));
    } else if (typeof a === 'number' && typeof b === 'number') {
        return Math.abs(Decimal.sub(b, a).toNumber());
    } else {
        throw new Error('Cannot determine distance of unlike elements');
    }
}


export function range(a: [number, number]): number {
    return Math.abs(a[1] - a[0]);
}


/**
 * Given an array, return the mode of the array. If there are multiple symbols
 * with the same count, the first symbol is returned as the mode.
 * @param arr the array to find the mode for
 * @returns the mode of the array (the first mode if there are multiple)
 */
export function mode<T extends number | string | symbol>(arr: T[]): T {
    if (!Array.isArray(arr)) {
        throw new Error('Expected parameter to be an array');
    } else if (arr.length === 0) {
        throw new Error('Cannot take mode of empty array');
    }

    const counts = arr.reduce((counts, e) => {
        if (e in counts) {
            counts[e] = [e, counts[e][1] + 1];
        } else {
            counts[e] = [e, 1];
        }

        return counts;
    }, {} as Record<T, [T, number]>);

    let [maxVal, maxCount] = Object.values(counts)[0] as [T, number];
    for (const [val, count] of Object.values(counts) as [T, number][]) {
        if (count > maxCount) {
            maxCount = count;
            maxVal = val;
        }
    }

    return maxVal;
}


export function numDecimals(val: number): number {
    const vs = val.toString();
    if (!vs.includes('.')) {
        return 0;
    }

    return vs.split('.')[1].length;
}


export function floor(a: number): number;
export function floor(a: number[]): number[];
export function floor(a: unknown): unknown {
    if (Array.isArray(a)) {
        return a.map(Math.floor);
    } else if (typeof a === 'number') {
        return Math.floor(a);
    } else {
        throw new Error('Can only take floor of number and number arrays');
    }
}


export function abs(a: number): number;
export function abs(a: number[]): number[];
export function abs(a: unknown): unknown {
    if (Array.isArray(a)) {
        return a.map(Math.abs);
    } else if (typeof a === 'number') {
        return Math.abs(a);
    } else {
        throw new Error('Can only take absolute value of number and number arrays');
    }
}