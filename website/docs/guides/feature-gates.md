---
title: Feature Gates
---

# Feature Gates

ACK controllers support feature gates that enable or disable specific functionality. Feature gates allow you to try experimental features or opt into beta features.

## Available Feature Gates

| Feature Gate | Stage | Default | Description |
|-------------|-------|---------|-------------|
| **ResourceAdoption** | Beta | Enabled | Import existing AWS resources into ACK management using adoption annotations. [Learn more](/docs/guides/adoption) |
| **ReadOnlyResources** | Beta | Enabled | Observe AWS resources without ACK managing them using read-only annotation. [Learn more](/docs/guides/readonly) |
| **IAMRoleSelector** | Alpha | Disabled | Use IAMRoleSelector CRD for dynamic IAM role mapping to namespaces and resources. [Learn more](/docs/guides/cross-account) |
| **ServiceLevelCARM** | Alpha | Disabled | Enable CARM (Cross-Account Resource Management) for service-level resources |
| **TeamLevelCARM** | Alpha | Disabled | Enable CARM (Cross-Account Resource Management) for team-level resources |

:::info Helm Chart Defaults
Some controller Helm charts may override the runtime defaults in their `values.yaml`. Check the specific controller's Helm chart values for the actual defaults. You can always explicitly enable features using `--set featureGates.<feature>=true`.
:::

## Feature Stages

- **Alpha**: Early testing phase. May be unstable or change without notice. Disabled by default.
- **Beta**: Advanced testing phase. More stable than alpha. Enabled by default.
- **GA**: Generally available and stable. Always enabled.

## Enabling Feature Gates

Feature gates are configured when installing ACK controllers via Helm:

```bash
helm install ack-s3-controller \
  oci://public.ecr.aws/aws-controllers-k8s/s3-chart \
  --set featureGates.IAMRoleSelector=true
```

Multiple feature gates can be enabled:

```bash
helm install ack-s3-controller \
  oci://public.ecr.aws/aws-controllers-k8s/s3-chart \
  --set featureGates.IAMRoleSelector=true \
  --set featureGates.TeamLevelCARM=true
```

:::warning CARM and IAMRoleSelector
Enabling IAMRoleSelector disables CARM features. These features cannot be used together.
:::

## Next Steps

- [Resource adoption](/docs/guides/adoption) - Import existing AWS resources
- [ReadOnly resources](/docs/guides/readonly) - Observe resources without managing them
- [Advanced IAM roles](/docs/guides/cross-account) - Configure IAMRoleSelector for multi-account management
