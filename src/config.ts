import { Easing } from '@/animation/easing';
import { Canvas } from '@/canvas';


const DEFAULT_CONFIG = {
    // In relative units
    xTicks: 14,
    yTicks: 8,

    lineWidth: 4,

    animation: {
        durationMs: 1000,
        reverse: false,
        repeat: false,
        yoyo: true,
        easing: Easing.easeInOutCubic,
        numberOfTimes: Infinity,
        blocking: true,
    },

    arrowTipSize: 0.15,
    standoff: 0.15,

    showFps: false,
    responsiveResize: true,

    renderer: 'html' as 'html' | 'rough',

    // In pixels
    canvasWidth: 860,
    canvasHeight: 500,
    canvasPadding: 20,
    canvasInstance: undefined as Canvas | undefined,
};


type Config = typeof DEFAULT_CONFIG;

let config = { ...DEFAULT_CONFIG };


function globalConfig(userConfig: Partial<Config>) {
    config = { ...config, ...userConfig };
}


// function getConfig() {
//     return config;
// }


export { globalConfig, config, type Config };
