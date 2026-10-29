import { describe, expect, it } from 'vitest'
import { equalsIgnoreCase, normalizeCaseInsensitive, splitSlice } from './strings.js'
import { unicodeCaseMapping } from './unicodeCaseMapping.js'

describe('equalsIgnoreCase', () => {
  it('should match strings with different casing', () => {
    //Given strings that differ only by case
    const string1 = 'GetObject'
    const string2 = 'gEtObJeCt'

    //When comparing the strings
    const result = equalsIgnoreCase(string1, string2)

    //Then they should match
    expect(result).toBe(true)
  })

  it('should treat strings with different accents as distinct', () => {
    //Given strings that differ by an accent
    const string1 = 'café'
    const string2 = 'cafe'

    //When comparing the strings
    const result = equalsIgnoreCase(string1, string2)

    //Then they should not match
    expect(result).toBe(false)
  })

  it.each([
    ['I', 'ı', true],
    ['i', 'İ', true],
    ['σ', 'ς', true],
    ['𐐀x', '𐐨X', true],
    ['ß', 'ẞ', true],
    ['ß', 'ss', false],
    ['a', 'ａ', false],
    ['é', 'e\u0301', false],
    ['ab', 'a\u0000b', false],
    ['a\ud800', 'A\ud800', true],
    ['a\udc00', 'A\udc00', true],
    ['a', 'ab', false],
    ['', '', true]
  ])('compares %j and %j according to the pinned mapping', (first, second, expected) => {
    //Given two strings with a known case relationship
    //When comparing and normalizing both strings
    const result = equalsIgnoreCase(first, second)
    const normalizedMatch = normalizeCaseInsensitive(first) === normalizeCaseInsensitive(second)

    //Then both operations agree with the expected result in both directions
    expect(result).toBe(expected)
    expect(equalsIgnoreCase(second, first)).toBe(expected)
    expect(normalizedMatch).toBe(expected)
  })

  it('produces a deterministic normalized map key', () => {
    //Given a key with ASCII, Turkish I and supplementary-plane characters
    const key = 'AWS:ResourceTag/İ𐐀'

    //When normalizing the key
    const normalized = normalizeCaseInsensitive(key)

    //Then each character uses the pinned case representative
    expect(normalized).toBe('aws:resourcetag/i𐐨')
  })

  it('normalizes each generated mapping idempotently', () => {
    //Given every code point in the generated mapping
    //When normalizing each source and target
    for (const [source, target] of unicodeCaseMapping) {
      const input = String.fromCodePoint(source)
      const expected = String.fromCodePoint(target)

      //Then equality and normalization share an idempotent representative
      expect(input.length).toBe(expected.length)
      expect(normalizeCaseInsensitive(input)).toBe(expected)
      expect(normalizeCaseInsensitive(expected)).toBe(expected)
      expect(equalsIgnoreCase(input, expected)).toBe(true)
    }
  })

  it('should return false for different strings', () => {
    //Given different strings
    const string1 = 'GetObject'
    const string2 = 'PutObject'

    //When comparing the strings
    const result = equalsIgnoreCase(string1, string2)

    //Then they should not match
    expect(result).toBe(false)
  })
})

describe('splitSlice', () => {
  const splitCases = [
    { name: 'ordinary delimiters', string: 'one,two,three', delimiter: ',' },
    { name: 'a multi-character delimiter', string: 'one::two::three', delimiter: '::' },
    { name: 'an absent delimiter', string: 'one', delimiter: ',' },
    { name: 'leading and trailing delimiters', string: ',one,', delimiter: ',' },
    { name: 'consecutive delimiters', string: 'one,,two', delimiter: ',' },
    { name: 'an empty string and non-empty delimiter', string: '', delimiter: ',' },
    { name: 'an empty string and empty delimiter', string: '', delimiter: '' },
    { name: 'an empty delimiter with a surrogate pair', string: 'a😀b', delimiter: '' }
  ]

  for (const { name, string, delimiter } of splitCases) {
    it(`should match native split for ${name}`, () => {
      //Given a string and delimiter
      const expected = string.split(delimiter)

      //When splitting with splitSlice
      const result = splitSlice(string, delimiter)

      //Then it should produce the same segments as native split
      expect(result).toEqual(expected)
    })
  }
})
