# iam-utils

[![NPM Version](https://img.shields.io/npm/v/@actsecurity/iam-utils.svg?logo=nodedotjs)](https://www.npmjs.com/package/@actsecurity/iam-utils) [![License: AGPL v3](https://img.shields.io/github/license/act-security-labs/iam-utils)](LICENSE.txt) [![GuardDog](https://github.com/act-security-labs/iam-utils/actions/workflows/guarddog.yml/badge.svg)](https://github.com/act-security-labs/iam-utils/actions/workflows/guarddog.yml) [![Known Vulnerabilities](https://snyk.io/test/github/act-security-labs/iam-utils/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/act-security-labs/iam-utils?targetFile=package.json)

Various utility functions used in IAM packages

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
