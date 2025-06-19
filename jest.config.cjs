// jest.config.js (or .cjs)
require('ts-node').register();

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/index.test.ts'],
};
