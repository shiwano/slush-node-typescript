require('../test_helper');

import <%= name %> = require('../../src/<%= name %>');

describe('<%= name %>', () => {
  describe('.awesome', () => {
    it('should return awesome string', () => {
      assert.strictEqual(<%= name %>.awesome(), 'awesome');
    });
  });
});
