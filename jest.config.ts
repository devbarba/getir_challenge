export default {
    preset: '@shelf/jest-mongodb',
    testTimeout: 20000,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    modulePathIgnorePatterns: ['src/interfaces', 'src/server.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            lines: 99,
        },
    },
};
