import { Scene } from '../src/scene';
import { Line } from '../src/shapes/derived/line';
import { BaseAnimation } from '../src/animation/animation';
import { FadeIn } from '../src/animation/fade_in';

const cvs = document.getElementById('cvs') as HTMLCanvasElement;

class TestAnimation extends BaseAnimation {
    update(pctComplete: number, starting: boolean): void {
        console.log(pctComplete);
    }
}


class TestScene extends Scene {
    compose() {
        const l1 = new Line({ from: [-2, 0], to: [2, 0] });
        const l2 = new Line({ from: [0, 2], to: [0, -2] });

        // this.add(new FadeIn(l1));
        // this.add(new TestAnimation());
        // this.add(new FadeIn(l2));
        // this.add(l2);

        this.add(l1);
        // this.add(new FadeIn({ target: l1, numberOfTimes: 1.5 }));
        // this.add(new FadeIn({ target: l2 }));
        // this.add(new FadeIn(l2));

    }
}

new TestScene({ canvas: cvs }).render();
