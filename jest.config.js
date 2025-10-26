module.exports = {
  testEnvironment: 'jsdom', // Simulates browser environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Custom setup file
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'], // Where to look for tests
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Optional: For alias if you use @/ in imports
  },
};