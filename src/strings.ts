/**
 * Checks whether two strings are equal under English, case-insensitive, accent-sensitive collation.
 *
 * @param string1 The first string to compare.
 * @param string2 The second string to compare.
 * @returns Whether the strings are equal ignoring case while treating different accents as distinct.
 */
export function equalsIgnoreCase(string1: string, string2: string): boolean {
  return string1.localeCompare(string2, 'en', { sensitivity: 'accent' }) === 0
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
