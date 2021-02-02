module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/jest.env.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  reporters: [
    'default',
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report"
    }]
  ],
  runner: 'jest-serial-runner'
};
