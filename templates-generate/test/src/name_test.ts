require("<%= relativeRootDir %>/test_helper");

import sinon = require("sinon");
import assert = require("power-assert");
import <%= classifyName %> = require("<%= relativeRootDir %>/../src/<%= dirname %>/<%= basename %>");

describe("<%= classifyName %>", () => {
  var instance = () => new <%= classifyName %>();

  describe("#awesome", () => {
    it("should return awesome string", () => {
      assert.strictEqual(instance().awesome(), "awesome");
    });
  });
});
