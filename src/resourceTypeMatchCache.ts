/** Cache consulted by resource type matching when caching is enabled. */
export interface ResourceTypeMatchCacheProvider {
  /**
   * Return the cached match result or compute it when absent.
   *
   * @param resource - Resource ARN or wildcard pattern
   * @param pattern - Resource type pattern
   * @param compute - Computes the matching result when absent
   * @returns Whether the resource matches the pattern
   */
  getOrCompute(resource: string, pattern: string, compute: () => boolean): boolean
}

/** Identifies one cached resource and pattern pair in insertion order. */
interface CachedPair {
  resource: string
  pattern: string
}

/** A bounded FIFO cache of resource ARN and resource type pattern match results. */
export class ResourceTypeMatchCache implements ResourceTypeMatchCacheProvider {
  private readonly matchesByResource = new Map<string, Map<string, boolean>>()
  private readonly insertionOrder = new Set<CachedPair>()

  /**
   * @param maxEntries - Maximum number of ARN and pattern pairs to retain
   */
  constructor(private readonly maxEntries: number) {
    if (!Number.isSafeInteger(maxEntries) || maxEntries <= 0) {
      throw new RangeError('maxEntries must be a positive safe integer')
    }
  }

  /**
   * Return a cached result, or compute and retain it when absent.
   *
   * @param resource - Resource ARN or wildcard pattern
   * @param pattern - Resource type pattern
   * @param compute - Computes the result when absent
   * @returns Whether the resource matches the pattern
   */
  getOrCompute(resource: string, pattern: string, compute: () => boolean): boolean {
    const cached = this.matchesByResource.get(resource)?.get(pattern)
    if (cached !== undefined) {
      return cached
    }

    const result = compute()
    // A reentrant computation may have inserted this pair while computing the result.
    if (this.matchesByResource.get(resource)?.has(pattern)) {
      return result
    }
    if (this.insertionOrder.size >= this.maxEntries) {
      const oldest = this.insertionOrder.values().next().value!
      const patterns = this.matchesByResource.get(oldest.resource)!
      patterns.delete(oldest.pattern)
      if (patterns.size === 0) {
        this.matchesByResource.delete(oldest.resource)
      }
      this.insertionOrder.delete(oldest)
    }

    let patterns = this.matchesByResource.get(resource)
    if (!patterns) {
      patterns = new Map()
      this.matchesByResource.set(resource, patterns)
    }
    patterns.set(pattern, result)
    this.insertionOrder.add({ resource, pattern })
    return result
  }
}
