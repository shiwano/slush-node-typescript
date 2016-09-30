import '../test_helper';
import { expect } from 'chai';

import awesome from '../../src/<%= name %>';

describe('<%= name %>', () => {
  it('should return awesome string', () => {
    expect(awesome()).to.eql('awesome');
  });
});

