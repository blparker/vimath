import { Shape } from '@/shapes/shape';
import { ComposedShape } from '@/shapes/composed/composed_shape';
import { Colors, RGBA } from '@/colors';
import { config } from '@/config';
import { Line } from '@/shapes/primitives/bezier_line';


class GridLines extends ComposedShape {
    // private _lineColor: RGBA;

    constructor({ lineColor }: { lineColor: RGBA } = { lineColor: Colors.gray({ opacity: 0.2 })}) {
        super({ lineColor });
        // this._lineColor = lineColor;
    }

    compose(): Shape {
        const lineStyles = { lineWidth: 1, lineColor: this.styles().lineColor };
        // const axisColor = colorWithOpacity(this.lineColor, this.lineColor[3] + 0.1);
        const axisColor = structuredClone(lineStyles.lineColor!)
        axisColor[3] += 0.1;

        for (let i = 0; i <= config.xTicks; i++) {
            const x = i - config.xTicks / 2;
            const line = new Line({ from: [x, -config.yTicks / 2], to: [x, config.yTicks / 2], ...lineStyles });

            if (i === config.xTicks / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(axisColor);
            }

            this.add(line);
        }

        for (let i = 0; i <= config.yTicks; i++) {
            const y = i - config.yTicks / 2;
            const line = new Line({ from: [-config.xTicks / 2, y], to: [config.xTicks / 2, y], ...lineStyles });

            if (i === config.yTicks / 2) {
                line.changeLineWidth(2);
                line.changeLineColor(axisColor);
            }

            this.add(line);
        }

        return this;
    }
}


export { GridLines };
