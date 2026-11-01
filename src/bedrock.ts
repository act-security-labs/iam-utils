const awsFoundationModelArnPattern = /^arn:[^:]+:bedrock:[^:]*::foundation-model\/[^:]+(?::[^:]+)*$/
const awsFoundationModelPatternWithResourceWildcards =
  /^arn:[^:/?*${}]+:bedrock:[^:?*${}]*::foundation-model\/[^:${}]+(?::[^:${}]+)*$/

/** Options for recognizing AWS-owned foundation model ARNs. */
export interface AwsFoundationModelArnOptions {
  /** Allow IAM wildcards in the model resource component, but not in partition or region. */
  allowResourceWildcards?: boolean
}

/**
 * Identify AWS-owned Bedrock foundation model ARNs.
 *
 * By default, only concrete ARNs are recognized. Resource wildcards can be enabled for
 * matching resource patterns; policy variables are never accepted.
 *
 * @param arn the resource ARN, if specified
 * @param options whether to allow wildcards in the model resource component
 * @returns whether the ARN identifies an accountless foundation model
 */
export function isAwsFoundationModelArn(
  arn: string | undefined,
  options?: AwsFoundationModelArnOptions
): boolean {
  if (!arn) {
    return false
  }
  if (options?.allowResourceWildcards) {
    return awsFoundationModelPatternWithResourceWildcards.test(arn)
  }
  return !/[*?${}]/.test(arn) && awsFoundationModelArnPattern.test(arn)
}
