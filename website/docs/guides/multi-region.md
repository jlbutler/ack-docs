---
title: Multi-Region
---

# Multi-Region

ACK controllers can manage resources across multiple AWS regions using a single controller deployment.

## Region Precedence

The controller determines the AWS region for a resource in this order:

1. **Resource annotation** - `services.k8s.aws/region` on the resource itself
2. **Namespace annotation** - `services.k8s.aws/default-region` on the namespace
3. **Controller flag** - `--aws-region` flag (configurable via Helm chart `aws.region` value)

The first match wins.

## Configuration Options

### Resource-Level Region

Override the region for a specific resource using the `services.k8s.aws/region` annotation:

```yaml
apiVersion: dynamodb.services.k8s.aws/v1alpha1
kind: Table
metadata:
  name: users-east
  annotations:
    services.k8s.aws/region: us-east-1
spec:
  tableName: users-east
  billingMode: PAY_PER_REQUEST
  attributeDefinitions:
    - attributeName: id
      attributeType: S
  keySchema:
    - attributeName: id
      keyType: HASH
```

This creates the table in `us-east-1` regardless of the controller's default region.

### Namespace-Level Region

Set a default region for all resources in a namespace using the `services.k8s.aws/default-region` annotation:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  annotations:
    services.k8s.aws/default-region: us-east-1
```

Or for existing namespaces:

```bash
kubectl annotate namespace production services.k8s.aws/default-region=us-east-1
```

Now all resources in the `production` namespace default to `us-east-1`:

```yaml
apiVersion: dynamodb.services.k8s.aws/v1alpha1
kind: Table
metadata:
  name: orders
  namespace: production
spec:
  tableName: orders
  billingMode: PAY_PER_REQUEST
  attributeDefinitions:
    - attributeName: orderID
      attributeType: S
  keySchema:
    - attributeName: orderID
      keyType: HASH
```

## Next Steps

- [Advanced IAM roles](/docs/guides/cross-account) - Use different IAM roles for different regions
- [Create resources](/docs/guides/create-resource) - Learn about resource creation
