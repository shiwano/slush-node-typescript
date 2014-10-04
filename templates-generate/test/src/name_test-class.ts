require('<%= relativeRootDir %>/test_helper');

import assert = require('power-assert');
import <%= classifyName %> = require('<%= relativeRootDir %>/../src/<%= dirname %>/<%= basename %>');

describe('<%= classifyName %>', () => {
  var instance = () => new <%= classifyName %>();

  describe('#awesome', () => {
    it('should return awesome string', () => {
      assert.strictEqual(instance().awesome(), 'awesome');
    });
  });
});
