/** @type {import('ts-jest').JestConfigWithTsJest} */
import structuredClone from '@ungap/structured-clone'

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
     'test/specs',
     'dist'
  ],
  setupFiles: ["jest-canvas-mock"],
  globals: {
    structuredClone,
    'ts-jest': {
      tsConfig: './tsconfig.json',
    }
  },
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
