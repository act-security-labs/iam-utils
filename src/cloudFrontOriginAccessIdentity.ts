/** Patterns for the account-owned resource ARN and the S3 policy principal ARN of an OAI. */
const identityArnPattern =
  /^arn:([a-zA-Z0-9-]+):cloudfront::(\d{12}):origin-access-identity\/([a-zA-Z0-9]+)$/
const userArnPattern =
  /^arn:([a-zA-Z0-9-]+):iam::cloudfront:user\/CloudFront Origin Access Identity ([a-zA-Z0-9]+)$/

/**
 * Check whether an ARN identifies a CloudFront origin access identity resource.
 *
 * @param arn The ARN to inspect.
 * @returns Whether the ARN has the account-qualified OAI resource form.
 */
export function isCloudFrontIdentityArn(arn: string): boolean {
  return identityArnPattern.test(arn)
}

/**
 * Check whether an ARN identifies an OAI as an S3 resource-policy principal.
 *
 * @param arn The ARN to inspect.
 * @returns Whether the ARN has the OAI origin access user form.
 */
export function isCloudFrontOriginAccessUserArn(arn: string): boolean {
  return userArnPattern.test(arn)
}

/**
 * Convert an OAI resource ARN to its S3 policy principal ARN. The resource's owner account is
 * not present in the returned ARN.
 *
 * @param identityArn The account-qualified OAI resource ARN.
 * @returns The origin access user ARN for the same partition and identity ID.
 * @throws If the input is not an OAI resource ARN.
 */
export function convertCloudFrontIdentityArnToOriginAccessUserArn(identityArn: string): string {
  const match = identityArnPattern.exec(identityArn)
  if (!match) {
    throw new Error(`Invalid CloudFront origin access identity ARN: ${identityArn}`)
  }
  return `arn:${match[1]}:iam::cloudfront:user/CloudFront Origin Access Identity ${match[3]}`
}

/**
 * Convert an OAI policy principal ARN to an account-qualified OAI resource ARN.
 * The policy principal does not encode its owner's account; the caller must supply it.
 *
 * @param userArn The OAI origin access user ARN.
 * @param ownerAccountId The 12-digit account ID that owns the OAI.
 * @returns The OAI resource ARN for the supplied owner and the same partition and identity ID.
 * @throws If the principal ARN or owner account ID is invalid.
 */
export function convertCloudFrontOriginAccessUserArnToIdentityArn(
  userArn: string,
  ownerAccountId: string
): string {
  const match = userArnPattern.exec(userArn)
  if (!match) {
    throw new Error(`Invalid CloudFront origin access user ARN: ${userArn}`)
  }
  if (!/^\d{12}$/.test(ownerAccountId)) {
    throw new Error(`Invalid CloudFront origin access identity owner account ID: ${ownerAccountId}`)
  }
  return `arn:${match[1]}:cloudfront::${ownerAccountId}:origin-access-identity/${match[2]}`
}
