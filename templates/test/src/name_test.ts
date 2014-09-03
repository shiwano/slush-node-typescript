require("../test_helper");

import sinon = require("sinon");
import assert = require("power-assert");
import <%= name %> = require("../../src/<%= name %>");

describe("<%= name %>", () => {
  describe("#awesome", () => {
    it("should return awesome string", () => {
      assert(<%= name %>.awesome() === "awesome");
    });
  });
});
