/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/src/test",
    ".testutils.ts"
  ],
  moduleNameMapper: {
    '^@entities/(.*)$': '<rootDir>/src/domain/entities/$1',
    '^@usecases/(.*)$': '<rootDir>/src/domain/usecases/$1',
    '^@repos/(.*)$': '<rootDir>/src/infra/repositories/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@DB/(.*)$': '<rootDir>/src/infra/DB/$1',
  },
};