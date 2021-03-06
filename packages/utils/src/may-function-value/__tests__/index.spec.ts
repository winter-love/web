import {mayFunctionValue} from '../'

describe('may-function-value', () => {
  it('should return value from function execution', () => {
    const result = mayFunctionValue(() => 'foo')
    expect(result).toBe('foo')
  })
  it('should return value from value which is not a function', () => {
    const result = mayFunctionValue('bar')
    expect(result).toBe('bar')
  })
})
