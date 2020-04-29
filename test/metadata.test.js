import { metadataMatcher } from '../src/metadata';
import similarProfile from './profiles/similar-profile';
import storedProfile from './profiles/stored-profile';
import unmatchingProfile from './profiles/unmatching-profile';
import missingPropsProfile from './profiles/missing-props-profile';
import unmatchingWeightedProfile from './profiles/unmatching-weighted-profile';

const a = { num: 1, undef: undefined, nulla: null, obj: { alpha: 'a', beta: 'b' }, arr: [ 'one', 'two' ] };
const b = { num: 1, undef: undefined, nulla: null, obj: { alpha: 'a', beta: 'c' }, arr: [ 'one', 'three' ] };
const c = { num: 4, undef: undefined, nulla: null, obj: { alpha: 'c', beta: 'b' }, arr: [ 'two', 'three' ] };
const attrWeights = {
  'deviceMemory': 3,
  'fonts': 2,
  'hardwareConcurrency': 3,
  'maxTouchPoints': 2,
  'platform': 3,
  'userAgent': 2,
};

describe('Test simple objects with diverse value types', () => {
  it('should return true for exact profile match', () => {
    const metadataMatch = metadataMatcher({}, 2);
    expect(metadataMatch(a, a)).toBe(true);
  });

  it('should return true for allowed number of mismatch', () => {
    const metadataMatch = metadataMatcher({}, 2);
    expect(metadataMatch(a, b)).toBe(true);
  });

  it('should return false for exceeding allowed mismatch', () => {
    const metadataMatch = metadataMatcher({ num: 3 }, 2);
    expect(metadataMatch(a, c)).toBe(false);
  });
});

describe('Test actual profiles', () => {
  it('should return true for exact profile match', () => {
    const metadataMatch = metadataMatcher(attrWeights, 2);
    expect(metadataMatch(storedProfile.metadata, storedProfile.metadata)).toBe(true);
  });

  it('should return true for allowed number of mismatch', () => {
    const metadataMatch = metadataMatcher(attrWeights, 2);
    expect(metadataMatch(similarProfile.metadata, storedProfile.metadata)).toBe(true);
  });

  it('should return false for exceeding allowed mismatch', () => {
    const metadataMatch = metadataMatcher(attrWeights, 2);
    expect(metadataMatch(unmatchingProfile.metadata, storedProfile.metadata)).toBe(false);
  });

  it('should return false for unmatched single, but highly weighted property', () => {
    const metadataMatch = metadataMatcher(attrWeights, 2);
    expect(metadataMatch(unmatchingWeightedProfile.metadata, storedProfile.metadata)).toBe(false);
  });

  it('should return false, and not crash, for missing props allowed mismatch', () => {
    const metadataMatch = metadataMatcher(attrWeights, 2);
    expect(metadataMatch(missingPropsProfile.metadata, storedProfile.metadata)).toBe(false);
  });
});
