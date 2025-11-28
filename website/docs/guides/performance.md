---
sidebar_position: 9
title: Controller Performance
---

# Controller Performance

Understanding controller performance characteristics and configuration options helps you optimize ACK for your workload scale and AWS service quotas.

## Key Configuration Parameters

### Resource Resync Period

The **resource resync period** determines how frequently the controller reconciles resources with AWS, even when no changes have been detected in Kubernetes. This periodic reconciliation enables drift detection - reverting manual changes made directly in AWS back to the desired state defined in Kubernetes.

**Default**: 36000 seconds (10 hours)

**Configure via Helm**:
```bash
helm install ack-s3-controller \
  oci://public.ecr.aws/aws-controllers-k8s/s3-chart \
  --set reconcile.defaultResyncPeriod=36000
```

**When to adjust**:
- **Increase** (e.g., 86400 for 24h) if you have thousands of resources and don't need frequent drift detection
- **Decrease** (e.g., 3600 for 1h) if you need faster drift detection for critical resources
- Consider AWS API quotas when reducing this value - more frequent resyncs mean more API calls

### Max Concurrent Reconciles

The **max concurrent reconciles** parameter controls how many resources the controller can reconcile simultaneously. This directly impacts how quickly the controller can process changes across multiple resources.

**Default**: 1

**Configure via Helm**:
```bash
helm install ack-s3-controller \
  oci://public.ecr.aws/aws-controllers-k8s/s3-chart \
  --set reconcile.defaultMaxConcurrentSyncs=10
```

**Guidelines**:
- Start with **10-20** for typical workloads
- Increase to **50-200** when managing thousands of resources
- Monitor controller memory usage - higher concurrency increases memory consumption
- Balance against AWS API quotas to avoid throttling

**Resource requirements scale with concurrency**:
```bash
# Example for high-concurrency workload
helm install ack-ec2-controller \
  oci://public.ecr.aws/aws-controllers-k8s/ec2-chart \
  --set reconcile.defaultMaxConcurrentSyncs=200 \
  --set resources.limits.cpu=1000m \
  --set resources.limits.memory=4Gi
```

## Error Handling and Backoff

ACK controllers implement **exponential backoff** for transient errors and rate limiting. This built-in resilience means temporary AWS API throttling won't cause resource failures - reconciliation will simply retry with increasing delays.

### How Backoff Works

1. **Initial failure** (e.g., API throttling): Retry after 1 second
2. **Second failure**: Retry after 2 seconds
3. **Third failure**: Retry after 4 seconds
4. **Continue doubling**: Up to a maximum delay

**You'll see this in controller logs**:
```
controller-runtime.manager.controller.securitygroup  Reconciler error
{"error": "Throttling: Rate exceeded"}
```

This is **normal and expected** under high load. The controller will automatically retry.

### Monitoring Backoff

Check controller metrics for reconciliation errors:

```bash
kubectl port-forward -n ack-system \
  deployment/ack-ec2-controller 8080:8080

# Query metrics
curl localhost:8080/metrics | grep controller_runtime_reconcile_errors_total
```

High error rates may indicate:
- AWS quota limits are too low for your workload
- `maxConcurrentSyncs` is set too high
- Transient AWS service issues

## Calculating Concurrent Reconciles

The optimal `maxConcurrentSyncs` value depends on your AWS service quotas, the number of resources you're managing, and how quickly you need reconciliation to complete. When the controller reconciles resources, each concurrent worker makes API calls to AWS. If you exceed your service quotas, AWS will throttle requests, which triggers exponential backoff and slows down reconciliation.

To calculate a safe concurrency level, you need to understand how many API calls each resource reconciliation requires. For example, when creating an EC2 Security Group with ingress and egress rules, the controller makes multiple API calls: `CreateSecurityGroup`, `AuthorizeSecurityGroupIngress` (one per ingress rule), `AuthorizeSecurityGroupEgress` (one per egress rule), and `DescribeSecurityGroups` for status verification. If your Security Groups average 10 rules each, that's roughly 22 API calls per resource.

### The Formula

```
Max Concurrent Syncs = (Service API Quota × Safety Factor) ÷ API Calls Per Resource
```

The safety factor accounts for other applications and services in your AWS account that may be using the same API quotas. A typical safety factor is 0.5 to 0.7, meaning you allocate 50-70% of your quota to the ACK controller.

**Example calculation**: Suppose you're managing EC2 Security Groups and the `CreateSecurityGroup` API has a quota of 5 requests per second. Each Security Group creation requires approximately 22 API calls total, but `CreateSecurityGroup` is your bottleneck at 5 requests/second. Using a safety factor of 0.6:

```
Max Concurrent Syncs = (5 requests/second × 0.6) ÷ 1 = 3
```

This means setting `maxConcurrentSyncs=3` would keep you under quota during peak reconciliation. If you're managing high-quota APIs like S3 (thousands of requests per second), you can safely run much higher concurrency levels - potentially 100 or more concurrent syncs.

### Resync Period Impact

Your resync period also affects quota consumption. With a 10-hour resync period and 1,000 resources, the controller reconciles roughly 100 resources per hour on average (1,000 ÷ 10). If each reconciliation makes 5 API calls, that's 500 API calls per hour, or about 0.14 calls per second - easily within most quotas. Shortening the resync period to 1 hour increases this to 1.4 calls per second for the same workload.

## Performance Tuning Strategies

When tuning controller performance, start conservatively with default settings (1 concurrent sync, 10-hour resync period) and monitor resource creation times. Gradually increase `maxConcurrentSyncs` in increments - from 10 to 20 to 50 - while watching controller CPU and memory usage, AWS API throttling errors in the logs, and etcd performance for large clusters. The controller will show `Throttling: Rate exceeded` errors when you approach quota limits, which is normal and handled by exponential backoff, but persistent throttling indicates you should either reduce concurrency or request quota increases from AWS.

For high-volume workloads managing thousands of resources, you'll want to balance fast initial reconciliation with sustainable steady-state operation. High concurrency speeds up the initial sync when you first install the controller or deploy many resources at once, while a longer resync period (like 24 hours) reduces the steady-state API call rate. Increase controller resource limits proportionally - more concurrent operations require more memory and CPU. A typical configuration for thousands of resources might use 200 concurrent syncs with 2 CPU cores and 8Gi memory.

## Real-World Performance

The [EC2 ACK Controller Performance Case Study](https://github.com/aws-controllers-k8s/examples/tree/main/casestudies/ec2-ack-load-testing) demonstrates ACK managing 49,900 Security Groups (each with 60 rules) in 87 minutes with `maxConcurrentSyncs=200` and 4Gi memory, making 300,000 AWS API calls without impacting EKS control plane stability.

## Next Steps

- [Configure Helm values](/docs/guides/helm-values) - Full list of configuration options
- [Feature gates](/docs/guides/feature-gates) - Enable experimental features
- [Monitor your controllers](/docs/guides/monitoring) - Set up metrics and alerting
