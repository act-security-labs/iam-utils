import { unicodeCaseMapping } from './unicodeCaseMapping.js'

/**
 * Maps a code point using Unicode 15.1 simple uppercase followed by simple lowercase.
 *
 * @param codePoint The code point to map.
 * @returns The case-insensitive representative.
 */
function caseInsensitiveCodePoint(codePoint: number): number {
  if (codePoint >= 65 && codePoint <= 90) {
    return codePoint + 32
  }
  if (codePoint < 128) {
    return codePoint
  }
  return unicodeCaseMapping.get(codePoint) ?? codePoint
}

/**
 * Compares strings using locale-independent Unicode 15.1 simple case mappings.
 * Accents, character width and Unicode normalization forms remain distinct. This is not
 * the matching rule for IAM's StringEqualsIgnoreCase condition operator.
 * No normalized copies of the input strings are constructed.
 *
 * @param string1 The first string to compare.
 * @param string2 The second string to compare.
 * @returns Whether the strings are equal under these case mappings.
 */
export function equalsIgnoreCase(string1: string, string2: string): boolean {
  // Every mapping in the pinned table preserves UTF-16 width.
  if (string1.length !== string2.length) {
    return false
  }

  let index1 = 0
  let index2 = 0
  while (index1 < string1.length && index2 < string2.length) {
    const first = string1.codePointAt(index1)!
    const second = string2.codePointAt(index2)!
    if (caseInsensitiveCodePoint(first) !== caseInsensitiveCodePoint(second)) {
      return false
    }
    index1 += first > 0xffff ? 2 : 1
    index2 += second > 0xffff ? 2 : 1
  }
  return index1 === string1.length && index2 === string2.length
}

/**
 * Creates a map or set key consistent with {@link equalsIgnoreCase}.
 * This allocates a new string; use equalsIgnoreCase for pairwise comparisons.
 *
 * @param value The string to normalize.
 * @returns The case-insensitive representative of the string.
 */
export function normalizeCaseInsensitive(value: string): string {
  let normalized = ''
  for (const character of value) {
    normalized += String.fromCodePoint(caseInsensitiveCodePoint(character.codePointAt(0)!))
  }
  return normalized
}

/**
 * Splits a string by a string delimiter using `slice` for each result segment.
 *
 * For an empty delimiter, this matches `String.prototype.split` by returning one segment for each
 * UTF-16 code unit, including separate segments for the halves of a surrogate pair.
 *
 * @param string The string to split.
 * @param delimiter The string that separates result segments.
 * @returns The segments of the input string, matching `String.prototype.split` for a string delimiter.
 * @see String.prototype.split
 */
export function splitSlice(string: string, delimiter: string): string[] {
  if (delimiter === '') {
    const segments: string[] = []

    for (let index = 0; index < string.length; index++) {
      segments.push(string.slice(index, index + 1))
    }

    return segments
  }

  const segments: string[] = []
  let segmentStart = 0
  let delimiterIndex = string.indexOf(delimiter, segmentStart)

  while (delimiterIndex !== -1) {
    segments.push(string.slice(segmentStart, delimiterIndex))
    segmentStart = delimiterIndex + delimiter.length
    delimiterIndex = string.indexOf(delimiter, segmentStart)
  }

  segments.push(string.slice(segmentStart))
  return segments
}
