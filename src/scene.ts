<<<<<<< HEAD
import { Shape, isShape } from '@/shapes/shape';
import { Text } from '@/shapes/primitives/text';
import { Animation, isAnimation, Animatable } from '@/animations/animations';
import { Canvas, HtmlCanvas } from '@/renderers/renderer';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, CANVAS_ASPECT_RATIO, Prettify } from '@/base';
import { getRenderer } from '@/renderers/renderer_factory';
import { Interaction, isInteraction } from '@/animations/interactivity';
import { Colors } from '@/colors';
import { Easing } from '@/easing';


export class DOM {
    static createCanvas(width = DEFAULT_CANVAS_WIDTH, height = DEFAULT_CANVAS_HEIGHT): HTMLCanvasElement {
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;

        document.body.appendChild(cvs);

        return cvs;
    }

    static getCanvas(selector: string): HTMLCanvasElement {
        const el = document.querySelector<HTMLCanvasElement>(selector);
        if (!el) {
            throw new Error('Canvas element not found');
        }

        return el;
    }

    static elementParentDimensions(element: HTMLElement): { width: number, height: number } {
        const parent = element.parentElement;
        if (!parent) {
            return { width: 0, height: 0 };
        }

        return { width: parent.clientWidth, height: parent.clientHeight };
    }
}


export class SceneRunner {
    private static readonly requiredFps = 30;
    private actualFps: number = 0;

    constructor(private scene: Scene) {}

    run() {
        let times: number[] = [];

        let then: number;
        const interval = 1000 / SceneRunner.requiredFps;

        const loop = (time: number) => {
            requestAnimationFrame(loop);

            if (then === undefined) {
                then = time;
            }

            const delta = time - then;

            // if (delta > interval) {
                then = time - (delta % interval);
                while (times.length > 0 && times[0] <= time - 1000) {
                    times.shift();
                }

                times.push(time);
                this.actualFps = times.length;

                this.scene.nextTick(time);
            // }
        };

        requestAnimationFrame(loop);
    }

    fps() {
        return this.actualFps;
    }
}

type Renderable = Shape | Animation | Interaction;
type SceneArgs = {
    canvas?: Canvas | string;
    showFps?: boolean;
    staticScene?: boolean;
    allowResize?: boolean;
};


class Wait extends Animation {
    update(): Animatable[] {
        return [];
    }

    resetState(): void {}
}


class RemoveElement extends Animation {
    constructor(private els: Renderable[][], private toRemove: Renderable[]) {
        super({ duration: 0, easing: Easing.linear });
    }

    update(): Animatable[] {
        for (const layer of this.els) {
            for (const el of this.toRemove) {
                const idx = layer.indexOf(el);
                if (idx !== -1) {
                    layer.splice(idx, 1);
                }
            }
        }

        return [];
    }

    resetState(): void {}
}


export abstract class Scene {
    private els: Renderable[][];
    private canvas: Canvas;
    private runner: SceneRunner;
    private added: Set<Shape> = new Set();
    private fpsText: Text | null = null;
    private staticScene: boolean;
    private allowResize: boolean;

    /**
     * Create a new scene instance
     * @param canvas the canvas selector or element to use
     * @param showFps a flag indicating whether or not to render a FPS (frames per second) on the canvas
     */
    constructor({ canvas, showFps, staticScene, allowResize }: Prettify<SceneArgs> = { showFps: false, staticScene: false, allowResize: true }) {
        this.els = [];

        if (canvas !== undefined && typeof canvas !== 'string') {
            this.canvas = canvas;
        } else if (typeof canvas === 'string') {
            this.canvas = new HtmlCanvas(DOM.getCanvas(canvas));
        } else {
            this.canvas = new HtmlCanvas(DOM.createCanvas());
        }

        this.runner = new SceneRunner(this);

        if (showFps !== undefined && showFps) {
            this.fpsText = new Text({ x: 7, y: -4, text: '0', align: 'right', color: Colors.black({ opacity: 0.5 }), size: 14 });
            this.els.push([this.fpsText]);
        }

        this.staticScene = staticScene ?? false;
        this.allowResize = allowResize ?? true;

        if (this.allowResize) {
            const parentWidth = this.canvas.parentSize()[0];
            this.canvas.setSize(parentWidth, parentWidth * CANVAS_ASPECT_RATIO);

            this.canvas.onResize((width, height) => {
                this.canvas.setSize(width, height);
                if (this.staticScene) {
                    this.nextTick(0);
                }
            });
        }
    }

    add(...els: Renderable[]): Scene {
        this.els.push([...els]);

        for (const el of els) {
            if (isShape(el)) {
                this.added.add(el);
            }
        }

        return this;
    }

    remove(...els: Renderable[]): Scene {
        this.els.push([new RemoveElement(this.els, els)])
        return this;
    }

    wait(time: number): Scene {
        this.els.push([new Wait({ duration: time, easing: Easing.linear })])
        return this;
    }

    render(): Scene {
        this.staticScene ? this.nextTick(0) : this.runner.run();

        return this;
    }

    nextTick(time: number): void {
        this.canvas.clear();

        if (this.fpsText) {
            this.fpsText.setText(this.runner.fps().toString());
        }

        for (const els of this.els) {
            for (const el of els) {
                if (isShape(el)) {
                    getRenderer(this.canvas, el).render(el);
                } else if (isAnimation(el)) {
                    if (!el.isComplete(time)) {
                        for (const s of el.tick(time)) {
                            if (isShape(s) && !this.added.has(s)) {
                                els.push(s);
                                this.added.add(s);
                            }
                        }
                    }
                } else if (isInteraction(el)) {
                    if (!el.isRegistered()) {
                        el.registerInteraction(this.canvas);
                    }

                    el.tick(time);
                }
            }

            const hasRunningAnims = els.some(el => isAnimation(el) ? (el.isRunning() && !el.isComplete(time)) : false);
            if (hasRunningAnims) {
                break;
            }
        }
    }

    abstract compose(): Scene;
}
=======
import { Config, config, globalConfig } from '@/config';
import { Canvas, HtmlCanvas, isCanvas } from '@/canvas';
import { PointShape, Shape, isSelectableShape, isShape } from '@/shapes';
import { Animation, BaseAnimation, isAnimation } from '@/animation/animation'
import { AnimationGroup } from './animation/animation_group';


type SceneElement = Shape | Animation | ((pctComplete: number, starting: boolean) => void);



abstract class Scene {
    private _canvas: Canvas;
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

        globalConfig(userConfig ?? {});
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

    /**
     * Add a shape to the scene
     * @param shape the shape to add
     * @returns the shape that was added
     * @example
     * ```ts
     * class TestScene {
     *     compose() {
     *         const square = this.add(new Square())
     *     }
     * }
     * ```
     */
    add<T extends Shape>(shape: T): T;
    /**
     * Add an animation to the scene (to be played)
     * @param shape the animation to add
     * @returns the animation that was added
     * @example
     * ```ts
     * class TestScene {
     *     compose() {
     *         const square = this.add(new Square())
     *         // Adds the animation
     *         this.add(new FadeIn(square));
     *     }
     * }
     * ```
     */
    add<T extends Animation>(animation: T): T;
    /**
     * Adds a function to be executed on each tick
     * @param animation 
     */
    add(animation: (pctComplete: number, starting: boolean) => void): Animation;
    /**
     * Adds a mixture of shapes, animations, and functions to the scene
     * @param els the elements to add to the scene
     * @returns an array containing the elements that were added
     */
    add(...els: SceneElement[]): SceneElement[];
    /**
     * Adds a mixture of shapes, animations, and functions to the scene
     * @param els the element(s) to add to the scene
     * @returns the element(s) that were added to the scene. If only one element was added, that element is returned. Otherwise, an array of elements is returned
     */
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

        this._scheduled.push(...shapes);

        if (animations.length === 1) {
            this._scheduled.push(animations[0]);
        } else if (animations.length > 1) {
            this._scheduled.push(new AnimationGroup({ animations }));
        }

        if (els.length === 1) {
            return els[0];
        } else {
            return els;
        }
    }

    /**
     * Renders the scene. If animations are involved, the scene will continue to render until all animations are complete (using requestAnimationFrame)
     */
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

    /**
     * Method implemented by subclasses to compose the scene. This is where shapes and animations are added to the scene
     * @example
     * ```ts
     * class TestScene {
     *     compose() {
     *         // Add in all your shapes and animations here. For example, adding a square and fading it in
     *         const square = this.add(new Square())
     *         // Fade in the square
     *         this.add(new FadeIn(square));
     *     }
     * }
     * ```
     */
    abstract compose(): void;
}


function createScene(fn: () => void): Scene {
    return new class extends Scene {
        compose(): void {
            fn.bind(this)();
        }
    };
}


export { Scene, createScene };
>>>>>>> refactor/master
