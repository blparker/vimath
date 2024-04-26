import { Config, config } from '@/config';
import { Canvas, HtmlCanvas, isCanvas } from '@/canvas';
import { PointShape, Shape, isSelectableShape, isShape } from '@/shapes';
import { Animation, BaseAnimation, isAnimation } from '@/animation/animation'
import { AnimationGroup } from './animation/animation_group';


type SceneElement = Shape | Animation | ((pctComplete: number, starting: boolean) => void);



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

        config.canvasInstance = this._canvas;

        this._canvas.onClick(e => {
            for (const el of this._scheduled) {
                if (isShape(el) && el instanceof PointShape && isSelectableShape(el)) {
                    if (el.isPointOnEdge([e.x, e.y])) {
                        el.select();
                    } else {
                        el.deselect();
                    }
                }
            }
        });

        this._canvas.onResize(() => this.nextTick(0));
    }

    add(shape: Shape): Shape;
    add(animation: Animation): Animation;
    add(animation: (pctComplete: number, starting: boolean) => void): Animation;
    add(...els: SceneElement[]): SceneElement[];
    add(...els: SceneElement[]): SceneElement | SceneElement[] {
        if (els.length === 0) {
            return [];
        }

        const shapes: Shape[] = [];
        const animations: Animation[] = [];

        for (const el of els) {
            if (typeof el === 'function') {
                const anim = new class extends BaseAnimation {
                    update(pctComplete: number, starting: boolean): void {
                        el(pctComplete, starting);
                    }
                };

                animations.push(anim);
            } else if (isShape(el)) {
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

        if (els.length === 1) {
            return els[0];
        } else {
            return els;
        }
    }

    render(): void {
        const loop = async (time: number) => {
            this._rafId = requestAnimationFrame(loop);

            // try {
            // } catch (e) {
            //     console.error('Error in nextTick', e);
            //     cancelAnimationFrame(this._rafId);
            // }
            this.nextTick(time).catch(e => {
                console.error('Error in nextTick', e)
                cancelAnimationFrame(this._rafId);
            });
        };

        this.compose();
        this._rafId = requestAnimationFrame(loop);
    }

    private async nextTick(time: number) {
        this._canvas.clear();

        let activeAnimations = false;
        let selectableShapes = false;

        for (let i = 0; i < this._scheduled.length; i++) {
            const el = this._scheduled[i];

            if (isShape(el)) {
                await this._canvas.renderShape(el);
                if (isSelectableShape(el)) {
                    selectableShapes = true;
                }
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

        if (!activeAnimations && !selectableShapes) {
            console.log('Cancelling requestAnimationFrame')
            cancelAnimationFrame(this._rafId);
        }
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
