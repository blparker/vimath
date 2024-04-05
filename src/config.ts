import { Easing } from '@/animation/easing';


const DEFAULT_CONFIG = {
    // In relative units
    xTicks: 14,
    yTicks: 8,

    lineWidth: 3,

    animation: {
        durationMs: 1000,
        reverse: false,
        repeat: false,
        yoyo: true,
        easing: Easing.easeInOutCubic,
        numberOfTimes: Infinity,
        blocking: true,
    },

    showFps: false,
    responsiveResize: true,

    renderer: 'html' as 'html' | 'rough',

    // In pixels
    canvasWidth: 860,
    canvasHeight: 500,
    canvasPadding: 20,
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
