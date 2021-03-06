import {drop} from '../'

describe('utils', () => {
  it('should return an array without first item from an original array & should not remove any items in the original array', () => {
    const array = ['foo', 'bar', 'john']
    expect(drop(array)).toEqual(['bar', 'john'])
    expect(array).toEqual(['foo', 'bar', 'john'])
  })
})
