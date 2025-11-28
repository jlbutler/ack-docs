---
title: Create an ACK Resource
---

# Create an ACK Resource

This guide shows you how to create and manage AWS resources using ACK. We'll use S3 buckets and DynamoDB tables as examples, but the same patterns apply to all ACK resources.

## Prerequisites

Before creating resources, ensure:

1. **ACK controller installed** - The controller for your service must be running (e.g., S3 controller for buckets)
2. **IAM permissions configured** - Controller has appropriate AWS permissions ([see guide](/docs/guides/configure-iam))
3. **kubectl access** - You can run kubectl commands against your cluster

## Basic Resource Creation

### Example 1: Create an S3 Bucket

Create a file named `my-bucket.yaml`:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-app-bucket
spec:
  name: my-unique-bucket-name-12345
```

Apply it:

```bash
kubectl apply -f my-bucket.yaml
```

**Key components:**
- `apiVersion`: Identifies the ACK service and API version
- `kind`: The AWS resource type (Bucket, Table, DBInstance, etc.)
- `metadata.name`: Kubernetes resource name (can differ from AWS resource name)
- `spec.name`: The actual AWS bucket name (must be globally unique for S3)

### Example 2: Create a DynamoDB Table

Create `my-table.yaml`:

```yaml
apiVersion: dynamodb.services.k8s.aws/v1alpha1
kind: Table
metadata:
  name: users-table
spec:
  tableName: users
  billingMode: PAY_PER_REQUEST
  attributeDefinitions:
    - attributeName: userID
      attributeType: S
    - attributeName: email
      attributeType: S
  keySchema:
    - attributeName: userID
      keyType: HASH
  globalSecondaryIndexes:
    - indexName: email-index
      keySchema:
        - attributeName: email
          keyType: HASH
      projection:
        projectionType: ALL
  tags:
    - key: environment
      value: production
    - key: team
      value: backend
```

Apply it:

```bash
kubectl apply -f my-table.yaml
```

## Understanding Resource Lifecycle

### 1. Resource Creation

When you apply a manifest, ACK:
1. Validates the Kubernetes resource
2. Calls AWS APIs to create the resource
3. Updates the resource status with AWS metadata

### 2. Status Checking

Check resource status:

```bash
# List resources
kubectl get buckets
kubectl get tables

# Get detailed status
kubectl get bucket my-app-bucket -o yaml
kubectl describe table users-table
```

**Check if resource is ready:**
```bash
kubectl get bucket my-app-bucket

# Output shows Ready status
NAME            READY
my-app-bucket   True
```

When `READY` is `True`, the resource has been successfully created in AWS.

**Status details:**
```yaml
status:
  # ACK metadata
  ackResourceMetadata:
    arn: arn:aws:s3:::my-unique-bucket-name-12345
    ownerAccountID: "123456789012"
    region: us-west-2

  # Conditions showing resource state
  conditions:
    - type: Ready
      status: "True"
```

**If resource is not Ready:**
- Check `kubectl describe` for condition details
- `ACK.Terminal`: Unrecoverable error, requires deletion and recreation
- `ACK.Recoverable`: Temporary error, controller will retry automatically

### 3. Resource Updates

ACK watches for changes to Kubernetes resources and updates AWS accordingly.

Update the bucket to add versioning:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-app-bucket
spec:
  name: my-unique-bucket-name-12345
  versioning:
    status: Enabled
```

Apply the update:

```bash
kubectl apply -f my-bucket.yaml
```

ACK detects the change and enables versioning in AWS.

### 4. Resource Deletion

Delete the Kubernetes resource:

```bash
kubectl delete bucket my-app-bucket
kubectl delete table users-table
```

By default, this also **deletes the AWS resource**. See [Deletion Policy](/docs/guides/deletion-policy) to change this behavior.

## Next Steps

- [Configure deletion policies](/docs/guides/deletion-policy) - Control what happens when resources are deleted
- [Adopt existing AWS resources](/docs/guides/adoption) - Import pre-existing resources into ACK
- [Use read-only mode](/docs/guides/readonly) - Observe resources without managing them
- [Configure advanced IAM roles](/docs/guides/cross-account) - Use multiple IAM roles for different resources
