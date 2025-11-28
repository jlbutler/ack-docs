---
title: ReadOnly Resources
---

# ReadOnly Resources

ReadOnly mode allows you to observe AWS resources without ACK managing them. When a resource is marked as read-only, ACK will sync the resource status from AWS but will never create, update, or delete the underlying AWS resource.

## What is ReadOnly Mode?

When you mark a Kubernetes resource as read-only using the `services.k8s.aws/read-only` annotation, ACK will:

- **Sync status** from AWS to Kubernetes
- **Not create** the resource in AWS if it doesn't exist
- **Not update** the resource in AWS when you change the spec
- **Not delete** the resource in AWS when you delete the Kubernetes object

This is useful for observing existing AWS resources, monitoring infrastructure managed outside of ACK, or preventing accidental changes to critical resources.

:::info Feature Status
ReadOnly Resources is a **Beta feature**. It is enabled by default in the ACK runtime. If you encounter issues, verify the feature is enabled in your controller's Helm values:

```bash
helm install ... --set featureGates.ReadOnlyResources=true
```
:::

## Using ReadOnly Mode

Add the `services.k8s.aws/read-only: "true"` annotation to your resource:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-existing-bucket
  annotations:
    services.k8s.aws/read-only: "true"
spec:
  name: my-actual-bucket-name
```

When you apply this resource:

1. ACK looks for a bucket named `my-actual-bucket-name` in AWS
2. If found, ACK syncs the bucket's current state to the Kubernetes resource status
3. ACK continues to watch the AWS bucket and update the status
4. ACK will **never** modify or delete the AWS bucket

## Common Use Cases

### 1. Observing Existing Infrastructure

Monitor resources created by other tools (Terraform, CloudFormation, AWS Console):

```yaml
apiVersion: dynamodb.services.k8s.aws/v1alpha1
kind: Table
metadata:
  name: legacy-users-table
  annotations:
    services.k8s.aws/read-only: "true"
spec:
  tableName: users-prod
```

This allows you to:
- View the table's status in Kubernetes
- Use the resource in other Kubernetes tooling
- Monitor for changes without managing lifecycle

### 2. Safe Exploration

Test ACK configuration without risking changes to production resources:

```yaml
apiVersion: rds.services.k8s.aws/v1alpha1
kind: DBInstance
metadata:
  name: prod-database
  annotations:
    services.k8s.aws/read-only: "true"
spec:
  dbInstanceIdentifier: production-db
```

### 3. Preventing Accidental Deletion

Protect critical resources from being deleted through Kubernetes:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: critical-data-bucket
  annotations:
    services.k8s.aws/read-only: "true"
spec:
  name: company-critical-data
```

Even if someone runs `kubectl delete bucket critical-data-bucket`, the AWS bucket remains untouched.

## Behavior Details

### When Resource Exists in AWS

If the AWS resource exists and matches the spec:

```bash
kubectl get bucket my-existing-bucket

NAME                  READY
my-existing-bucket    True
```

Status is synced normally, showing current AWS state.

### When Resource Doesn't Exist in AWS

If you create a read-only resource but the AWS resource doesn't exist, the resource will show an error:

```yaml
status:
  conditions:
  - type: Ready
    status: "False"
    reason: ResourceNotFound
    message: "Resource not found in AWS"
```

ACK will **not create** the resource in read-only mode. To import an existing AWS resource into ACK management, see the [Resource Adoption guide](/docs/guides/adoption).

### Changing Spec Fields

If you modify the spec of a read-only resource:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-bucket
  annotations:
    services.k8s.aws/read-only: "true"
spec:
  name: my-actual-bucket
  versioning:
    status: Enabled  # Adding this field
```

ACK **ignores the change**. The AWS bucket remains unchanged. The status continues to reflect the actual AWS state, not your desired spec.

### Deleting Read-Only Resources

When you delete a read-only Kubernetes resource:

```bash
kubectl delete bucket my-existing-bucket
```

- The Kubernetes object is removed
- The AWS bucket **remains untouched**
- No deletion occurs in AWS regardless of deletion policy

This overrides even `deletionPolicy: Delete`.

## ReadOnly vs Resource Adoption

ReadOnly and [Resource Adoption](/docs/guides/adoption) are different:

| Feature | ReadOnly | Adoption |
|---------|----------|----------|
| **Purpose** | Observe without managing | Import to manage |
| **Creates resources** | No | No |
| **Updates resources** | No | Yes |
| **Deletes resources** | No | Yes (based on policy) |
| **Use case** | Monitoring, observation | Taking over management |

**Adoption** imports an existing resource so ACK can **manage it** (update, delete).
**ReadOnly** observes an existing resource but ACK **never manages it**.

If you want to take over management of an existing AWS resource, see the [Resource Adoption guide](/docs/guides/adoption).

You can combine both:

```yaml
apiVersion: s3.services.k8s.aws/v1alpha1
kind: Bucket
metadata:
  name: my-bucket
  annotations:
    services.k8s.aws/adoption-policy: adopt
    services.k8s.aws/adoption-fields: |
      {"name": "my-actual-bucket"}
    services.k8s.aws/read-only: "true"
spec: {}
```

This adopts the bucket for observation only. ACK syncs status but never modifies the bucket.

## Switching Modes

### From ReadOnly to Managed

To start managing a read-only resource, remove the annotation:

```bash
kubectl annotate bucket my-bucket services.k8s.aws/read-only-
```

ACK will now:
- Apply any spec changes to AWS
- Delete the resource when the Kubernetes object is deleted (based on deletion policy)

### From Managed to ReadOnly

To stop managing and switch to read-only:

```bash
kubectl annotate bucket my-bucket services.k8s.aws/read-only="true"
```

From this point forward, ACK only observes. Existing AWS state remains as-is.

## Next Steps

- [Adopt existing resources](/docs/guides/adoption) - Take over management of AWS resources
- [Configure deletion policies](/docs/guides/deletion-policy) - Control deletion behavior for managed resources
- [Create resources](/docs/guides/create-resource) - Learn about full resource lifecycle management
