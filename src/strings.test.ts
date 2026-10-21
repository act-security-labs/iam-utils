import { describe, expect, it } from 'vitest'
import { equalsIgnoreCase, splitSlice } from './strings.js'

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

  it('should use English case-insensitive collation', () => {
    //Given ASCII and Turkish dotted-I comparisons
    const asciiCaseVariantsMatch = equalsIgnoreCase('I', 'i')
    const dottedTurkishIIsDistinct = equalsIgnoreCase('İ', 'i')

    //When evaluating the comparison results
    //Then English case variants should match and dotted Turkish I should remain distinct
    expect(asciiCaseVariantsMatch).toBe(true)
    expect(dottedTurkishIIsDistinct).toBe(false)
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
