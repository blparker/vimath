// import { describe, expect, test } from '@jest/globals';
// import { describe, expect, test } from '../node_modules/@jest/globals/build/index';
import { Square } from '../src/shapes/base_shapes';
import { Text } from '../src/shapes/text';
import { RIGHT, LEFT, UP, DOWN } from '../src/base';
import { TestTextMetrics } from './utils';


describe('text module', function() {
    test('should measure text', () => {
        // Measured in https://codepen.io/taxproper-bryan/pen/ZEVLEjL?editors=1111
        // const text = new Text({ text: 'Hello world', textMetrics: new TestTextMetrics(105.23332977294922, 15.419921875) });
        const text = new Text({ text: 'Hello world', textMetrics: new TestTextMetrics(100, 10) });

        const width = 1.7073170731707317;
        const height = 0.17391304347826086;

        // expect(text.width()).toBeCloseTo(105.23332977294922);
        // expect(text.height()).toBeCloseTo(15.419921875);
        expect(text.width()).toBeCloseTo(width);
        expect(text.height()).toBeCloseTo(height);
    });

    test('should measure text with different alignments', () => {
        const width = 1.7073170731707317;
        const height = 0.17391304347826086;

        const lText = new Text({ text: 'Hello world', align: 'left', textMetrics: new TestTextMetrics(100, 10) });
        expect(lText.width()).toBeCloseTo(width);
        expect(lText.height()).toBeCloseTo(height);

        const rText = new Text({ text: 'Hello world', align: 'right', textMetrics: new TestTextMetrics(100, 10) });
        expect(rText.width()).toBeCloseTo(width);
        expect(rText.height()).toBeCloseTo(height);

        const tText = new Text({ text: 'Hello world', baseline: 'top', textMetrics: new TestTextMetrics(100, 10) });
        expect(tText.width()).toBeCloseTo(width);
        expect(tText.height()).toBeCloseTo(height);

        const bText = new Text({ text: 'Hello world', baseline: 'bottom', textMetrics: new TestTextMetrics(100, 10) });
        expect(bText.width()).toBeCloseTo(width);
        expect(bText.height()).toBeCloseTo(height);
    });

    test('should get sides of text centered at origin', () => {
        const text = new Text({ text: 'Hello world', textMetrics: new TestTextMetrics(100, 10) });

        // According to the above test
        const width = 1.7073170731707317;
        const height = 0.17391304347826086;

        expect(text.left()).toEqual([-(width / 2), 0]);
        expect(text.right()).toEqual([(width / 2), 0]);
        expect(text.top()).toEqual([0, (height / 2)]);
        expect(text.bottom()).toEqual([0, -(height / 2)]);
    });

    test('should get sides of text centered non-origin', () => {
        const text = new Text({ text: 'Hello world', x: 1, y: 1, textMetrics: new TestTextMetrics(100, 10) });

        // According to the above test
        const width = 1.7073170731707317;
        const height = 0.17391304347826086;

        expect(text.left()).toEqual([1 - (width / 2), 1]);
        expect(text.right()).toEqual([1 + (width / 2), 1]);
        expect(text.top()).toEqual([1, 1 + (height / 2)]);
        expect(text.bottom()).toEqual([1, 1 - (height / 2)]);
    });

    test('should get sides of text left aligned, center baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'left', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([0, 0]);
        expect(text.right()).toEqual([width, 0]);
        expect(text.top()).toEqual([width / 2, height / 2]);
        expect(text.bottom()).toEqual([width / 2, -height / 2]);
    });

    test('should get sides of text left aligned, top baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'left', baseline: 'top', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([0, -height / 2]);
        expect(text.right()).toEqual([width, -height / 2]);
        expect(text.top()).toEqual([width / 2, 0]);
        expect(text.bottom()).toEqual([width / 2, -height]);
    });

    test('should get sides of text left aligned, bottom baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'left', baseline: 'bottom', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([0, height / 2]);
        expect(text.right()).toEqual([width, height / 2]);
        expect(text.top()).toEqual([width / 2, height]);
        expect(text.bottom()).toEqual([width / 2, 0]);
    });

    test('should get sides of text right aligned, center baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'right', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([-width, 0]);
        expect(text.right()).toEqual([0, 0]);
        expect(text.top()).toEqual([-width / 2, height / 2]);
        expect(text.bottom()).toEqual([-width / 2, -height / 2]);
    });

    test('should get sides of text right aligned, top baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'right', baseline: 'top', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([-width, -height / 2]);
        expect(text.right()).toEqual([0, -height / 2]);
        expect(text.top()).toEqual([-width / 2, 0]);
        expect(text.bottom()).toEqual([-width / 2, -height]);
    });

    test('should get sides of text right aligned, bottom baseline', () => {
        const text = new Text({ text: 'Hello world', align: 'right', baseline: 'bottom', textMetrics: new TestTextMetrics(100, 10) });

        const width = text.width();
        const height = text.height();

        expect(text.left()).toEqual([-width, height / 2]);
        expect(text.right()).toEqual([0, height / 2]);
        expect(text.top()).toEqual([-width / 2, height]);
        expect(text.bottom()).toEqual([-width / 2, 0]);
    });

    test('should get center of text centered at origin', () => {
        const text = new Text({ text: 'Hello world', textMetrics: new TestTextMetrics(100, 10) });
        expect(text.center()).toEqual([0, 0]);
    });

    test('should get center of text not center aligned', () => {
        let text = new Text({ text: 'Hello world', align: 'left', textMetrics: new TestTextMetrics(100, 10) });
        // Since the text is left-aligned, the center is going to be right of the X/Y
        expect(text.center()).toEqual([text.width() / 2, 0]);

        text = new Text({ text: 'Hello world', align: 'right', textMetrics: new TestTextMetrics(100, 10) });
        expect(text.center()).toEqual([-text.width() / 2, 0]);
    });

    test('should get center of text centered at non-origin', () => {
        const text = new Text({ text: 'Hello world', x: 1, y: 1, textMetrics: new TestTextMetrics(100, 10) });
        expect(text.center()).toEqual([1, 1]);
    });

    test('should move location', () => {
        const text = new Text({ text: 'Hello world', textMetrics: new TestTextMetrics(100, 10), x: 0, y: 0 }).moveTo([2, 2]);
        expect(text.center()).toEqual([2, 2]);
    });

    test('should put text next to shape', () => {
        const s = new Square({ x: 0, y: 0, size: 2 });
        let text = new Text({ text: 'Hello world', align: 'left', textMetrics: new TestTextMetrics(100, 10) });

        expect(text.nextTo(s, RIGHT()).left()).toEqual([1.2, 0]);
        expect(text.nextTo(s, LEFT()).left()).toEqual([-1.2, 0]);
        expect(text.nextTo(s, UP()).left()).toEqual([0, 1.2]);
        expect(text.nextTo(s, DOWN()).left()).toEqual([0, -1.2]);
    });

    test('should move the center', () => {
        const t = new Text({ text: 'Hello world', x: 0, y: 0, textMetrics: new TestTextMetrics(100, 10) });
        expect(t.moveCenter([2, 2]).center()).toEqual([2, 2]);
        expect(t.moveCenter([0, 0]).center()).toEqual([0, 0]);
        expect(t.moveCenter([-2, -2]).center()).toEqual([-2, -2]);
    });

    test('should get center when baseline is not middle', () => {
        // Height of the text is 0.3478260869565215, so center will be -(0.3478260869565215 / 2)
        const t = new Text({ text: 'TEST', x: 0, y: 0, baseline: 'top' });

        expect(t.center()[0]).toBeCloseTo(0);
        expect(t.center()[1]).toBeCloseTo(-0.17391343478261);
    });
});
