module.exports = function () {

  return {
    files: ['snurra.js'],

    tests: ['snurra.test.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};