/// <reference path="../../typings/index.d.ts" />

import '../test_helper';
const expect = chai.expect;

import awesome from '../../src/<%= name %>';

describe('<%= name %>', () => {
  it('should return awesome string', () => {
    expect(awesome()).to.eql('awesome');
  });
});

