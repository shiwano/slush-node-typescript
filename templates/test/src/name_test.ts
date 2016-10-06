/// <reference path="../../typings/index.d.ts" />

import { expect } from 'chai';

import awesome from '../../src/<%= name %>';

describe('<%= name %>', () => {
  it('should return awesome string', () => {
    expect(awesome()).to.eql('awesome');
  });
});

