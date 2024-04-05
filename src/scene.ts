import { Config, config } from '@/config';
import { Canvas, HtmlCanvas, isCanvas } from '@/canvas';
import { PointShape, Shape, isSelectableShape, isShape } from '@/shapes';
import { Animation, isAnimation } from '@/animation/animation'
import { AnimationGroup } from './animation/animation_group';
import { Point } from '@/base';


abstract class Scene {
    private _canvas: Canvas;
    // private _shapes: Shape[] = [];
    // private _shapes: Set<Shape> = new Set();
    // private _animations: Set<Animation> = new Set();
    private _scheduled: (Shape | Animation)[] = [];
    private _rafId: number = 0;

    constructor({ canvas, userConfig }: { canvas?: string | HTMLCanvasElement | Canvas, userConfig?: Config } = { canvas: undefined, userConfig: config }) {
        if (canvas !== undefined && isCanvas(canvas)) {
            this._canvas = canvas;
        } else if (config.renderer === 'html') {
            this._canvas = new HtmlCanvas(canvas);
        } else {
            throw new Error(`Unsupported renderer ${config.renderer}`);
        }

        this._canvas.onClick(e => {
            // console.log(e);

            for (const el of this._scheduled) {
                if (isShape(el) && el instanceof PointShape && isSelectableShape(el)) {
                    const points = el.points();

                    function dist(a: Point, b: Point) {
                        const [x1, y1] = a;
                        const [x2, y2] = b;

                        const A = e.x - x1;
                        const B = e.y - y1;
                        const C = x2 - x1;
                        const D = y2 - y1;

                        const dot = A * C + B * D;
                        const lenSq = C * C + D * D;
                        const param = lenSq !== 0 ? dot / lenSq : -1;

                        let xx, yy;
                        if (param < 0) {
                            xx = x1;
                            yy = y1;
                        } else if (param > 1) {
                            xx = x2;
                            yy = y2;
                        } else {
                            xx = x1 + param * C;
                            yy = y1 + param * D;
                        }

                        const dx = e.x - xx;
                        const dy = e.y - yy;
                        return Math.sqrt(dx * dx + dy * dy);
                    }

                    let selected = false;
                    for (let i = 0; i < points.length - 1; i++) {
                        if (dist(points[i], points[i + 1]) < 0.1) {
                            // console.log('hovering')
                            selected = true;
                            break
                        }

                        // console.log(`(${points[0]}) -- (${e.x}, ${e.y}) (${points[1]}), D: ${d}`);
                        // console.log(d)
                    }

                    if (selected) {
                        el.select();
                    } else {
                        el.deselect();
                    }

                    // for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                    //     const xi = points[i][0], yi = points[i][1];
                    //     const xj = points[j][0], yj = points[j][1];

                    //     const intersect = ((yi > e.y) != (yj > e.y)) &&
                    //         (e.x < (xj - xi) * (e.y - yi) / (yj - yi) + xi);

                    //     if (intersect) {
                    //         console.log('Clicked on shape', el);
                    //     }
                    // }
                }
            }
        });
    }

    add(...els: (Shape | Animation)[]) {
        if (els.length === 0) {
            return;
        }

        const shapes: Shape[] = [];
        const animations: Animation[] = [];

        for (const el of els) {
            if (isShape(el)) {
                shapes.push(el);
            } else if (isAnimation(el)) {
                animations.push(el);
            } else {
                throw new Error(`Unsupported element ${el}`);
            }
        }

        // this._scheduled.unshift(...shapes);
        this._scheduled.push(...shapes);

        if (animations.length === 1) {
            // this._scheduled.unshift(animations[0]);
            this._scheduled.push(animations[0]);
        } else if (animations.length > 1) {
            // this._scheduled.unshift(new AnimationGroup({ animations }));
            this._scheduled.push(new AnimationGroup({ animations }));
        }
    }

    render(): void {
        const loop = (time: number) => {
            this._rafId = requestAnimationFrame(loop);

            try {
                this.nextTick(time);
            } catch (e) {
                console.error('Error in nextTick', e);
                cancelAnimationFrame(this._rafId);
            }
        };

        this.compose();
        this._rafId = requestAnimationFrame(loop);
    }

    private nextTick(time: number): void {
        this._canvas.clear();

        let activeAnimations = false;

        for (let i = 0; i < this._scheduled.length; i++) {
            const el = this._scheduled[i];

            if (isShape(el)) {
                this._canvas.renderShape(el);
            } else if (isAnimation(el)) {
                if (!el.isRunning() && !el.isComplete()) {
                    this._scheduled.splice(i, 0, ...el.renderDependencies());
                }

                el.tick(time);

                if (!el.isComplete() && el.shouldBlock()) {
                    activeAnimations = true;
                    break
                } else if (!el.isComplete()) {
                    activeAnimations = true;
                }
            }
        }

        // if (!activeAnimations) {
        //     console.log('Cancelling requestAnimationFrame')
        //     cancelAnimationFrame(this._rafId);
        // }

        // for (const el of this._scheduled) {
        //     if (isShape(el)) {
        //         this._canvas.renderShape(el);
        //     } else if (isAnimation(el)) {
        //         el.tick(time);
        //         el.renderDependencies().forEach(shape => this._canvas.renderShape(shape));

        //         if (!el.isComplete() && el.shouldBlock()) {
        //             activeAnimations = true;
        //             break
        //         } else if (!el.isComplete()) {
        //             activeAnimations = true;
        //         }
        //     }
        // }

        // if (this._scheduled.length === 0 && this._animations.size === 0) {
        //     console.log('Cancelling requestAnimationFrame')
        //     cancelAnimationFrame(this._rafId);
        // }

        // this._canvas.clear();

        // for (const shape of this._shapes) {
        //     this._canvas.renderShape(shape);
        // }

        // const active = new Set<Animation>();

        // for (const anim of this._animations) {
        //     anim.tick(time);

        //     if (!anim.isComplete()) {
        //         active.add(anim);
        //     }
        // }

        // this._animations = active;

        // while (this._scheduled.length > 0) {
        //     // const el = this._scheduled[0];
        //     const el = this._scheduled.pop();

        //     if (isShape(el)) {
        //         this._shapes.add(el);
        //         // this._scheduled.shift();
        //     } else if (isAnimation(el)) {
        //         if (!el.isRunning() && !el.isComplete()) {
        //             el.renderDependencies().forEach(shape => this._shapes.add(shape));

        //             if (!el.shouldBlock()) {
        //                 this._animations.add(el);
        //             }
        //         }

        //         el.tick(time);

        //         if (el.shouldBlock()) {
        //             this._scheduled.push(el);
        //             break
        //         } else if (!el.isComplete()) {
        //         }


        //         // if (!el.shouldBlock()) {
        //         //     this._animations.add(el);
        //         // } else if (!el.isComplete()) {
        //         //     this._scheduled.push(el);
        //         // }

        //         // if (!el.isComplete()) {
        //         //     // this._scheduled.shift();
        //         //     this._scheduled.push(el);
        //         // }

        //         // if (el.shouldBlock() && !el.isComplete()) {
        //         //     break;
        //         // }

        //         // if (el.isComplete()) {
        //         //     this._scheduled.shift();
        //         // } else {
        //         //     if (!el.isRunning()) {
        //         //         el.renderDependencies().forEach(shape => this._shapes.add(shape));
        //         //     }

        //         //     el.tick(time);
        //         //     break;
        //         // }
        //     }
        // }
    }

    abstract compose(): void;
}


// function createScene(fn: () => void): Scene {
//     return new class extends Scene {
//         compose(): void {
//             fn.bind(this)();
//         }
//     };
// }


// export { Scene, createScene };
export { Scene };
