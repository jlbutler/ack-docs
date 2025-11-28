import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <img
              src={require("@site/static/img/ack-logo.png").default}
              alt="ACK Logo"
              className={styles.heroLogo}
            />
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            AWS Controllers for Kubernetes
          </Heading>
          <p className={styles.heroTagline}>
            Define and manage AWS resources directly from Kubernetes
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary"
              to="/docs/getting-started"
            >
              Get Started
            </Link>
            <Link
              className="button button--secondary"
              to="/services"
            >
              Browse Controllers
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function ValueProposition() {
  return (
    <section className={styles.valueProps}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className={styles.valueProp}>
              <h3>Declarative & GitOps Ready</h3>
              <p>
                Define AWS resources as Kubernetes custom resources. Version
                control your infrastructure alongside your applications.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.valueProp}>
              <h3>AWS Native</h3>
              <p>
                Direct integration with AWS APIs. Get the full power of AWS
                services with Kubernetes-native management.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.valueProp}>
              <h3>Battle Tested</h3>
              <p>
                Proven in production at scale. Manage over 100k resources with
                every single controller deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeExample() {
  return (
    <section className={styles.codeExample}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <h2>Simple and Powerful</h2>
            <p>
              Create and manage AWS resources using standard Kubernetes
              workflows. Apply a YAML manifest and ACK handles the rest.
            </p>
            <ul className={styles.features}>
              <li>✓ Runs on any Kubernetes cluster</li>
              <li>✓ Periodic drift detection and reconciliation</li>
              <li>✓ Security-first design with high performance</li>
              <li>
                ✓ Cross-account and multi-region resource management from one
                place
              </li>
            </ul>
          </div>
          <div className="col col--6">
            <CodeBlock language="yaml" showLineNumbers>
              {`apiVersion: dynamodb.services.k8s.aws/v1alpha1
kind: Table
metadata:
  name: user-sessions
spec:
  tableName: user-sessions
  billingMode: PAY_PER_REQUEST
  attributeDefinitions:
    - attributeName: sessionId
      attributeType: S
  keySchema:
    - attributeName: sessionId
      keyType: HASH
  tags:
    - key: Application
      value: WebApp`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <h2 className="text--center">Explore ACK</h2>
        <div className="row">
          <div className="col col--3">
            <Link to="/services" className={styles.quickLink}>
              <h3>Service Controllers</h3>
              <p>
                Browse 50+ AWS service controllers with 200+ CRDs including S3,
                RDS, Lambda, and more
              </p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/docs/guides/create-resource" className={styles.quickLink}>
              <h3>Managing Resources</h3>
              <p>
                Learn how to create, update, adopt, and manage AWS resources
                from Kubernetes
              </p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/docs/getting-started" className={styles.quickLink}>
              <h3>Getting Started</h3>
              <p>
                Install your first controller and create AWS resources in
                minutes
              </p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/docs/contributing" className={styles.quickLink}>
              <h3>Contributing</h3>
              <p>
                Join the community and help build the future of cloud-native AWS
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="AWS Controllers for Kubernetes - Manage AWS services directly from Kubernetes"
    >
      <HomepageHeader />
      <main>
        <ValueProposition />
        <CodeExample />
        <QuickLinks />
      </main>
    </Layout>
  );
}
