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
    private _needsFinalRender: boolean = false;

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
        this._needsFinalRender = false;
    }

    private async nextTick(time: number) {
        this._canvas.clear();

        let activeAnimations = false;
        let selectableShapes = false;
        let numAnimations = 0;

        for (let i = 0; i < this._scheduled.length; i++) {
            const el = this._scheduled[i];

            if (isShape(el)) {
                await this._canvas.renderShape(el);
                if (isSelectableShape(el)) {
                    selectableShapes = true;
                }
            } else if (isAnimation(el)) {
                ++numAnimations;

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


        if (!activeAnimations && numAnimations > 0) {
            this._needsFinalRender = true;
        }

        if (!activeAnimations && !selectableShapes) {
            if (this._needsFinalRender) {
                this._needsFinalRender = false;
            } else {
                console.log('Cancelling requestAnimationFrame')
                cancelAnimationFrame(this._rafId);
            }
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


function createScene(fn: (scene: Scene) => void, { canvas, userConfig }: { canvas?: string | HTMLCanvasElement | Canvas, userConfig?: Config } = { canvas: undefined, userConfig: config }): Scene {
    const scene = new class extends Scene {
        compose(): void {
            fn(this);
        }
    }({ canvas, userConfig });

    scene.render();

    return scene;
}


export { Scene, createScene };
