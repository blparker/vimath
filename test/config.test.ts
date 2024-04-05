import { expect, test } from 'vitest';
import { config, globalConfig } from '../src/config';


test('default config', () => {
    console.log(config);
    globalConfig({ lineWidth: 5 });
    console.log(config);
});
