// import { Scene } from '../src/scene';
// // import { Line } from '../src/shapes/primitives/line';
// import { BaseAnimation, Create } from '../src/animation';
// import { FadeIn } from '../src/animation/fade_in';
// // import { Arc } from '../src/shapes/primitives/arc';
// import { Arrow } from '../src/shapes/composed/arrow';
// import { Triangle } from '../src/shapes/derived/triangle';
// import { Tex } from '../src/shapes/derived/tex';
// import { NumberLine } from '../src/shapes/composed/number_line';
// import { Text } from '../src/shapes/primitives/text';
// import { LEFT, DOWN, UP, RIGHT, UL, UR, DL, DR, ORIGIN } from '../src/base';
// import { Axes } from '../src/shapes/composed/axes';
// import { Colors } from '../src/colors';
// import { GridLines } from '../src/shapes/composed/grid_lines';
// // import { Brace } from '../src/shapes/composed/brace';
// // import { Circle, Dot, PointShape } from '../src/shapes';
// import { TangentLine } from '../src/shapes/derived/tangent_line';
// // import { Square } from '../src/shapes/derived/square';
// // import { PointShape as PointShape2 } from '../src/shapes/primitives/bezier_point_shape';
// import { PointShape, Dot, Circle } from '../src/shapes'
// import { GrowFromCenter } from '../src/animation/grow_from_center';
// import math from '../src/math';
import { Scene, BaseAnimation, GridLines, Square, Text, RIGHT, LEFT, UP, DOWN, UR, DR, DL, UL, Tex, Axes, Triangle, NumberLine, Colors, Dot, Line, Arrow, Circle, Group, TangentLine, PointShape, Point } from '../src';
import math from '../src/math';


const cvs = document.getElementById('cvs') as HTMLCanvasElement;

class TestAnimation extends BaseAnimation {
    update(pctComplete: number, starting: boolean): void {
        console.log(pctComplete);
    }
}


// Call this Mavis (MAth VIS or MAth VIsualization System)?


class TestScene extends Scene {
    compose() {
        this.add(new GridLines());

        // const c2 = this.add(new Circle({ radius: 4, lineColor: Colors.blue() }));
        // const pt452 = c2.pointAtAngle(Math.PI / 4);

        // const triangle = this.add(new PointShape({ points: [ORIGIN, pt452, [pt452[0], 0]], lineWidth: 2 }));
        // this.add(triangle.texOnEdge('1', 0, UP()));

        // this.add(triangle.texOnEdge('\\sin \\theta', 1, LEFT()));
        // this.add(triangle.texOnEdge('\\cos \\theta', 2, UP()));

        // const b = this.add(new Brace({ from: [0, 0], to: [3, 0], direction: DOWN() }));
        // const b2 = this.add(new Brace({ from: [0, 0], to: [-3, 0], direction: DOWN() }));

        /**** TODO:
         * 
         *  Need to rework how a brace is formed. What Manim currently does is the following:
         *      - if direction is not provided, it infers the direction from the points
         *      - if the direction is provided, the direction is used, but it doesn't follow the direction of the points. For example, for
         *        the points [0, 0] to [3, 2] and the direction is DOWN(), the brace doesn't follow the direction of the points. It is completely 
         *        horizontal spanning the X-distance between the points
        */

        // const sq = this.add(new Square());
        // this.add(new Brace(sq, DOWN()));
        // const sq = this.add(new Square2());


        // const sq = new Circle();
        // const sq = new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() });
        // this.add(new Create({ target: sq, duration: 1000 }));
        // this.add(sq)
        // this.add(new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() }));
        // this.add(new Square2({ center: [-4, 0], size: 2, lineColor: Colors.red() }));

        // const b = this.add(new Brace({ from: [0, 0], to: [3, 0], direction: DOWN() }));

        // const b1 = this.add(new Brace({ from: [0, 0], to: [3, 2] }));
        // const b2 = this.add(new Brace({ from: [3, 2], to: [0, 0] }));
        // const b3 = this.add(new Brace({ from: [0, 0], to: [-3, 2] }));
        // const b4 = this.add(new Brace({ from: [0, 0], to: [-3, 2], direction: DOWN() }));

        // const b4 = this.add(new Brace({ from: [-1, 1], to: [-4, 3], direction: RIGHT() }));
        // const b4 = this.add(new Brace({ from: [-1, 1], to: [-4, 3] }));
        // const b4 = this.add(new Brace({ from: [-4, 3], to: [-1, 1] }));
        // const b4 = this.add(new Brace({ from: [-4, 1], to: [-1, 3] }));
        // const b4 = this.add(new Brace({ from: [1, 1], to: [4, 3], direction: DOWN() }));

        // const b5 = this.add(new Brace2({ from: [0, 0], to: [-3, 0] }));
        // const b5 = this.add(new Brace2([0, 0], [-3, 0]));

        // b.shift([1, 0]);
        // b.moveTo([1, 1])

        // const a = new Axes({ xLength: 10, yLength: 8 });
        // this.add(a);

        // const p = a.plot(x => 0.1 * x ** 2);
        // this.add(p);

        // const t = new TangentLine({ plot: p, x: 2, color: Colors.pink() });
        // this.add(t);
        // const s1 = this.add(new Square());
        // const s2 = this.add(new Square().nextTo(s1, RIGHT()));
        // this.add(new Text('test').nextTo(s2, RIGHT()));
        // const b = this.add(new Brace(s1, UP()));

        // const s = new Arc2({ center: [0, 0], radius: 1, startAngle: 0, endAngle: Math.PI / 2, lineColor: Colors.blue() });
        // this.add(s.scale(0.0).scale(100000));
        // const s = new Square();
        // this.add(new GrowFromCenter(s))

        // const shape = new PointShape2({ points: [[1, 1], [1, -1], [-1, -1], [-1, 1], [1, 1]] });
        // this.add(new Create({ target: shape, duration: 1000 }));
        // this.add(shape);


        // const c = this.add(new Circle(4).changeLineColor(Colors.blue()));
        // const pt45 = c.pointAtAngle(Math.PI / 4);

        // const [dotOrigin, dot45] = this.add(new Dot(c.center()), new Dot(pt45));

        // const tri = this.add(new PointShape({ points: [ORIGIN, pt45, [pt45[0], 0]], lineWidth: 2, }));
        // this.add(
        //     tri.texOnEdge('1', 0, UL()),
        //     tri.texOnEdge('\\sin \\theta', 1, LEFT()),
        //     tri.texOnEdge('\\cos \\theta', 2, DOWN()),
        // );

        // this.add(
        //     new Tex('O').nextTo(dotOrigin, DOWN()),
        //     new Tex('P').nextTo(dot45, RIGHT()),
        // );

        // const a = new Axes();
        // // const f = x => (2 * x * x - x - 1) / (x - 1)
        // const p = a.plot(x => 1 / x);
        // // const p = a.plot(f);
        // // const p = a.plot(x => 0.1 * x * x);

        // this.add(a, p);
        // const a = new Axes({
        //     xRange: [-20, 20],
        //     yRange: [-10, 10],
        //     xStep: 2,
        //     yStep: 2,
        //     labelSize: 16,
        //     showGrid: true,
        // });

        // this.add(a);

        // const s = this.add(new Square().moveTo([3, 2]));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UP()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, RIGHT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DOWN()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, LEFT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, DL()));
        // this.add(new Text({ text: 'hello' }).nextTo(s, UL()));

        // const s2 = this.add(new Square().moveTo([-3, 2]));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UP()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, RIGHT()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DOWN()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, LEFT()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UR()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DR()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, DL()));
        // this.add(new Tex({ text: 'hello' }).nextTo(s2, UL()));

        // const s3 = this.add(new Square().moveTo([3, -2]));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UP()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, RIGHT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DOWN()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, LEFT()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DR()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, DL()));
        // this.add(new Text({ text: 'hello' }).nextTo(s3, UL()));

        // const s = new Square({ size: 1 });

        // const locs = [[-3, 3], [3, 3], [3, -3], [-3, -3]];

        // for (const loc of locs) {
        //     const sc = s.copy().moveTo(loc)
        //     this.add(sc);


        // }
        // const dirs = [UP(), RIGHT(), DOWN(), LEFT(), UR(), DR(), DL(), UL()];
        // // const dirs = [UP()];

        // const s1 = this.add(new Square({ size: 2, center: [-3, 2], selectable: true }));
        // for (const dir of dirs) {
        //     this.add(new Text({ text: 'hello', align: 'left' }).nextTo(s1, dir));
        // }

        // const s2 = this.add(new Square({ size: 2, center: [3, 2] }));
        // for (const dir of dirs) {
        //     this.add(new Text({ text: 'hello', align: 'right' }).nextTo(s2, dir));
        // }

        // const axes = this.add(new Axes({
        //     xLength: 10,
        //     yLength: 6,
        //     xRange: [0, 1],
        //     xStep: 0.25,
        //     yRange: [0, 50],
        //     yStep: 5,
        //     xLabel: 'test',
        //     yLabel: 'test',
        //     tips: true,
        // }));

        // const p = this.add(axes.plot(x => 50 * x).changeLineColor(Colors.red()));
        // const area = this.add(axes.area(p, [0, 0.5]).changeColor(Colors.red({ opacity: 0.3 })).changeLineColor(Colors.transparent()));
        // console.log('-------')

        // for (let i = 0.25; i <= 1; i += 0.25) {
        //     const d = new Dot(axes.point(i, p.valueAtX(i))).changeColor(Colors.red()).changeLineColor(Colors.transparent());
        //     this.add(d);
        // }

        // this.add(new Line({ from: axes.point(0.5, 0), to: axes.point(0.5, p.valueAtX(0.5)), lineColor: Colors.blue() }))
        // console.log(axes.point(0.5, 25));

        // const axes = this.add(new Axes({
        //     xRange: [-8, 8],
        //     yRange: [-4, 10],
        //     xLength: 12,
        //     yLength: 6,
        //     xStep: 2,
        //     yStep: 2,
        // }));

        // const p1 = this.add(axes.plot(x => x * x - 2 * x + 3).changeLineColor(Colors.green()));
        // const p2 = this.add(axes.plot(x => 2 * x - 2).changeLineColor(Colors.blue()));

        // // const a1 = this.add(new Arrow())
        // const pt1e = axes.point(-1, p1.valueAtX(-1));
        // const pt1s = math.subVec(pt1e, [1, 0]);
        // const a1 = this.add(new Arrow({ from: pt1s, to: pt1e }));
        // // this.add(new Tex(String.raw`f(x) = x^2 - 2x + 3`).nextTo(a1, LEFT()));
        // this.add(new Text({ text: String.raw`f(x) = x^2 - 2x + 3`, tex: true }).nextTo(a1, LEFT()));

        // this.add(new Tex('\\lim f(x)'));
        // this.add(new Tex('\\text{foo bar biz baz qux quoo keep going}').moveTo([-3, 0]));
        // this.add(new Tex('\\text{foo}').moveTo([-3, 1]));
        // const size = 30;

        // this.add(new Text({ text: 'hello world, how are you?', size }).moveTo([-3, 3]))
        // // this.add(new Tex('\\text{hello world, how are you?}').moveTo([3, 3]))
        // this.add(new Tex({ text: '\\text{hello world, how are you?}', size }).moveTo([1, 3]))

        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([-3, 1]))
        // this.add(new Tex({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([3, 1]))

        // const words = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];

        // for (let i = 0; i < words.length; i++) {
        //     const w = words.slice(0, i + 1).join(' ');

        //     const t = new Text({ text: w, size, align: 'left', x: -7, y: 4 - i });
        //     this.add(t)

        //     const t2 = new Text({ text: '\\text{' + w + '}', size, align: 'left', x: 0, y: 4 - i, tex: true });
        //     this.add(t2)
        // }

        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size }).moveTo([-3, 3]))
        // this.add(new Text({ text: 'f(x) = x^2 - 2x + 3', size, tex: true }).moveTo([3, 3]))


        const axes = this.add(new Axes({
            xRange: [0, 2],
            yRange: [0, 2],
            xLength: 6,
            yLength: 6,
            xStep: 0.5,
            // showTicks: false,
            // showLabels: false,
        }));

        const fn = x => 3 * Math.pow(x - 1, 3) + 2 * Math.pow(x - 1, 2) + 0.5;
        const p = this.add(axes.plot(x => fn(x)));
        const pt = axes.point(1.25, fn(1.25));
        const area = this.add(axes.area( p, [0.25, 0.75]).changeColor(Colors.red({ opacity: 0.3 })).changeLineColor(Colors.transparent()));
        const tangentLine = this.add(new TangentLine({ plot: p, x: 1.25, lineColor: Colors.blue(), length: 2.5 }));
        this.add(new Text({ text: 'Area' }).moveTo(area.center()));
        this.add(new Text({ text: 'Tangent line', align: 'left' }).nextTo(pt, RIGHT(), 0.3));

        this.add(
            new Dot(pt),
            new Text('P').nextTo(pt, LEFT(), 0.3),
            new Text('a').nextTo(area, DL()),
            new Text('b').nextTo(area, DR())
        );

        // const pts = [
        //     [-2.25,-3],
        //     [-2.25,-1.921875], [-2.2424999999999997,-1.906495171875],[-2.2350000000000003,-1.8912926249999993],[-2.2275,-1.8762665156249998],[-2.2199999999999998,-1.861416],
        //     [-2.2125000000000004,-1.846740234375],[-2.205,-1.8322383749999995],[-2.1975,-1.8179095781250003],[-2.1899999999999995,-1.8037530000000002],[-2.1825,-1.789767796875],
        //     [-2.1750000000000003,-1.775953125],[-2.1674999999999995,-1.7623081406249996],[-2.16,-1.748832],[-2.1525,-1.735523859375],[-2.1449999999999996,-1.722382875],
        //     [-2.1374999999999997,-1.7094082031249993],[-2.13,-1.6965989999999993],[-2.1225,-1.6839544218750004],[-2.115,-1.671473625],[-2.1075,-1.6591557656249996],
        //     [-2.0999999999999996,-1.6469999999999998],[-2.0925000000000002,-1.6350054843750002],[-2.0849999999999995,-1.623171375],[-2.0774999999999997,-1.611496828124999],
        //     [-2.0700000000000003,-1.5999809999999999],[-2.0625,-1.588623046875],[-2.0549999999999997,-1.5774221249999998],[-2.0474999999999994,-1.566377390625],
        //     [-2.04,-1.5554879999999998],[-2.0324999999999998,-1.5447531093749998],[-2.0249999999999995,-1.5341718749999995],[-2.0175,-1.5237434531249994],[-2.01,-1.513467],
        //     [-2.0024999999999995,-1.5033416718750003],[-1.9949999999999999,-1.4933666249999997],[-1.9874999999999998,-1.4835410156249997],[-1.9799999999999995,-1.4738639999999996],
        //     [-1.9725,-1.4643347343749995],[-1.9649999999999999,-1.4549523749999997],[-1.9574999999999996,-1.4457160781249991],[-1.9499999999999995,-1.4366249999999996],
        //     [-1.9425,-1.4276782968749997],[-1.935,-1.4188751249999996],[-1.9274999999999995,-1.4102146406249998],[-1.92,-1.4016959999999994],[-1.9124999999999996,-1.3933183593749998],
        //     [-1.9049999999999996,-1.3850808749999992],[-1.8974999999999995,-1.376982703124999],[-1.8899999999999997,-1.369022999999999],[-1.8824999999999998,-1.3612009218749999],
        //     [-1.8749999999999998,-1.3535156249999998],[-1.8674999999999997,-1.3459662656249998],[-1.8599999999999994,-1.338552],[-1.8524999999999998,-1.3312719843749996],
        //     [-1.8449999999999993,-1.3241253749999995],[-1.8374999999999995,-1.3171113281249998],[-1.8299999999999998,-1.3102289999999996],[-1.8224999999999998,-1.3034775468749995],
        //     [-1.8149999999999995,-1.2968561249999997],[-1.8074999999999994,-1.2903638906249997],[-1.7999999999999998,-1.2839999999999996],[-1.7924999999999995,-1.2777636093749996],
        //     [-1.7849999999999995,-1.271653875],[-1.7774999999999999,-1.2656699531249997],[-1.7699999999999996,-1.2598109999999998],[-1.7624999999999993,-1.2540761718749998],
        //     [-1.7549999999999997,-1.2484646249999996],[-1.7474999999999996,-1.2429755156249997],[-1.7399999999999993,-1.2376079999999998],[-1.7324999999999997,-1.2323612343749997],
        //     [-1.7249999999999996,-1.227234375],[-1.7174999999999994,-1.2222265781249995],[-1.7099999999999993,-1.2173369999999997],[-1.7024999999999997,-1.2125647968750002],
        //     [-1.6949999999999998,-1.2079091249999996],[-1.6874999999999993,-1.2033691406249998],[-1.6799999999999997,-1.1989439999999998],[-1.6724999999999994,-1.1946328593749997],
        //     [-1.6649999999999994,-1.1904348749999996],[-1.6574999999999993,-1.1863492031249994],[-1.6499999999999995,-1.1823749999999997],[-1.6424999999999996,-1.1785114218750001],
        //     [-1.6349999999999996,-1.1747576249999998],[-1.6274999999999995,-1.1711127656249993],[-1.6199999999999992,-1.167576],[-1.6124999999999996,-1.164146484375],
        //     [-1.604999999999999,-1.1608233749999997],[-1.5974999999999993,-1.157605828125],[-1.5899999999999996,-1.1544929999999995],[-1.5824999999999996,-1.1514840468749998],
        //     [-1.5749999999999993,-1.1485781249999996],[-1.5674999999999992,-1.145774390625],[-1.5599999999999996,-1.1430719999999999],[-1.5524999999999993,-1.140470109375],
        //     [-1.5449999999999993,-1.1379678749999995],[-1.5374999999999996,-1.1355644531250002],[-1.5299999999999994,-1.1332589999999994],[-1.522499999999999,-1.1310506718750002],
        //     [-1.5149999999999995,-1.1289386249999998],[-1.5074999999999994,-1.1269220156249997],[-1.4999999999999991,-1.125],[-1.4924999999999997,-1.1231717343749994],
        //     [-1.4849999999999994,-1.121436375],[-1.4775,-1.1197930781250003],[-1.4699999999999998,-1.1182409999999996],[-1.4625000000000004,-1.116779296875],[-1.455,-1.1154071250000004],
        //     [-1.4475000000000007,-1.1141236406250004],[-1.4400000000000004,-1.1129280000000001],[-1.432500000000001,-1.1118193593750003],[-1.4250000000000007,-1.1107968750000001],
        //     [-1.4175000000000013,-1.1098597031250002],[-1.410000000000001,-1.109007],[-1.4025000000000016,-1.1082379218750003],[-1.3950000000000014,-1.1075516250000002],
        //     [-1.387500000000002,-1.1069472656250001],[-1.3800000000000017,-1.1064240000000003],[-1.3725000000000023,-1.105980984375],[-1.365000000000002,-1.1056173750000005],
        //     [-1.3575000000000026,-1.1053323281249998],[-1.3500000000000023,-1.1051249999999997],[-1.342500000000003,-1.104994546875],[-1.3350000000000026,-1.1049401250000004],
        //     [-1.3275000000000032,-1.1049608906249997],[-1.320000000000003,-1.1050560000000003],[-1.3125000000000036,-1.105224609375],[-1.3050000000000033,-1.105465875],
        //     [-1.2975000000000039,-1.1057789531250002],[-1.2900000000000036,-1.1061629999999996],[-1.2825000000000042,-1.1066171718749997],[-1.275000000000004,-1.1071406249999995],
        //     [-1.2675000000000045,-1.107732515625],[-1.2600000000000042,-1.1083919999999996],[-1.2525000000000048,-1.109118234375],[-1.2450000000000045,-1.1099103749999992],
        //     [-1.2375000000000052,-1.1107675781249995],[-1.2300000000000049,-1.1116889999999993],[-1.2225000000000055,-1.1126737968749991],[-1.2150000000000052,-1.1137211249999994],
        //     [-1.2075000000000058,-1.1148301406249992],[-1.2000000000000055,-1.1159999999999988],[-1.192500000000006,-1.1172298593749987],[-1.1850000000000058,-1.1185188749999992],
        //     [-1.1775000000000064,-1.1198662031249988],[-1.1700000000000061,-1.1212709999999992],[-1.1625000000000068,-1.1227324218749988],[-1.1550000000000065,-1.124249624999999],
        //     [-1.147500000000007,-1.1258217656249985],[-1.1400000000000068,-1.1274479999999985],[-1.1325000000000074,-1.1291274843749988],[-1.125000000000007,-1.1308593749999982],
        //     [-1.1175000000000077,-1.1326428281249985],[-1.1100000000000074,-1.134476999999998],[-1.102500000000008,-1.1363610468749985],[-1.0950000000000077,-1.138294124999998],
        //     [-1.0875000000000083,-1.140275390624998],[-1.080000000000008,-1.1423039999999975],[-1.0725000000000087,-1.1443791093749973],[-1.0650000000000084,-1.1464998749999975],
        //     [-1.057500000000009,-1.1486654531249973],[-1.0500000000000087,-1.1508749999999974],[-1.0425000000000093,-1.1531276718749972],[-1.035000000000009,-1.1554226249999968],
        //     [-1.0275000000000096,-1.1577590156249968],[-1.0200000000000093,-1.1601359999999965],[-1.01250000000001,-1.1625527343749966],[-1.0050000000000097,-1.165008374999997],
        //     [-0.9975000000000103,-1.167502078124997],[-0.99000000000001,-1.1700329999999965],[-0.9825000000000106,-1.1726002968749965],[-0.9750000000000103,-1.1752031249999961],
        //     [-0.9675000000000109,-1.1778406406249964],[-0.9600000000000106,-1.1805119999999965],[-0.9525000000000112,-1.183216359374996],[-0.9450000000000109,-1.1859528749999961],
        //     [-0.9375000000000115,-1.188720703124996],[-0.9300000000000113,-1.1915189999999958],[-0.9225000000000119,-1.1943469218749956],[-0.9150000000000116,-1.1972036249999958],
        //     [-0.9075000000000122,-1.2000882656249952],[-0.9000000000000119,-1.2029999999999956],[-0.8925000000000125,-1.2059379843749953],[-0.8850000000000122,-1.2089013749999948],
        //     [-0.8775000000000128,-1.211889328124995],[-0.8700000000000125,-1.214900999999995],[-0.8625000000000131,-1.2179355468749948],[-0.8550000000000129,-1.2209921249999949],
        //     [-0.8475000000000135,-1.2240698906249943],[-0.8400000000000132,-1.227167999999995],[-0.8325000000000138,-1.2302856093749948],[-0.8250000000000135,-1.2334218749999941],
        //     [-0.8175000000000141,-1.2365759531249942],[-0.8100000000000138,-1.2397469999999942],[-0.8025000000000144,-1.2429341718749942],[-0.7950000000000141,-1.2461366249999934],
        //     [-0.7875000000000147,-1.2493535156249935],[-0.7800000000000145,-1.2525839999999935],[-0.7725000000000151,-1.2558272343749932],[-0.7650000000000148,-1.2590823749999933],
        //     [-0.7575000000000154,-1.2623485781249935],[-0.7500000000000151,-1.2656249999999931],[-0.75,-3],
        //     [-2.25,-3]];
        // const p = this.add(new PointShape({ points: pts }));
        // this.add(new Dot(p.center()));

        // const c = this.add(new Circle([2, 0]));
        // this.add(new Dot(c.center()));
        // const points = [[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 2], [1, 1]] as Point[];
        // const shape = new PointShape({ points });

        // this.add(shape);
        // this.add(new Dot(shape.center()));
        // console.log(shape.center());
    }
}

new TestScene({ canvas: cvs }).render();
