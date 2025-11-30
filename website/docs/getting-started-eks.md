---
sidebar_position: 1
title: EKS Capabilities (Managed)
sidebar_label: Using EKS Capabilities
---

# EKS Capabilities (Managed)

ACK is available as a fully managed EKS Capability. AWS handles controller installation, updates, and scaling for you - no Helm or manual installation required.

## Why Use EKS Capabilities?

- **Fully managed** - AWS handles controller lifecycle, updates, and scaling
- **No Helm required** - Enable ACK directly through AWS CLI or eksctl
- **Integrated with EKS** - Works seamlessly with other EKS capabilities like Argo CD and kro

## Getting Started

Follow the official AWS documentation to enable ACK on your EKS cluster:

<div className="row" style={{marginTop: '1.5rem', marginBottom: '1.5rem'}}>
  <div className="col col--4">
    <div className="card" style={{height: '100%'}}>
      <div className="card__header">
        <h3>Console</h3>
      </div>
      <div className="card__body">
        <p>Enable ACK from the EKS console with a few clicks.</p>
        <a href="https://docs.aws.amazon.com/eks/latest/userguide/ack-create-console.html" target="_blank" rel="noopener noreferrer" className="button button--primary button--block">View Console Guide →</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card" style={{height: '100%'}}>
      <div className="card__header">
        <h3>AWS CLI</h3>
      </div>
      <div className="card__body">
        <p>Create an ACK capability using the AWS CLI.</p>
        <a href="https://docs.aws.amazon.com/eks/latest/userguide/ack-create-cli.html" target="_blank" rel="noopener noreferrer" className="button button--primary button--block">View AWS CLI Guide →</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card" style={{height: '100%'}}>
      <div className="card__header">
        <h3>eksctl</h3>
      </div>
      <div className="card__body">
        <p>Create an ACK capability using eksctl.</p>
        <a href="https://docs.aws.amazon.com/eks/latest/userguide/ack-create-eksctl.html" target="_blank" rel="noopener noreferrer" className="button button--primary button--block">View eksctl Guide →</a>
      </div>
    </div>
  </div>
</div>

For a complete overview of ACK as an EKS Capability, see the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/ack.html).

## After Installation

Once your ACK capability is active, you can start creating AWS resources using Kubernetes manifests. Check out these guides:

- [Create an ACK Resource](/docs/guides/create-resource) - Create your first AWS resource
- [Core Concepts](/docs/concepts) - Understand how ACK works
- [Available Controllers](/services) - Browse 50+ supported AWS services
