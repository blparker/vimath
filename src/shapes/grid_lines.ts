import { X_TICKS, Y_TICKS, Range, Point, VAlign, HAlign } from "../base";
import { ComposableShape } from "./composed_shape";
import * as math from '../math';
import { Line } from "./base_shapes";
import { Text } from "./text";
import { Colors } from "../colors";


export class GridLines extends ComposableShape {
    compose(): ComposableShape {
        const lineStyles = { lineWidth: 1, lineColor: Colors.gray({ opacity: 0.2 }) };

        for (let i = 0; i <= X_TICKS; i++) {
            const x = i - X_TICKS / 2;
            const line = new Line({ from: [x, -Y_TICKS / 2], to: [x, Y_TICKS / 2], ...lineStyles });

            if (i === X_TICKS / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(Colors.gray({ opacity: 0.3 }));
            }

            this.add(line);
        }

        for (let i = 0; i <= Y_TICKS; i++) {
            const y = i - Y_TICKS / 2;
            const line = new Line({ from: [-X_TICKS / 2, y], to: [X_TICKS / 2, y], ...lineStyles });

            if (i === Y_TICKS / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(Colors.gray({ opacity: 0.3 }));
            }

            this.add(line);
        }

        return this;
    }
}
