require('<%= relativeRootDir %>/test_helper');

import <%= classifyName %> = require('<%= relativeRootDir %>/../src/<%= dirname === '.' ? '' : dirname + '/' %><%= basename %>');

describe('<%= classifyName %>', () => {
  var instance: <%= classifyName %>;

  beforeEach(() => {
    instance = new <%= classifyName %>();
  });

  describe('#awesome', () => {
    it('should return awesome string', () => {
      assert.strictEqual(instance.awesome(), 'awesome');
    });
  });
});
