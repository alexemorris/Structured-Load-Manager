const castBool = require('./castBool');

describe('Utility functions', () => {
  describe('Cast Bool', () => {
    it('Should detect true', () => {
      const output = ['TRUE', 'true', 1, true].map(castBool);
      expect(output).toEqual([true, true, true, true]);
    });

    it('Should detect false', () => {
      const output = ['FALSE', 'false', 0, false].map(castBool);
      expect(output).toEqual([false, false, false, false]);
    });
  });
});
