import { describe, expect, it } from 'vitest'
import {
  convertAssumedRoleArnToRoleArn,
  convertRoleArnToAssumedRoleArn,
  isAssumedRoleArn,
  isFederatedUserArn,
  isIamRoleArn,
  isIamUserArn,
  isRootArn,
  isServicePrincipal
} from './principals.js'

describe('convertAssumedRoleArnToRoleArn', () => {
  it('should return the role ARN from an assumed role ARN', () => {
    //Given an assumed role ARN
    const assumedRoleArn = 'arn:aws:sts::123456789012:assumed-role/role-name/session-name'

    //When we get the role ARN from the assumed role ARN
    const result = convertAssumedRoleArnToRoleArn(assumedRoleArn)

    //Then it should return the role ARN
    expect(result).toBe('arn:aws:iam::123456789012:role/role-name')
  })

  it('should return the role ARN from an assumed role ARN with a path', () => {
    //Given an assumed role ARN
    const assumedRoleArn = 'arn:aws:sts::123456789012:assumed-role/admin/global-admin/session-name'

    //When we get the role ARN from the assumed role ARN
    const result = convertAssumedRoleArnToRoleArn(assumedRoleArn)

    //Then it should return the role ARN
    expect(result).toBe('arn:aws:iam::123456789012:role/admin/global-admin')
  })

  it('should work in a different partition', () => {
    //Given an assumed role ARN with a different partition
    const assumedRoleArn = 'arn:aws-cn:sts::123456789012:assumed-role/role-name/session-name'

    //When we get the role ARN from the assumed role ARN
    const result = convertAssumedRoleArnToRoleArn(assumedRoleArn)

    //Then it should return the role ARN
    expect(result).toBe('arn:aws-cn:iam::123456789012:role/role-name')
  })
})

describe('convertRoleArnToAssumedRoleArn', () => {
  it('should return the assumed role ARN from a role ARN', () => {
    //Given a role ARN
    const roleArn = 'arn:aws:iam::123456789012:role/role-name'

    //When we get the assumed role ARN from the role ARN
    const result = convertRoleArnToAssumedRoleArn(roleArn, 'session-name')

    //Then it should return the assumed role ARN
    expect(result).toBe('arn:aws:sts::123456789012:assumed-role/role-name/session-name')
  })

  it('should return the assumed role ARN from a role ARN with a path', () => {
    //Given a role ARN
    const roleArn = 'arn:aws:iam::123456789012:role/admin/global-admin'

    //When we get the assumed role ARN from the role ARN
    const result = convertRoleArnToAssumedRoleArn(roleArn, 'session-name')

    //Then it should return the assumed role ARN
    expect(result).toBe('arn:aws:sts::123456789012:assumed-role/admin/global-admin/session-name')
  })

  it('should work with a different partition', () => {
    //Given a role ARN with a different partition
    const roleArn = 'arn:aws-cn:iam::123456789012:role/role-name'

    //When we get the assumed role ARN from the role ARN
    const result = convertRoleArnToAssumedRoleArn(roleArn, 'session-name')

    //Then it should return the assumed role ARN
    expect(result).toBe('arn:aws-cn:sts::123456789012:assumed-role/role-name/session-name')
  })
})

describe('isAssumedRoleArn', () => {
  it('should return true for assumed role ARN', () => {
    //Given an assumed role ARN
    const assumedRoleArn = 'arn:aws:sts::123456789012:assumed-role/role-name/session-name'

    //When we check if it is an assumed role ARN
    const result = isAssumedRoleArn(assumedRoleArn)

    //Then it should return true
    expect(result).toBe(true)
  })

  it('should return false for non-assumed role ARN', () => {
    //Given a non-assumed role ARN
    const userArn = 'arn:aws:iam::123456789012:user/user-name'

    //When we check if it is an assumed role ARN
    const result = isAssumedRoleArn(userArn)

    //Then it should return false
    expect(result).toBe(false)
  })

  it('should work for a different partition', () => {
    //Given an assumed role ARN with a different partition
    const assumedRoleArn = 'arn:aws-cn:sts::123456789012:assumed-role/role-name/session-name'

    //When we check if it is an assumed role ARN
    const result = isAssumedRoleArn(assumedRoleArn)

    //Then it should return true
    expect(result).toBe(true)
  })
})

describe('isIamUserArn', () => {
  it('should return true for IAM user ARN', () => {
    //Given an IAM user ARN
    const userArn = 'arn:aws:iam::123456789012:user/user-name'

    //When we check if it is an IAM user ARN
    const result = isIamUserArn(userArn)

    //Then it should return true
    expect(result).toBe(true)
  })

  it('should return false for non-IAM user ARN', () => {
    //Given a non-IAM user ARN
    const roleArn = 'arn:aws:sts::123456789012:assumed-role/role-name/session-name'

    //When we check if it is an IAM user ARN
    const result = isIamUserArn(roleArn)

    //Then it should return false
    expect(result).toBe(false)
  })

  it('should work for a different partition', () => {
    //Given an IAM user ARN with a different partition
    const userArn = 'arn:aws-cn:iam::123456789012:user/user-name'

    //When we check if it is an IAM user ARN
    const result = isIamUserArn(userArn)

    //Then it should return true
    expect(result).toBe(true)
  })
})

describe('isFederatedUserArn', () => {
  it('should return true for federated user ARN', () => {
    //Given a federated user ARN
    const federatedUserArn = 'arn:aws:sts::123456789012:federated-user/user-name'

    //When we check if it is a federated user ARN
    const result = isFederatedUserArn(federatedUserArn)

    //Then it should return true
    expect(result).toBe(true)
  })

  it('should return false for non-federated user ARN', () => {
    //Given a non-federated user ARN
    const roleArn = 'arn:aws:sts::123456789012:assumed-role/role-name/session-name'

    //When we check if it is a federated user ARN
    const result = isFederatedUserArn(roleArn)

    //Then it should return false
    expect(result).toBe(false)
  })

  it('should work for a different partition', () => {
    //Given a federated user ARN with a different partition
    const federatedUserArn = 'arn:aws-cn:sts::123456789012:federated-user/user-name'

    //When we check if it is a federated user ARN
    const result = isFederatedUserArn(federatedUserArn)

    //Then it should return true
    expect(result).toBe(true)
  })

  describe('isIamRoleArn', () => {
    it('should return true for IAM role ARN', () => {
      //Given an IAM role ARN
      const roleArn = 'arn:aws:iam::123456789012:role/role-name'

      //When we check if it is an IAM role ARN
      const result = isIamRoleArn(roleArn)

      //Then it should return true
      expect(result).toBe(true)
    })

    it('should return false for non-IAM role ARN', () => {
      //Given a non-IAM role ARN
      const userArn = 'arn:aws:iam::123456789012:user/user-name'

      //When we check if it is an IAM role ARN
      const result = isIamRoleArn(userArn)

      //Then it should return false
      expect(result).toBe(false)
    })

    it('should work for a different partition', () => {
      //Given an IAM role ARN with a different partition
      const roleArn = 'arn:aws-cn:iam::123456789012:role/role-name'

      //When we check if it is an IAM role ARN
      const result = isIamRoleArn(roleArn)

      //Then it should return true
      expect(result).toBe(true)
    })

    const iamRoleArnContractTests = [
      {
        name: 'a hyphen-only partition',
        principal: 'arn:---:iam::123456789012:role/role-name',
        expected: true
      },
      {
        name: 'an empty role suffix',
        principal: 'arn:aws:iam::123456789012:role/',
        expected: true
      },
      {
        name: 'a role suffix containing colons',
        principal: 'arn:aws:iam::123456789012:role/role:name',
        expected: true
      },
      {
        name: 'an uppercase ARN prefix',
        principal: 'ARN:aws:iam::123456789012:role/role-name',
        expected: false
      },
      {
        name: 'an uppercase IAM service',
        principal: 'arn:aws:IAM::123456789012:role/role-name',
        expected: false
      },
      {
        name: 'an empty partition',
        principal: 'arn::iam::123456789012:role/role-name',
        expected: false
      },
      {
        name: 'a partition containing a digit',
        principal: 'arn:aws2:iam::123456789012:role/role-name',
        expected: false
      },
      {
        name: 'a partition containing an underscore',
        principal: 'arn:aws_partition:iam::123456789012:role/role-name',
        expected: false
      },
      {
        name: 'a short account ID',
        principal: 'arn:aws:iam::12345678901:role/role-name',
        expected: false
      },
      {
        name: 'a newline in the role suffix',
        principal: 'arn:aws:iam::123456789012:role/role\nname',
        expected: false
      },
      {
        name: 'a carriage return in the role suffix',
        principal: 'arn:aws:iam::123456789012:role/role\rname',
        expected: false
      },
      {
        name: 'a line separator in the role suffix',
        principal: 'arn:aws:iam::123456789012:role/role\u2028name',
        expected: false
      },
      {
        name: 'a paragraph separator in the role suffix',
        principal: 'arn:aws:iam::123456789012:role/role\u2029name',
        expected: false
      }
    ]

    for (const { name, principal, expected } of iamRoleArnContractTests) {
      it(`should return ${expected} for ${name}`, () => {
        //Given a possible IAM role ARN
        //When checking whether it is an IAM role ARN
        const result = isIamRoleArn(principal)

        //Then it should match the legacy regex behavior
        expect(result).toBe(expected)
      })
    }
  })
})

describe('isArnPrincipal', () => {
  it('should return true for an IAM user ARN', () => {
    //Given an IAM user ARN
    const userArn = 'arn:aws:iam::123456789012:user/user-name'

    //When we check if it is an ARN principal
    const result = isIamUserArn(userArn)

    //Then it should return true
    expect(result).toBe(true)
  })

  it('should return false for a service principal', () => {
    //Given a service principal
    const servicePrincipal = 'ec2.amazonaws.com'

    //When we check if it is an ARN principal
    const result = isIamUserArn(servicePrincipal)

    //Then it should return false
    expect(result).toBe(false)
  })
})

describe('isRootArn', () => {
  const rootArnTests = [
    {
      name: 'an AWS partition root ARN',
      principal: 'arn:aws:iam::123456789012:root',
      expected: true
    },
    {
      name: 'a GovCloud partition root ARN',
      principal: 'arn:aws-us-gov:iam::123456789012:root',
      expected: true
    },
    {
      name: 'a China partition root ARN',
      principal: 'arn:aws-cn:iam::123456789012:root',
      expected: true
    },
    {
      name: 'case-insensitive ARN, service, and resource segments',
      principal: 'ARN:custom-partition:IAM::123456789012:ROOT',
      expected: true
    },
    { name: 'an empty partition', principal: 'arn::iam::123456789012:root', expected: true },
    {
      name: 'a partition containing digits',
      principal: 'arn:aws2:iam::123456789012:root',
      expected: true
    },
    {
      name: 'a partition containing Unicode characters',
      principal: 'arn:àws:iam::123456789012:root',
      expected: true
    },
    { name: 'an empty input', principal: '', expected: false },
    {
      name: 'a non-empty region',
      principal: 'arn:aws:iam:us-east-1:123456789012:root',
      expected: false
    },
    { name: 'a short account ID', principal: 'arn:aws:iam::12345678901:root', expected: false },
    { name: 'a long account ID', principal: 'arn:aws:iam::1234567890123:root', expected: false },
    {
      name: 'a non-numeric account ID',
      principal: 'arn:aws:iam::account-id12:root',
      expected: false
    },
    {
      name: 'an account ID with non-ASCII digits',
      principal: 'arn:aws:iam::١٢٣٤٥٦٧٨٩٠١٢:root',
      expected: false
    },
    { name: 'a different service', principal: 'arn:aws:sts::123456789012:root', expected: false },
    {
      name: 'a different resource',
      principal: 'arn:aws:iam::123456789012:user/root',
      expected: false
    },
    {
      name: 'a resource with extra colon-separated values',
      principal: 'arn:aws:iam::123456789012:root:extra',
      expected: false
    },
    {
      name: 'a trailing newline',
      principal: 'arn:aws:iam::123456789012:root\n',
      expected: false
    }
  ]

  for (const { name, principal, expected } of rootArnTests) {
    it(`should return ${expected} for ${name}`, () => {
      //Given a possible root ARN
      //When checking whether it is a root ARN
      const result = isRootArn(principal)

      //Then it should match the expected result
      expect(result).toBe(expected)
    })
  }
})

describe('isServicePrincipal', () => {
  it('should return true for a service principal', () => {
    //Given a service principal
    const servicePrincipal = 'ec2.amazonaws.com'

    //When we check if it is a service principal
    const result = isServicePrincipal(servicePrincipal)

    //Then it should return true
    expect(result).toBe(true)
  })

  it('should return false for an IAM user ARN', () => {
    //Given an IAM user ARN
    const userArn = 'arn:aws:iam::123456789012:user/user-name'

    //When we check if it is a service principal
    const result = isServicePrincipal(userArn)

    //Then it should return false
    expect(result).toBe(false)
  })
})
