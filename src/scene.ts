import { Shape, isShape } from './shapes/shape';
import { Text } from './shapes/primitives/text';
import { Animation, isAnimation, Animatable } from './animations/animations';
import { Canvas, HtmlCanvas } from './renderers/renderer';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, Prettify } from './base';
import { getRenderer } from './renderers/renderer_factory';
import { Interaction, isInteraction } from './animations/interactivity';
import { Colors } from './colors';
import { Easing } from './easing';


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
};


class Wait extends Animation {
    update(pctComplete: number, reversing: boolean): Animatable[] {
        return [];
    }

    resetState(): void {}
}


class RemoveElement extends Animation {
    constructor(private els: Renderable[][], private toRemove: Renderable[]) {
        super({ duration: 0, easing: Easing.linear });
    }

    update(pctComplete: number, reversing: boolean): Animatable[] {
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

    /**
     * Create a new scene instance
     * @param canvas the canvas selector or element to use
     * @param showFps a flag indicating whether or not to render a FPS (frames per second) on the canvas
     */
    constructor({ canvas, showFps, staticScene }: Prettify<SceneArgs> = { showFps: false, staticScene: false }) {
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
