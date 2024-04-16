import { Prettify } from '@/base';
import { ShapeStyles } from '@/shapes/shape';
import { Text, TextArgs } from '@/shapes/primitives/text';


class Tex extends Text {
    constructor();
    constructor(text: string);
    constructor(args: Prettify<TextArgs & ShapeStyles>);
    constructor(args?: Prettify<TextArgs & ShapeStyles> | string) {
        if (args === undefined) {
            super({ text: 'Vimath', tex: true });
        } else if (typeof args === 'string') {
            super({ text: args, tex: true });
        } else {
            super(args);
        }
    }
}


export { Tex };
