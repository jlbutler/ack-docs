---
sidebar_position: 2
title: Getting Started
---

# Getting Started

Get started with ACK by installing a controller using Helm. ACK works on any Kubernetes cluster including Amazon EKS, GKE, AKS, on-premises clusters, or local development environments.

<div className="row" style={{marginTop: '2rem', marginBottom: '2rem'}}>
  <div className="col col--8 col--offset-2">
    <div className="card" style={{border: '1px solid var(--ifm-color-emphasis-300)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '12px'}}>
      <div className="card__header" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <img src="/docs/img/helm-logo.svg" alt="Helm" style={{width: '32px', height: '32px'}} />
        <h3 style={{margin: 0}}>Install with Helm</h3>
      </div>
      <div className="card__body">
        <p>Install ACK controllers using Helm charts. This gives you full control over versions and configuration.</p>
        <ul>
          <li>Works on any Kubernetes 1.20+</li>
          <li>Access to all 50+ controllers</li>
          <li>Full control over versions and configuration</li>
          <li>Customize controller settings</li>
        </ul>
        <a href="/docs/docs/getting-started-helm" className="button button--primary button--block">Get Started with Helm</a>
      </div>
    </div>
  </div>
</div>

## What's Next?

After installing your first controller, you can:

- **Explore Features**: Learn about [resource adoption](/docs/guides/adoption), [cross-account management](/docs/guides/cross-account), and [deletion policies](/docs/guides/deletion-policy)
- **Browse Controllers**: Check out the [full list of available controllers](/services)
- **Understand Concepts**: Read about [CRDs, reconciliation, and architecture](/docs/concepts)
