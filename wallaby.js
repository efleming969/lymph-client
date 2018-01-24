module.exports = function () {
  return {
    files: [ "src/**/*.ts", "!src/**/*Tests.ts" ],
    tests: [ "src/**/*Tests.ts" ],
    env: { type: "node", runner: "node" },
    testFramework: "jest"
  }
}
