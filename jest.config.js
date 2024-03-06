/** @type {import('ts-jest').JestConfigWithTsJest} */
/*module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // setupFiles: ['jest-canvas-mock'],
  modulePathIgnorePatterns: ['dist', 'test/specs'],
  globals: {
    "ts-jest": {
      "useESM": true
    }
  },
};*/
import structuredClone from '@ungap/structured-clone'
// import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json';
// const tsconfig = await import('./tsconfig.json', { assert: { type: 'json' } });
// console.log(tsconfig)
// const { compilerOptions } = tsconfig.default;
// console.log("### ", compilerOptions)

// const paths = {
//   "@/*": ["./src/*"],
//   "*": ["./node_modules/*"]
// };


export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable'
  },
  testPathIgnorePatterns: [
     'test/specs',
     'dist'
  ],
  // setupFiles: ["<rootDir>/global.mock.js"],
  setupFiles: ["jest-canvas-mock"],
  // transform: {
  //   "^.+\\.(t|j)s$": "ts-jest",
  //   "\\.[jt]s?$": "ts-jest",
  // },
  // "globals": {
  //   "ts-jest": {
  //     "useESM": true
  //   }
  // },
  globals: {
    structuredClone,
    'ts-jest': {
      tsConfig: './tsconfig.json',
    }
  },
  moduleNameMapper: {
    // moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
    "(.+)\\.js": "$1"
  },
  // extensionsToTreatAsEsm: [".ts"],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
