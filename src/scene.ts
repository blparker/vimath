import { Shape, isShape } from './shapes/base_shapes';
import { Text } from './shapes/text';
import { Animation, isAnimation } from './animations/animations';
import { Canvas, HtmlCanvas } from './renderers/renderer';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, Point } from './base';
import { getRenderer } from './renderers/renderer_factory';
import { Interaction, isInteraction } from './animations/interactivity';
import { Colors } from './colors';


export class DOM {
    static createCanvas(width = DEFAULT_CANVAS_WIDTH, height = DEFAULT_CANVAS_HEIGHT): HTMLCanvasElement {
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;

        document.body.appendChild(cvs);

        return cvs;
    }
}


export class SceneRunner {
    private static readonly requiredFps = 30;
    private actualFps: number = 0;

    constructor(private scene: Scene) {}

    run() {
        let times: number[] = [];
        let fps;

        let then: number;
        const interval = 1000 / SceneRunner.requiredFps;

        const loop = (time: number) => {
            requestAnimationFrame(loop);

            if (then === undefined) {
                then = time;
            }

            const delta = time - then;

            if (delta > interval) {
                then = time - (delta % interval);
                while (times.length > 0 && times[0] <= time - 1000) {
                    times.shift();
                }

                times.push(time);
                this.actualFps = times.length;

                this.scene.nextTick(time);
            }
        };

        requestAnimationFrame(loop);
    }

    fps() {
        return this.actualFps;
    }
}

type Renderable = Shape | Animation | Interaction;



export abstract class Scene {
    private els: Renderable[][];
    private canvas: Canvas;
    private runner: SceneRunner;
    // private interactivity: Interactivity;
    private added: Set<Shape> = new Set();
    private fpsText: Text;


    constructor({ canvas }: { canvas?: Canvas } = {}) {
        this.els = [];
        this.canvas = canvas ?? new HtmlCanvas(DOM.createCanvas());
        this.runner = new SceneRunner(this);

        this.fpsText = new Text({ x: 7, y: -4, text: '0', align: 'right', color: Colors.black({ opacity: 0.5 }), size: 14 });

        this.els.push([this.fpsText]);
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

    render(): Scene {
        this.runner.run();

        return this;
    }

    nextTick(time: number): void {
        this.canvas.clear();

        this.fpsText.setText(this.runner.fps().toString());

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
