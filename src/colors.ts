
/**
 * A color represented as an array of four numbers: red, green, blue, and alpha (transparency)
 */
type RGBA = [number, number, number, number];


/**
 * Given a string representing a color name (e.g., blue, red), hex (e.g., #aabbcc), or rgb[a] (e.g., rgba(12, 34, 56, 0.5)), return
 * an RGBA of that value
 * 
 * @param color 
 * @returns 
 */
function parseColor(color: string | RGBA): Readonly<RGBA> {
    if (isRGBA(color)) {
        return color;
    } else if (isHex(color)) {
        return hexToRGBA(color);
    } else if (isRgb(color)) {
        return rgbStringToRGBA(color);
    } else if (isHtmlColor(color)) {
        return htmlColorToRGBA(color);
    }

    throw new Error('Unexpected');
}


/**
 * Converts an RGBA type to an rgba string (e.g., rgba(12, 34, 56, 0.5))
 * @param color The RGBA color
 * @returns the rgba string
 */
function rgbaToString(color: RGBA): string {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
}


type ColorName = keyof typeof variantsByColor;
type Variant = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
type ColorStyle = { variant?: Variant; opacity?: number; };
type ColorVariant= `${ColorName}-${Variant}`;

// const Colors: { [key: string]: (config?: ColorStyle) => RGBA } = {};
// const Colors: { [K in ColorName]: (config?: ColorStyle) => RGBA } & { [K in ColorVariant]: RGBA } = {};



/*
 * Checks
 */
function isRGBA(color: string | RGBA): color is RGBA {
    if (!Array.isArray(color)) {
        return false;
    } else {
        return color.length === 4 &&
               color[0] >= 0 && color[0] <= 255 &&
               color[1] >= 0 && color[1] <= 255 &&
               color[2] >= 0 && color[2] <= 255;
    }
}


function isHex(color: string): boolean {
    return color.startsWith('#');
}


function isRgb(color: string): boolean {
    return color.startsWith('rgb') || color.startsWith('rgba');
}


function isHtmlColor(colorName: string): colorName is HtmlColorName {
    return colorName in htmlColors;
}


/*
 * Parsing
 */
function normalizeHexAlpha(hexAlpha: string | undefined): number {
    if (hexAlpha === undefined) {
        return 1.0;
    }

    const normalized = parseInt(hexAlpha, 16) / 255;
    return parseFloat(normalized.toFixed(2));
}


function toHexVal(v: string): number {
    return parseInt(v, 16);
}


function hexToRGBA(color: string): RGBA {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(color);
    if (! result) {
        throw Error('Failed to parse HEX value: ' + color);
    }

    if (result) {
        return [toHexVal(result[1]), toHexVal(result[2]), toHexVal(result[3]), normalizeHexAlpha(result[4])];
    } else {
        throw new Error('Color does not appear to be a hex color');
    }
}


function rgbStringToRGBA(color: string): RGBA {
    const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i.exec(color);
    if (! result) {
        throw Error('Failed to parse RGB value: ' + color);
    }

    const rgb = result.slice(1, 5).map(parseFloat);
    if (isNaN(rgb[3])) {
        rgb[3] = 1.0;
    }

    return rgb as RGBA;
}

type HtmlColorName = keyof typeof htmlColors;

function htmlColorToRGBA(color: HtmlColorName): Readonly<RGBA> {
    return htmlColors[color];
}


/*
 * Named colors (based on Tailwind colors)
 */
const variantsByColor = {
    // black: Array<'#1a1a1a'>(11).fill('#1a1a1a'),
    // white: Array(11).fill('#ffffff'),
    black:   ['#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a'],
    white:   ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    slate:   ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617'],
    gray:    ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712'],
    zinc:    ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b'],
    neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
    stone:   ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
    red:     ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'],
    orange:  ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'],
    amber:   ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
    yellow:  ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', '#422006'],
    lime:    ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314', '#1a2e05'],
    green:   ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
    emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'],
    teal:    ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e'],
    cyan:    ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'],
    sky:     ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
    blue:    ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'],
    indigo:  ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b'],
    violet:  ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'],
    purple:  ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#3b0764'],
    fuchsia: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', '#4a044e'],
    pink:    ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#500724'],
    rose:    ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519'],
    transparent: ['#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00']
    // transparent: Array(11).fill('#ffffff00'),
};


// Object.keys(variantsByColor).forEach(colorName => {
//     Colors[colorName] = ({ variant = 500, opacity = 1.0 } = {}): RGBA => {
//         let idx = Math.floor(variant / 100);

//         if (variant === 950) {
//             idx += 1;
//         }

//         const hexColor = variantsByColor[colorName as keyof typeof variantsByColor][idx];
//         const rgbaColor = hexToRGBA(hexColor);
//         rgbaColor[3] = opacity;

//         return rgbaColor;
//     };
// });

// const Colors: { [K in ColorName]: (options?: { variant?: Variant, opacity?: number }) => RGBA } & {
//     [K in ColorVariant]: RGBA;
// } = Object.keys(variantsByColor).reduce((acc, colorName) => {
//     acc[colorName] = ({ variant = 500, opacity = 1.0 } = {}): RGBA => {
//         let idx = Math.floor(variant / 100);

//         if (variant === 950) {
//             idx += 1;
//         }

//         const hexColor = variantsByColor[colorName as keyof typeof variantsByColor][idx];
//         const rgbaColor = hexToRGBA(hexColor);
//         rgbaColor[3] = opacity;

//         return rgbaColor;
//     });
// }, {} as any);

function getColor(color: ColorName, { variant = 500, opacity = 1 }: ColorStyle = {}): RGBA {
    const colorVariants = variantsByColor[color];
    let idx = Math.floor(variant / 100);

    if (variant === 950) {
        idx += 1;
    }

    const rgbaColor = hexToRGBA(colorVariants[idx]);
    rgbaColor[3] = opacity;

    return rgbaColor;
}


const Colors: {
    [K in ColorName]: (options?: ColorStyle) => RGBA;
} & {
    [K in ColorVariant]: RGBA;
} = new Proxy({}, {
    get: (target, prop: ColorName) => {
        if (prop.includes('-')) {
            const [color, variant] = prop.split('-');
            return getColor(color as ColorName, { variant: parseInt(variant) as Variant });
        }

        if (prop === 'transparent') {
            return (style?: ColorStyle): RGBA => [255, 255, 255, 0];
        }

        return (style?: ColorStyle): RGBA => getColor(prop, style);
    }
}) as any;


// Build up the ColorVariant type dynamically
type BuildColorVariants<T extends Record<string, any[]>> = {
    [K in keyof T]: T[K] extends Array<any> ? `${string & K}-${Variant}` : never
}[keyof T];

// Assuming `variantsByColor` is your colors object
type DynamicColorVariant = BuildColorVariants<typeof variantsByColor>;


/*
 * HTML color names
 */
const htmlColors = {
    IndianRed: [205, 92, 92, 1.0],
    LightCoral: [240, 128, 128, 1.0],
    Salmon: [250, 128, 114, 1.0],
    DarkSalmon: [233, 150, 122, 1.0],
    LightSalmon: [255, 160, 122, 1.0],
    Crimson: [220, 20, 60, 1.0],
    Red: [255, 0, 0, 1.0],
    FireBrick: [178, 34, 34, 1.0],
    DarkRed: [139, 0, 0, 1.0],
    Pink: [255, 192, 203, 1.0],
    LightPink: [255, 182, 193, 1.0],
    HotPink: [255, 105, 180, 1.0],
    DeepPink: [255, 20, 147, 1.0],
    MediumVioletRed: [199, 21, 133, 1.0],
    PaleVioletRed: [219, 112, 147, 1.0],
    Coral: [255, 127, 80, 1.0],
    Tomato: [255, 99, 71, 1.0],
    OrangeRed: [255, 69, 0, 1.0],
    DarkOrange: [255, 140, 0, 1.0],
    Orange: [255, 165, 0, 1.0],
    Gold: [255, 215, 0, 1.0],
    Yellow: [255, 255, 0, 1.0],
    LightYellow: [255, 255, 224, 1.0],
    LemonChiffon: [255, 250, 205, 1.0],
    LightGoldenrodYellow: [250, 250, 210, 1.0],
    PapayaWhip: [255, 239, 213, 1.0],
    Moccasin: [255, 228, 181, 1.0],
    PeachPuff: [255, 218, 185, 1.0],
    PaleGoldenrod: [238, 232, 170, 1.0],
    Khaki: [240, 230, 140, 1.0],
    DarkKhaki: [189, 183, 107, 1.0],
    Lavender: [230, 230, 250, 1.0],
    Thistle: [216, 191, 216, 1.0],
    Plum: [221, 160, 221, 1.0],
    Violet: [238, 130, 238, 1.0],
    Orchid: [218, 112, 214, 1.0],
    Fuchsia: [255, 0, 255, 1.0],
    Magenta: [255, 0, 255, 1.0],
    MediumOrchid: [186, 85, 211, 1.0],
    MediumPurple: [147, 112, 219, 1.0],
    RebeccaPurple: [102, 51, 153, 1.0],
    BlueViolet: [138, 43, 226, 1.0],
    DarkViolet: [148, 0, 211, 1.0],
    DarkOrchid: [153, 50, 204, 1.0],
    DarkMagenta: [139, 0, 139, 1.0],
    Purple: [128, 0, 128, 1.0],
    Indigo: [75, 0, 130, 1.0],
    SlateBlue: [106, 90, 205, 1.0],
    DarkSlateBlue: [72, 61, 139, 1.0],
    GreenYellow: [173, 255, 47, 1.0],
    Chartreuse: [127, 255, 0, 1.0],
    LawnGreen: [124, 252, 0, 1.0],
    Lime: [0, 255, 0, 1.0],
    LimeGreen: [50, 205, 50, 1.0],
    PaleGreen: [152, 251, 152, 1.0],
    LightGreen: [144, 238, 144, 1.0],
    MediumSpringGreen: [0, 250, 154, 1.0],
    SpringGreen: [0, 255, 127, 1.0],
    MediumSeaGreen: [60, 179, 113, 1.0],
    SeaGreen: [46, 139, 87, 1.0],
    ForestGreen: [34, 139, 34, 1.0],
    Green: [0, 128, 0, 1.0],
    DarkGreen: [0, 100, 0, 1.0],
    YellowGreen: [154, 205, 50, 1.0],
    OliveDrab: [107, 142, 35, 1.0],
    Olive: [128, 128, 0, 1.0],
    DarkOliveGreen: [85, 107, 47, 1.0],
    MediumAquamarine: [102, 205, 170, 1.0],
    DarkSeaGreen: [143, 188, 139, 1.0],
    LightSeaGreen: [32, 178, 170, 1.0],
    DarkCyan: [0, 139, 139, 1.0],
    Teal: [0, 128, 128, 1.0],
    Aqua: [0, 255, 255, 1.0],
    Cyan: [0, 255, 255, 1.0],
    LightCyan: [224, 255, 255, 1.0],
    PaleTurquoise: [175, 238, 238, 1.0],
    Aquamarine: [127, 255, 212, 1.0],
    Turquoise: [64, 224, 208, 1.0],
    MediumTurquoise: [72, 209, 204, 1.0],
    DarkTurquoise: [0, 206, 209, 1.0],
    CadetBlue: [95, 158, 160, 1.0],
    SteelBlue: [70, 130, 180, 1.0],
    LightSteelBlue: [176, 196, 222, 1.0],
    PowderBlue: [176, 224, 230, 1.0],
    LightBlue: [173, 216, 230, 1.0],
    SkyBlue: [135, 206, 235, 1.0],
    LightSkyBlue: [135, 206, 250, 1.0],
    DeepSkyBlue: [0, 191, 255, 1.0],
    DodgerBlue: [30, 144, 255, 1.0],
    CornflowerBlue: [100, 149, 237, 1.0],
    MediumSlateBlue: [123, 104, 238, 1.0],
    RoyalBlue: [65, 105, 225, 1.0],
    Blue: [0, 0, 255, 1.0],
    MediumBlue: [0, 0, 205, 1.0],
    DarkBlue: [0, 0, 139, 1.0],
    Navy: [0, 0, 128, 1.0],
    MidnightBlue: [25, 25, 112, 1.0],
    Cornsilk: [255, 248, 220, 1.0],
    BlanchedAlmond: [255, 235, 205, 1.0],
    Bisque: [255, 228, 196, 1.0],
    NavajoWhite: [255, 222, 173, 1.0],
    Wheat: [245, 222, 179, 1.0],
    BurlyWood: [222, 184, 135, 1.0],
    Tan: [210, 180, 140, 1.0],
    RosyBrown: [188, 143, 143, 1.0],
    SandyBrown: [244, 164, 96, 1.0],
    Goldenrod: [218, 165, 32, 1.0],
    DarkGoldenrod: [184, 134, 11, 1.0],
    Peru: [205, 133, 63, 1.0],
    Chocolate: [210, 105, 30, 1.0],
    SaddleBrown: [139, 69, 19, 1.0],
    Sienna: [160, 82, 45, 1.0],
    Brown: [165, 42, 42, 1.0],
    Maroon: [128, 0, 0, 1.0],
    White: [255, 255, 255, 1.0],
    Snow: [255, 250, 250, 1.0],
    HoneyDew: [240, 255, 240, 1.0],
    MintCream: [245, 255, 250, 1.0],
    Azure: [240, 255, 255, 1.0],
    AliceBlue: [240, 248, 255, 1.0],
    GhostWhite: [248, 248, 255, 1.0],
    WhiteSmoke: [245, 245, 245, 1.0],
    SeaShell: [255, 245, 238, 1.0],
    Beige: [245, 245, 220, 1.0],
    OldLace: [253, 245, 230, 1.0],
    FloralWhite: [255, 250, 240, 1.0],
    Ivory: [255, 255, 240, 1.0],
    AntiqueWhite: [250, 235, 215, 1.0],
    Linen: [250, 240, 230, 1.0],
    LavenderBlush: [255, 240, 245, 1.0],
    MistyRose: [255, 228, 225, 1.0],
    Gainsboro: [220, 220, 220, 1.0],
    LightGray: [211, 211, 211, 1.0],
    Silver: [192, 192, 192, 1.0],
    DarkGray: [169, 169, 169, 1.0],
    Gray: [128, 128, 128, 1.0],
    DimGray: [105, 105, 105, 1.0],
    LightSlateGray: [119, 136, 153, 1.0],
    SlateGray: [112, 128, 144, 1.0],
    DarkSlateGray: [47, 79, 79, 1.0],
    Black: [0, 0, 0, 1.0],
} as const;


export { type RGBA, parseColor, rgbaToString, Colors, type DynamicColorVariant };
