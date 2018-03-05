module.exports = function () {
  return {
    files: [ "tsconfig.json", "src/**/*.ts", "!src/**/*.tests.ts" ],
    tests: [ "src/**/*.tests.ts" ],
    env: { type: "node", runner: "node" },
    testFramework: "jest"
  }
}
