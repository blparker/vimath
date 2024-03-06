import { X_TICKS, Y_TICKS } from "../base";
import { ComposableShape } from "./composed_shape";
import { Line } from './primitives/line';
import { Colors, RGBA, colorWithOpacity } from "../colors";


export class GridLines extends ComposableShape {
    private lineColor: RGBA;

    constructor({ lineColor }: { lineColor: RGBA } = { lineColor: Colors.gray({ opacity: 0.2 })}) {
        super();
        this.lineColor = lineColor;
    }

    compose(): ComposableShape {
        const lineStyles = { lineWidth: 1, lineColor: this.lineColor };
        const axisColor = colorWithOpacity(this.lineColor, this.lineColor[3] + 0.1);

        for (let i = 0; i <= X_TICKS; i++) {
            const x = i - X_TICKS / 2;
            const line = new Line({ from: [x, -Y_TICKS / 2], to: [x, Y_TICKS / 2], ...lineStyles });

            if (i === X_TICKS / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(axisColor);
            }

            this.add(line);
        }

        for (let i = 0; i <= Y_TICKS; i++) {
            const y = i - Y_TICKS / 2;
            const line = new Line({ from: [-X_TICKS / 2, y], to: [X_TICKS / 2, y], ...lineStyles });

            if (i === Y_TICKS / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(axisColor);
            }

            this.add(line);
        }

        return this;
    }
}
