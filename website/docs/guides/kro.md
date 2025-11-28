---
sidebar_position: 10
title: Using ACK with kro
---

# Using ACK with kro

[kro](https://kro.run) is a Kubernetes Resource Orchestrator that lets you compose multiple Kubernetes resources into a single, reusable unit. When combined with ACK, kro enables you to build complete AWS infrastructure stacks that can be deployed with a single custom resource.

## Why Use kro with ACK?

ACK manages individual AWS resources, but real-world applications often require multiple resources that depend on each other. For example, an application might need:

- An S3 bucket for storage
- A DynamoDB table for data
- An SQS queue for messaging
- ConfigMaps containing the resource endpoints

kro lets you define all of these as a single deployable unit, with automatic dependency management and value passing between resources.

## Installing kro

```bash
helm install kro oci://registry.k8s.io/kro/charts/kro \
  --namespace kro \
  --create-namespace
```

See the [kro installation guide](https://kro.run) for more options.

## Creating a ResourceGraphDefinition

A `ResourceGraphDefinition` defines a template for a group of related resources. Here's an example that creates an S3 bucket, DynamoDB table, and a Deployment that uses them:

```yaml
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: application
spec:
  schema:
    apiVersion: v1alpha1
    kind: Application
    spec:
      # Input parameters users provide when creating an Application
      name: string
      image: string
      bucketName: string
    status:
      # Output values exposed to users (CEL expressions pointing to resources)
      bucketARN: ${bucket.status.ackResourceMetadata.arn}
      tableARN: ${table.status.ackResourceMetadata.arn}

  resources:
    # S3 Bucket managed by ACK
    - id: bucket
      template:
        apiVersion: s3.services.k8s.aws/v1alpha1
        kind: Bucket
        metadata:
          name: ${schema.spec.bucketName}
        spec:
          name: ${schema.spec.bucketName}
          tags:
            - key: app
              value: ${schema.spec.name}

    # DynamoDB Table managed by ACK
    - id: table
      template:
        apiVersion: dynamodb.services.k8s.aws/v1alpha1
        kind: Table
        metadata:
          name: ${schema.spec.name}-table
        spec:
          tableName: ${schema.spec.name}-data
          billingMode: PAY_PER_REQUEST
          attributeDefinitions:
            - attributeName: id
              attributeType: S
          keySchema:
            - attributeName: id
              keyType: HASH

    # Deployment that uses the AWS resources
    - id: deployment
      template:
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: ${schema.spec.name}
        spec:
          replicas: 1
          selector:
            matchLabels:
              app: ${schema.spec.name}
          template:
            metadata:
              labels:
                app: ${schema.spec.name}
            spec:
              containers:
                - name: app
                  image: ${schema.spec.image}
                  env:
                    - name: BUCKET_NAME
                      value: ${schema.spec.bucketName}
                    - name: BUCKET_ARN
                      value: ${bucket.status.ackResourceMetadata.arn}
                    - name: TABLE_NAME
                      value: ${schema.spec.name}-data
                    - name: TABLE_ARN
                      value: ${table.status.ackResourceMetadata.arn}
```

## Deploying the Stack

Once the `ResourceGraphDefinition` is applied, you can create instances of your stack:

```yaml
apiVersion: kro.run/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  name: my-app
  image: my-app:latest
  bucketName: my-app-data
```

kro will:
1. Create the S3 bucket via ACK
2. Create the DynamoDB table via ACK
3. Wait for the AWS resources to be ready
4. Create the Deployment with environment variables pointing to the AWS resources
5. Update the `Application` status with the output values

Check the status:

```bash
kubectl get application my-app -o yaml
```

```yaml
status:
  bucketARN: arn:aws:s3:::my-app-data
  tableARN: arn:aws:dynamodb:us-west-2:123456789012:table/my-app-data
```

## Resource Dependencies

kro automatically determines the order to create resources based on value references. In the examples above:

- The Deployment depends on the S3 bucket and DynamoDB table (it references their status fields)
- kro waits for ACK resources to become ready before creating dependent resources
- If an ACK resource fails, dependent resources won't be created

## Cleanup

When you delete a kro instance, it deletes all managed resources in reverse dependency order:

```bash
kubectl delete application my-app
```

This deletes the Deployment first, then the AWS resources (following ACK's deletion policy).

## Next Steps

- [kro documentation](https://kro.run) - Full kro reference
- [Create resources](/docs/guides/create-resource) - Learn about ACK resource lifecycle
- [Deletion policies](/docs/guides/deletion-policy) - Control what happens when resources are deleted
