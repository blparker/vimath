import { vi } from 'vitest';


export class OffscreenCanvas {
    constructor(public width: number, public height: number) {}

    public getContext(): CanvasRenderingContext2D {
        const sizes: Record<string, number> = {
            "0": 0.5, "1": 0.5, "2": 0.5, "3": 0.5, "4": 0.5, "5": 0.5, "6": 0.5, "7": 0.5, "8": 0.5, "9": 0.5,

            " ": 0.25, "!": 0.3333333432674408, "\"": 0.4000000059604645, "#": 0.5, "$": 0.5, "%": 0.8333333134651184,
            "&": 0.7833333611488342, "'": 0.18333333730697632, "(": 0.3333333432674408, ")": 0.3333333432674408, "*": 0.5,
            "+": 0.5666666626930237, ",": 0.25, "-": 0.3333333432674408, ".": 0.25, "/": 0.28333333134651184, ":": 0.28333333134651184, 
            ";": 0.28333333134651184, "<": 0.5666666626930237, "=": 0.5666666626930237, ">": 0.5666666626930237,
            "?": 0.44999998807907104, "@": 0.9166666865348816,

            "A": 0.7166666388511658, "B": 0.6666666865348816, "C": 0.6666666865348816, "D": 0.7166666388511658, "E": 0.6166666746139526,
            "F": 0.550000011920929, "G": 0.7166666388511658, "H": 0.7166666388511658, "I": 0.3333333432674408, "J": 0.38333332538604736,
            "K": 0.7166666388511658, "L": 0.6166666746139526, "M": 0.8833333253860474, "N": 0.7166666388511658, "O": 0.7166666388511658,
            "P": 0.550000011920929, "Q": 0.7166666388511658, "R": 0.6666666865348816, "S": 0.550000011920929, "T": 0.6166666746139526,
            "U": 0.7166666388511658, "V": 0.7166666388511658, "W": 0.949999988079071, "X": 0.7166666388511658, "Y": 0.7166666388511658,
            "Z": 0.6166666746139526,

            "[": 0.3333333432674408, "\\": 0.28333333134651184, "]": 0.3333333432674408, "^": 0.46666666865348816,
            "_": 0.5, "`": 0.3333333432674408,

            "a": 0.44999998807907104, "b": 0.5, "c": 0.44999998807907104, "d": 0.5, "e": 0.44999998807907104,
            "f": 0.3333333432674408, "g": 0.5, "h": 0.5, "i": 0.28333333134651184, "j": 0.28333333134651184,
            "k": 0.5, "l": 0.28333333134651184, "m": 0.7833333611488342, "n": 0.5, "o": 0.5,
            "p": 0.5, "q": 0.5, "r": 0.3333333432674408, "s": 0.38333332538604736, "t": 0.28333333134651184,
            "u": 0.5, "v": 0.5, "w": 0.7166666388511658, "x": 0.5, "y": 0.5, "z": 0.44999998807907104,

            "{": 0.4833333194255829, "|": 0.20000000298023224, "}": 0.4833333194255829, "~": 0.5333333611488342
        };

        // const mockContext = jest.mocked(CanvasRenderingContext2D);
        const mockContext = {} as CanvasRenderingContext2D;
        // @ts-ignore
        mockContext.clearRect = vi.fn((x, y, w, h) => {});
        // @ts-ignore
        mockContext.measureText = vi.fn((text) => {
            let fontSize = 0;
            // @ts-ignore
            let matched;
            // @ts-ignore
            if (matched = mockContext.font.match(/^(\d+)px/)) {
                fontSize = parseInt(matched[1], 10);
            }

            const estimatedWidth = text.split('').map((c: string) => sizes[c]).reduce((acc: number, v: number) => acc + (v * fontSize), 0);

            return {
                width: estimatedWidth,
                actualBoundingBoxAscent: fontSize / 2,
                actualBoundingBoxDescent: fontSize / 2,
            };
        });
        // mockContext.mockImplementation(() => ({
        //     clearRect(x, y, w, h) {},
        //     measureText(text) {
        //         return 10;
        //     },
        // }));

        // @ts-ignore
        return mockContext;
    }

    oncontextlost() {}
    oncontextrestored() {}
    convertToBlob() {}
    transferToImageBitmap() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {}
}

// @ts-ignore
globalThis.OffscreenCanvas = OffscreenCanvas;