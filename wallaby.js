module.exports = function () {

  return {
    files: ['snurra.js'],

    tests: ['*.test.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};