import { describe, expect, it } from 'vitest'
import {
  convertCloudFrontIdentityArnToOriginAccessUserArn,
  convertCloudFrontOriginAccessUserArnToIdentityArn,
  isCloudFrontIdentityArn,
  isCloudFrontOriginAccessUserArn
} from './index.js'

describe('CloudFront origin access identity ARNs', () => {
  it.each(['aws', 'aws-us-gov', 'aws-iso-b'])(
    'converts both forms in partition %s',
    (partition) => {
      //Given account-qualified and policy-principal forms of the same OAI
      const identity = `arn:${partition}:cloudfront::123456789012:origin-access-identity/E123ABC`
      const user = `arn:${partition}:iam::cloudfront:user/CloudFront Origin Access Identity E123ABC`

      //When the forms are identified and converted
      const convertedUser = convertCloudFrontIdentityArnToOriginAccessUserArn(identity)
      const convertedIdentity = convertCloudFrontOriginAccessUserArnToIdentityArn(
        user,
        '123456789012'
      )

      //Then each form is recognized and the owner is supplied explicitly for the reverse conversion
      expect(isCloudFrontIdentityArn(identity)).toBe(true)
      expect(isCloudFrontOriginAccessUserArn(user)).toBe(true)
      expect(convertedUser).toBe(user)
      expect(convertedIdentity).toBe(identity)
    }
  )

  it.each([
    'arn:aws:cloudfront:us-east-1:123456789012:origin-access-identity/E123',
    'arn:aws:cloudfront::12345678901:origin-access-identity/E123',
    'arn:aws:cloudfront::123456789012:origin-access-identity/',
    'arn:aws:cloudfront::123456789012:origin-access-identity/E123/*',
    'arn:aws:cloudfront::123456789012:origin-access-identity/E*',
    'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ',
    'arn:aws:iam::123456789012:user/CloudFront Origin Access Identity E123',
    'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E123/extra',
    'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E?',
    'not-an-arn'
  ])('rejects a non-concrete or malformed form: %s', (arn) => {
    //Given an invalid OAI resource or user ARN
    //When both forms are checked
    const isIdentity = isCloudFrontIdentityArn(arn)
    const isUser = isCloudFrontOriginAccessUserArn(arn)

    //Then neither is recognized
    expect(isIdentity).toBe(false)
    expect(isUser).toBe(false)
  })

  it('rejects invalid conversion inputs rather than inventing an owner', () => {
    //Given malformed forms and an invalid owner account
    const user = 'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E123'

    //When converting them
    //Then each invalid input produces an explicit error
    expect(() => convertCloudFrontIdentityArnToOriginAccessUserArn(user)).toThrow(
      'Invalid CloudFront origin access identity ARN'
    )
    expect(() =>
      convertCloudFrontOriginAccessUserArnToIdentityArn('invalid', '123456789012')
    ).toThrow('Invalid CloudFront origin access user ARN')
    expect(() => convertCloudFrontOriginAccessUserArnToIdentityArn(user, 'cloudfront')).toThrow(
      'Invalid CloudFront origin access identity owner account ID'
    )
  })
})
