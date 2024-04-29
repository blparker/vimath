import { Line } from '../src/shapes/primitives/line';
import { Canvas } from '../src/canvas';
import { BezierCurve, Shape, PointShape } from '../src/shapes';
import { Arc } from '../src/shapes/primitives/arc';


export function getTestCanvas() {
    return new class implements Canvas {
        connectedPathBezier(path: PointShape): void {}
        renderShape(shape: Shape): Promise<void> { return Promise.resolve(); }
        text(text: Text): Promise<void> { return Promise.resolve();}
        bezierCurve(curve: BezierCurve): void { }
        line2({ from, to, ...styles }: any): void { }
        connectedPath(path: PointShape): void { }
        arc(arc: Arc): void { }
        onMouseMove(cb: (state: { absoluteX: number; absoluteY: number; x: number; y: number; canvasX: number; canvasY: number; }) => void): void { }
        onClick(cb: (state: { absoluteX: number; absoluteY: number; x: number; y: number; canvasX: number; canvasY: number; }) => void): void { }
        onResize(cb: () => void): void {}
        line(line: Line): void { }
        clear(): void { }

        width(): number {
            return 800;
        }

        height(): number {
            return 600;
        }
    };
}
