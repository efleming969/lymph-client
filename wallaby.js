module.exports = function () {
  return {
    files: [ "src/**/*.ts", "!src/**/*.tests.ts" ],
    tests: [ "src/**/*.tests.ts" ],
    env: { type: "node", runner: "node" },
    testFramework: "jest"
  }
}
