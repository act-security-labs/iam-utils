export { actionMatchesPattern } from './actions.js'
export { isAwsFoundationModelArn, type AwsFoundationModelArnOptions } from './bedrock.js'
export { getResourceSegments, splitArnParts, type ArnParts } from './arn.js'
export {
  convertAssumedRoleArnToRoleArn,
  convertRoleArnToAssumedRoleArn,
  isArnPrincipal,
  isAssumedRoleArn,
  isFederatedUserArn,
  isIamRoleArn,
  isIamUserArn,
  isRootArn,
  isServicePrincipal
} from './principals.js'
export { convertResourcePatternToRegex } from './resourcePatterns.js'
export { resourceArnWithWildcardsToRegex } from './resources.js'
export {
  mostSpecificMatchingResourceTypePatterns,
  resourceStringMatchesResourceTypePattern
} from './resourceTypes.js'
export {
  actionSupportsAwsResourceInfoContextKeys,
  isAwsResourceInfoExcludedAction
} from './resourceInfoContextKeys.js'
export { bucketArn, isS3BucketOrObjectArn } from './s3.js'
export { equalsIgnoreCase, normalizeCaseInsensitive, splitSlice } from './strings.js'
