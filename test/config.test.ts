import { expect, test } from 'vitest';
import { config, globalConfig } from '../src/config';


test('default config', () => {
    globalConfig({ lineWidth: 5 });
});
