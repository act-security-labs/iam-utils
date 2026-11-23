# iam-utils

[![NPM Version](https://img.shields.io/npm/v/@actsecurity/iam-utils.svg?logo=nodedotjs)](https://www.npmjs.com/package/@actsecurity/iam-utils) [![License: AGPL v3](https://img.shields.io/github/license/act-security-labs/iam-utils)](LICENSE.txt) [![GuardDog](https://github.com/act-security-labs/iam-utils/actions/workflows/guarddog.yml/badge.svg)](https://github.com/act-security-labs/iam-utils/actions/workflows/guarddog.yml) [![Known Vulnerabilities](https://snyk.io/test/github/act-security-labs/iam-utils/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/act-security-labs/iam-utils?targetFile=package.json)

Various utility functions used in IAM packages

## Optional resource type match cache

Resource type matching does not cache by default. For workloads that repeatedly match the same
resource ARN and resource type pattern, opt in once without changing individual match calls:

```ts
import {
  enableResourceTypeMatchCache,
  disableResourceTypeMatchCache,
  ResourceTypeMatchCache
} from '@actsecurity/iam-utils'

enableResourceTypeMatchCache() // Built-in cache, up to 10,000 pairs.
// Or use a different capacity, or any ResourceTypeMatchCacheProvider implementation:
enableResourceTypeMatchCache(new ResourceTypeMatchCache(50_000))
// Run analysis; existing resource type matching calls use the shared cache.
disableResourceTypeMatchCache()
```

The built-in cache stores matching and non-matching results, bounded by the number of ARN/pattern
pairs. When full, the oldest inserted entry is evicted (FIFO). Its constructor requires a positive
safe integer capacity and throws a `RangeError` otherwise. Enabling again replaces the active cache;
disabling detaches it. A custom `ResourceTypeMatchCacheProvider` must implement `getOrCompute` and
is responsible for correct results and its own storage limits; its exceptions propagate to callers.

The cache is shared across callers of the same loaded module copy, including direct matches and
`mostSpecificMatchingResourceTypePatterns`. Concurrent operations share its lifecycle: disabling
it affects them all. Separate module copies, including separately loaded CommonJS and ESM copies,
have independent caches. Cached ARN and pattern strings remain in memory until eviction or disable.

## Case-insensitive comparisons

`equalsIgnoreCase` compares code points without allocating lowercase copies. It uses Unicode
15.1 simple uppercase followed by simple lowercase, independently of the host locale. Accents,
character width and Unicode normalization forms remain distinct. This is a behavioral change
from the previous English accent-sensitive collation: for example, `İ` and `i` now
compare equal. This is not the rule for IAM's `StringEqualsIgnoreCase` condition operator.

`normalizeCaseInsensitive` produces a string suitable for case-insensitive map and set keys;
its equality is consistent with `equalsIgnoreCase`. Unlike the comparator, it allocates a new
string. The mapping is generated from Unicode 15.1 `UnicodeData.txt`; see
`scripts/generate-case-mapping.mjs` and the Unicode license linked in the generated file.
