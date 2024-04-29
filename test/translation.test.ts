import { test, vi } from 'vitest';
import { Translation } from '../src/translation';


const width = 320;
const height = 200;
const padding = 20;

const units = (width - 2 * padding) / 14;

const canvas = {
    width: () => width,
    height: () => height,
};



test('translate from relative to absolute units', ({ expect }) => {
    const translation = new Translation(canvas);

    expect(translation.translateRelative(0, 0)).toEqual([width / 2, height / 2]);

    // Edges
    expect(translation.translateRelative(-7, 0)).toEqual([padding, height / 2]);
    expect(translation.translateRelative(7, 0)).toEqual([width - padding, height / 2]);
    expect(translation.translateRelative(0, 4)).toEqual([width / 2, padding]);
    expect(translation.translateRelative(0, -4)).toEqual([width / 2, height - padding]);

    // Non-edges
    expect(translation.translateRelative(-2, 2)).toEqual([width / 2 - 2 * units, height / 2 - 2 * units]);
    expect(translation.translateRelative(2, -2)).toEqual([width / 2 + 2 * units, height / 2 + 2 * units]);
});


test('translate from absolute to relative units', ({ expect }) => {
    const translation = new Translation(canvas);

    expect(translation.translateAbsolute(width / 2, height / 2)).toEqual([0, 0]);

    expect(translation.translateAbsolute(padding, height / 2)).toEqual([-7, 0]);
    expect(translation.translateAbsolute(width - padding, height / 2)).toEqual([7, 0]);
    expect(translation.translateAbsolute(width / 2, padding)).toEqual([0, 4]);
    expect(translation.translateAbsolute(width / 2, height - padding)).toEqual([0, -4]);

    expect(translation.translateAbsolute(width / 2 - 2 * units, height / 2 - 2 * units)).toEqual([-2, 2]);
    expect(translation.translateAbsolute(width / 2 + 2 * units, height / 2 + 2 * units)).toEqual([2, -2]);
});
