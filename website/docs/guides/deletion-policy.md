---
sidebar_position: 4
title: Deletion Policy
---

# Deletion Policy

Deletion policies control what happens to AWS resources when you delete their Kubernetes custom resources. By default, ACK deletes the AWS resource when you delete the Kubernetes resource, but you can configure it to retain the AWS resource instead.

## Default Behavior

When you delete an ACK resource from Kubernetes, the controller:

1. Deletes the underlying AWS resource
2. Then deletes the Kubernetes custom resource

This ensures you can manage the full lifecycle of AWS resources using Kubernetes APIs.

## Why Use Retain Policy?

There are cases where you want to remove a resource from Kubernetes but keep the AWS resource:

- **Migrating resources** between Kubernetes clusters
- **Stateful data** like S3 buckets or RDS databases that shouldn't be accidentally deleted
- **Removing from ACK control** while keeping the resource in AWS
- **Testing or development** where you want to preserve resources across cluster recreations

## Deletion Policy Values

ACK supports two deletion policy values:

- **delete** (default) - Deletes the AWS resource before removing the Kubernetes resource
- **retain** - Keeps the AWS resource intact, only removes the Kubernetes resource

## Configuration Precedence

The controller checks for deletion policy configuration in this order:

1. **Resource annotation** - `services.k8s.aws/deletion-policy` on the resource itself
2. **Namespace annotation** - `{service}.services.k8s.aws/deletion-policy` on the namespace
3. **Controller default** - The controller's default setting (usually `delete`, configurable via Helm chart)

The first match wins, so resource annotations override namespace annotations, which override the controller default.

## Configuring Deletion Policy

### For a Single Resource

Set the `services.k8s.aws/deletion-policy` annotation directly on the resource:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-important-bucket
  annotations:
    services.k8s.aws/deletion-policy: retain
spec:
  name: my-production-data
```

Now when you delete this bucket from Kubernetes, the S3 bucket remains in AWS.

### For All Resources in a Namespace

Set the `{service}.services.k8s.aws/deletion-policy` annotation on the namespace to apply the policy to all resources of that service type:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  annotations:
    s3.services.k8s.aws/deletion-policy: retain
    dynamodb.services.k8s.aws/deletion-policy: retain
```

This retains all S3 buckets and DynamoDB tables in the `production` namespace when deleted from Kubernetes.

To apply the policy to all services in the namespace, omit the service prefix:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  annotations:
    services.k8s.aws/deletion-policy: retain
```

This retains all ACK resources in the namespace, regardless of service type.

**Note:** The namespace annotation can include the service name prefix (e.g., `s3.services.k8s.aws/`) to target specific services, or use the generic `services.k8s.aws/` prefix to apply to all services. The resource annotation always uses the generic `services.k8s.aws/` prefix.

## Examples

### Retain Production Data

Mark production data resources to always be retained:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: customer-data
  namespace: production
  annotations:
    services.k8s.aws/deletion-policy: retain
spec:
  name: prod-customer-data-bucket
```

### Retain All Resources in Environment

For a staging or production namespace, retain all resources by default:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  annotations:
    s3.services.k8s.aws/deletion-policy: retain
    rds.services.k8s.aws/deletion-policy: retain
    dynamodb.services.k8s.aws/deletion-policy: retain
```

### Override Namespace Policy

Even if a namespace is configured to retain resources, you can override for specific resources:

```yaml
# Namespace configured with retain policy
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  annotations:
    s3.services.k8s.aws/deletion-policy: retain
---
# But this specific bucket should be deleted
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: temporary-bucket
  namespace: staging
  annotations:
    services.k8s.aws/deletion-policy: delete
spec:
  name: temp-test-bucket
```

## Managing Retained Resources

Once a resource is deleted from Kubernetes with retain policy, you have several options:

**Re-adopt and continue managing:**
```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-bucket
  annotations:
    services.k8s.aws/adoption-policy: adopt
    services.k8s.aws/adoption-fields: |
      {"name": "my-production-data"}
spec: {}
```

**Re-adopt and delete through ACK:**
```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-bucket
  annotations:
    services.k8s.aws/adoption-policy: adopt
    services.k8s.aws/adoption-fields: |
      {"name": "my-production-data"}
    services.k8s.aws/deletion-policy: delete  # Override to delete
spec: {}
```

Then delete normally: `kubectl delete bucket my-bucket`

## Next Steps

- [Resource adoption](/docs/guides/adoption) - Re-import retained resources back into ACK
- [ReadOnly resources](/docs/guides/readonly) - Observe resources without managing lifecycle
- [Advanced IAM roles](/docs/guides/cross-account) - Use different deletion policies across accounts
