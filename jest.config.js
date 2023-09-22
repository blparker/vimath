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



export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
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
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  // extensionsToTreatAsEsm: [".ts"],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
