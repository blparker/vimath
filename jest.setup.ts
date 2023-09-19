
expect.extend({
  toBeCloseToArray(actual, expected, delta = Math.pow(10, -5)) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
      throw new Error('Actual and expected values must both be arrays');
    } else if (actual.length !== expected.length) {
      // throw new Error('Actual and expected arrays must be of ')
      return {
        pass: false,
        message: () => `expected ${actual} and ${expected} to be of equal lengths`
      };
    } else {
      const pass = expected.every((v, i) => Math.abs(actual[i] - v) <= delta);
      return {
        pass,
        message: pass
          ? () => `expected ${actual} to not be close to ${expected}`
          : () => `expected ${actual} to be close to ${expected}`
      };
    }
  }
});
