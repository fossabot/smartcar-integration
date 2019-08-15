/* eslint-disable @typescript-eslint/rule-name */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/*.(test|spec).ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  setupFiles: ["<rootDir>/src/init.ts"],
  coverageDirectory: "./coverage"
};
