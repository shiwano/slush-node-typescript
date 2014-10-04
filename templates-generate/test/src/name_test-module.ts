require("<%= relativeRootDir %>/test_helper");

import sinon = require("sinon");
import assert = require("power-assert");
import <%= basename %> = require("<%= relativeRootDir %>/../src/<%= dirname %>/<%= basename %>");

describe("<%= basename %>", () => {
  describe(".awesome", () => {
    it("should return awesome string", () => {
      assert.strictEqual(<%= basename %>.awesome(), "awesome");
    });
  });
});
