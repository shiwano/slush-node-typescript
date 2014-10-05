require('<%= relativeRootDir %>/test_helper');

import <%= basename %> = require('<%= relativeRootDir %>/../src/<%= dirname === '.' ? '' : dirname + '/' %><%= basename %>');

describe('<%= basename %>', () => {
  describe('.awesome', () => {
    it('should return awesome string', () => {
      assert.strictEqual(<%= basename %>.awesome(), 'awesome');
    });
  });
});
