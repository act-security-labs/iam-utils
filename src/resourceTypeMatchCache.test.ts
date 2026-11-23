import { describe, expect, it } from 'vitest'
import { ResourceTypeMatchCache } from './resourceTypeMatchCache.js'

describe('ResourceTypeMatchCache', () => {
  it('retains true and false results and distinguishes arbitrary pair keys', () => {
    //Given a cache and pairs that would collide with a NUL-delimited key
    const cache = new ResourceTypeMatchCache(3)
    let computations = 0
    const compute = (value: boolean) => () => {
      computations++
      return value
    }

    //When each pair is matched twice
    expect(cache.getOrCompute('a\0b', 'c', compute(false))).toBe(false)
    expect(cache.getOrCompute('a', 'b\0c', compute(true))).toBe(true)
    expect(cache.getOrCompute('a\0b', 'c', compute(true))).toBe(false)
    expect(cache.getOrCompute('a', 'b\0c', compute(false))).toBe(true)

    //Then the original results were retained independently
    expect(computations).toBe(2)
  })

  it('evicts the oldest inserted pair at capacity, even after a hit', () => {
    //Given two cached results
    const cache = new ResourceTypeMatchCache(2)
    let computations = 0
    const compute = () => {
      computations++
      return true
    }
    cache.getOrCompute('a', 'one', compute)
    cache.getOrCompute('a', 'two', compute)

    //When the first is accessed and a third pair is inserted
    cache.getOrCompute('a', 'one', compute)
    cache.getOrCompute('b', 'three', compute)
    cache.getOrCompute('a', 'two', compute)
    expect(computations).toBe(3)

    //Then the first inserted pair was evicted
    cache.getOrCompute('a', 'one', compute)
    expect(computations).toBe(4)
  })

  it('does not retain duplicate entries when computation reenters the same pair', () => {
    //Given a cache and an outer computation that reenters for the same pair
    const cache = new ResourceTypeMatchCache(2)
    const result = cache.getOrCompute('a', 'one', () => cache.getOrCompute('a', 'one', () => true))

    //When a second pair is inserted
    cache.getOrCompute('b', 'two', () => false)

    //Then the first pair still fits in the two-entry cache
    expect(result).toBe(true)
    expect(cache.getOrCompute('a', 'one', () => false)).toBe(true)
  })

  it('retains only the newest pairs through repeated evictions across resources', () => {
    //Given a small cache
    const cache = new ResourceTypeMatchCache(3)
    let computations = 0
    const compute = () => {
      computations++
      return true
    }

    //When many pairs, including multiple patterns per resource, are inserted
    for (let i = 0; i < 100; i++) {
      cache.getOrCompute(`resource-${Math.floor(i / 2)}`, `pattern-${i}`, compute)
    }
    for (let i = 97; i < 100; i++) {
      cache.getOrCompute(`resource-${Math.floor(i / 2)}`, `pattern-${i}`, compute)
    }

    //Then the last three pairs remain and an older pair must be recomputed
    expect(computations).toBe(100)
    cache.getOrCompute('resource-48', 'pattern-96', compute)
    expect(computations).toBe(101)
  })

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid capacity %s',
    (maxEntries) => {
      //Given an invalid capacity
      //When constructing a cache
      //Then the capacity is rejected
      expect(() => new ResourceTypeMatchCache(maxEntries)).toThrow(
        'maxEntries must be a positive safe integer'
      )
    }
  )
})
