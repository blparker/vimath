import { describe, test, expect } from 'vitest';
import { parseColor, Colors, } from '../src/colors';


describe('colors module', function() {

    test('should parse standard hex colors', () => {
        expect(parseColor('#ffffff')).toEqual([255, 255, 255, 1.0]);
        expect(parseColor('#ff0000')).toEqual([255, 0, 0, 1.0]);
        expect(parseColor('#ff7700')).toEqual([255, 119, 0, 1.0]);
    });


    test('should parse hex colors with alpha', () => {
        expect(parseColor('#ffffffff')).toEqual([255, 255, 255, 1.0]);
        expect(parseColor('#ffffff00')).toEqual([255, 255, 255, 0]);
        expect(parseColor('#ffffff80')).toEqual([255, 255, 255, 0.5]);
    });


    test('should parse rgb values', () => {
        expect(parseColor('rgb(0, 0, 0)')).toEqual([0, 0, 0, 1.0]);
        expect(parseColor('rgb(20, 40, 60)')).toEqual([20, 40, 60, 1.0]);
    });


    test('should parse rgba values', () => {
        expect(parseColor('rgb(0, 0, 0, 0.5)')).toEqual([0, 0, 0, 0.5]);
        expect(parseColor('rgb(20, 40, 60, 0)')).toEqual([20, 40, 60, 0]);
    });


    test('it should return color from HTML color', () => {
        expect(parseColor('blue')).toEqual([0, 0, 255, 1.0]);
    });

    test('it should return color with alpha', () => {
        expect(Colors.black({ opacity: 0.5 })).toEqual([26, 26, 26, 0.5]);
    });

    test('it should allow a color without any config', () => {
        expect(Colors.black()).toEqual([26, 26, 26, 1.0]);
    });
});
