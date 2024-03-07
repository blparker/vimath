import { describe, test, expect } from 'vitest';
import { HtmlCanvas, Colors } from '../../src/index';
import { createTestCanvas } from '../utils';


function findEvent(canvas: HtmlCanvas, eventName: string) {
    for (const event of canvas.ctx.__getEvents()) {
        if (event.type === eventName) {
            return event.props.value;
        }
    }

    return null;
}


test('should render text with properties', () => {
    const canvas = createTestCanvas(400, 200);
    canvas.text({ text: 'Test', x: 0, y: 0, size: 20, color: Colors.black(), align: 'center', baseline: 'middle' });

    const drawCalls = canvas.ctx.__getDrawCalls();

    expect(drawCalls.length).toEqual(1);
    expect(drawCalls[0].type).toEqual('fillText');
    expect(drawCalls[0].props.text).toEqual('Test');
    expect(drawCalls[0].props.x).toEqual(200);
    expect(drawCalls[0].props.y).toEqual(100);

    // console.log(canvas.ctx.__getEvents())
    // rgba(26, 26, 26, 1) == #1a1a1a
    expect(findEvent(canvas, 'fillStyle')).toEqual('#1a1a1a');
    expect(findEvent(canvas, 'font').startsWith('20px')).toBeTruthy();
    expect(findEvent(canvas, 'textAlign')).toEqual('center');
    expect(findEvent(canvas, 'textBaseline')).toEqual('middle');
});
