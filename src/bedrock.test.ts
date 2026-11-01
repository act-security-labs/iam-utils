import { describe, expect, it } from 'vitest'
import { isAwsFoundationModelArn } from './bedrock.js'

describe('isAwsFoundationModelArn', () => {
  it.each([
    ['arn:aws:bedrock:us-east-1::foundation-model/example.model-v1:0', true],
    ['arn:aws-us-gov:bedrock:::foundation-model/example', true],
    ['arn:aws:bedrock:us-east-1:123456789012:foundation-model/example', false],
    ['arn:aws:bedrock:us-east-1::inference-profile/example', false],
    ['arn:aws:bedrock:us-east-1::foundation-model/*', false],
    ['arn:aws:bedrock:us-east-1::foundation-model/', false],
    ['arn:aws:s3:::example', false]
  ])('classifies %s as %s', (arn, expected) => {
    //Given a candidate resource ARN
    //When the model classifier evaluates it
    const result = isAwsFoundationModelArn(arn)
    //Then only concrete accountless foundation models are recognized
    expect(result).toBe(expected)
  })

  it.each([
    ['arn:aws:bedrock:::foundation-model/*', true],
    ['arn:aws:bedrock:us-east-1::foundation-model/*', true],
    ['arn:aws:bedrock:us-east-1:123456789012:foundation-model/*', false],
    ['arn:aws:bedrock:::foundation-model/example?', true],
    ['arn:aws:bedrock:::foundation-model/example/extra', true],
    ['arn:*:bedrock:::foundation-model/example', false],
    ['arn:aws:bedrock:*::foundation-model/example', false],
    ['arn:aws:bedrock:::foundation-model/${Model}', false],
    ['arn:aws:bedrock:${Region}::foundation-model/example', false],
    ['arn:aws:bedrock:::foundation-model/', false]
  ])('classifies resource patterns %s as %s when requested', (arn, expected) => {
    //Given an ARN that may contain resource-only IAM wildcards
    //When the classifier is explicitly asked to allow resource wildcards
    const result = isAwsFoundationModelArn(arn, { allowResourceWildcards: true })
    //Then wildcards are accepted only in the model resource component
    expect(result).toBe(expected)
  })

  it('rejects a missing ARN when allowing resource wildcards', () => {
    expect(isAwsFoundationModelArn(undefined, { allowResourceWildcards: true })).toBe(false)
  })
})
