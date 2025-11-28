module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/server.js',      // ← Ignorar servidor (apenas inicialização)
    '!src/app.js'          // ← Ignorar app (configuração Express)
  ],
  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.js'],
  clearMocks: true,
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
