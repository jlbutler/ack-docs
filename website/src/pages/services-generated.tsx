import { useState, useMemo, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import styles from './services.module.css';

interface Service {
  name: string;
  displayName: string;
  description: string;
  category: string;
  stage: 'RELEASED' | 'IN PROGRESS' | 'PLANNED' | 'PROPOSED';
  maintenancePhase?: 'General Availability' | 'Preview' | 'Deprecated';
  version?: string;
  chartRepo?: string;
  imageRepo?: string;
  githubRepo?: string;
}

const services: Service[] = [
  // Analytics
  {
    name: 'athena',
    displayName: 'Amazon Athena',
    description: 'Interactive query service for S3',
    category: 'Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/athena-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/athena-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/athena-controller',
  },
  {
    name: 'emrcontainers',
    displayName: 'Amazon EMRContainers',
    description: 'EMR on EKS - Run Apache Spark on EKS',
    category: 'Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.19',
    githubRepo: 'https://github.com/aws-controllers-k8s/emrcontainers-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/emrcontainers-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/emrcontainers-controller',
  },
  // Application Integration
  {
    name: 'mq',
    displayName: 'Amazon MQ',
    description: 'Managed message broker service',
    category: 'Application Integration',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/mq-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/mq-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/mq-controller',
  },
  {
    name: 'pipes',
    displayName: 'Amazon Pipes',
    description: 'EventBridge Pipes - Point-to-point integrations',
    category: 'Application Integration',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.18',
    githubRepo: 'https://github.com/aws-controllers-k8s/pipes-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/pipes-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/pipes-controller',
  },
  {
    name: 'sfn',
    displayName: 'Amazon Step-Functions',
    description: 'Step Functions - Serverless workflow orchestration',
    category: 'Application Integration',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.22',
    githubRepo: 'https://github.com/aws-controllers-k8s/sfn-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/sfn-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/sfn-controller',
  },
  // Compute & Containers
  {
    name: 'ec2',
    displayName: 'Amazon EC2',
    description: 'Elastic Compute Cloud - Virtual servers in the cloud',
    category: 'Compute & Containers',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.4.1',
    githubRepo: 'https://github.com/aws-controllers-k8s/ec2-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ec2-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ec2-controller',
  },
  {
    name: 'ecs',
    displayName: 'Amazon ECS',
    description: 'Elastic Container Service - Run containerized applications',
    category: 'Compute & Containers',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.8',
    githubRepo: 'https://github.com/aws-controllers-k8s/ecs-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ecs-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ecs-controller',
  },
  {
    name: 'eks',
    displayName: 'Amazon EKS',
    description: 'Elastic Kubernetes Service - Managed Kubernetes clusters',
    category: 'Compute & Containers',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.9.3',
    githubRepo: 'https://github.com/aws-controllers-k8s/eks-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/eks-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/eks-controller',
  },
  {
    name: 'lambda',
    displayName: 'Amazon Lambda',
    description: 'Run code without provisioning servers',
    category: 'Compute & Containers',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.6.1',
    githubRepo: 'https://github.com/aws-controllers-k8s/lambda-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/lambda-controller',
  },
  // Database
  {
    name: 'documentdb',
    displayName: 'Amazon DocumentDB',
    description: 'MongoDB-compatible document database',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/documentdb-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/documentdb-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/documentdb-controller',
  },
  {
    name: 'dynamodb',
    displayName: 'Amazon DynamoDB',
    description: 'Fast NoSQL database service',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.6.1',
    githubRepo: 'https://github.com/aws-controllers-k8s/dynamodb-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/dynamodb-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/dynamodb-controller',
  },
  {
    name: 'elasticache',
    displayName: 'Amazon ElastiCache',
    description: 'In-memory caching service',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'Preview',
    version: '0.2.3',
    githubRepo: 'https://github.com/aws-controllers-k8s/elasticache-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/elasticache-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/elasticache-controller',
  },
  {
    name: 'elasticsearchservice',
    displayName: 'Amazon Elasticsearch',
    description: 'Managed Elasticsearch clusters (legacy)',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'Preview',
    version: '0.0.2',
    githubRepo: 'https://github.com/aws-controllers-k8s/elasticsearchservice-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/elasticsearchservice-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/elasticsearchservice-controller',
  },
  {
    name: 'keyspaces',
    displayName: 'Amazon Keyspaces',
    description: 'Cassandra-compatible database',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/keyspaces-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/keyspaces-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/keyspaces-controller',
  },
  {
    name: 'memorydb',
    displayName: 'Amazon MemoryDB',
    description: 'Redis-compatible in-memory database',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.8',
    githubRepo: 'https://github.com/aws-controllers-k8s/memorydb-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/memorydb-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/memorydb-controller',
  },
  {
    name: 'opensearchservice',
    displayName: 'Amazon OpenSearch',
    description: 'Managed OpenSearch clusters',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/opensearchservice-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/opensearchservice-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/opensearchservice-controller',
  },
  {
    name: 'rds',
    displayName: 'Amazon RDS',
    description: 'Relational Database Service - Managed relational databases',
    category: 'Database',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.6.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/rds-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/rds-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/rds-controller',
  },
  // Developer Tools
  {
    name: 'ecr',
    displayName: 'Amazon ECR',
    description: 'Elastic Container Registry - Docker container registry',
    category: 'Developer Tools',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.26',
    githubRepo: 'https://github.com/aws-controllers-k8s/ecr-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ecr-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ecr-controller',
  },
  {
    name: 'ecrpublic',
    displayName: 'Amazon ECR Public',
    description: 'Public container registry',
    category: 'Developer Tools',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/ecrpublic-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ecrpublic-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ecrpublic-controller',
  },
  {
    name: 'codeartifact',
    displayName: 'Amazon codeArtifact',
    description: 'Secure artifact management',
    category: 'Developer Tools',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/codeartifact-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/codeartifact-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/codeartifact-controller',
  },
  // Machine Learning
  {
    name: 'bedrock',
    displayName: 'Amazon Bedrock',
    description: 'Build and scale generative AI applications',
    category: 'Machine Learning',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/bedrock-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/bedrock-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/bedrock-controller',
  },
  {
    name: 'bedrockagent',
    displayName: 'Amazon Bedrock Agents',
    description: 'Create and manage AI agents',
    category: 'Machine Learning',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/bedrockagent-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/bedrockagent-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/bedrockagent-controller',
  },
  {
    name: 'sagemaker',
    displayName: 'Amazon SageMaker',
    description: 'Build, train, and deploy ML models',
    category: 'Machine Learning',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.2.16',
    githubRepo: 'https://github.com/aws-controllers-k8s/sagemaker-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/sagemaker-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/sagemaker-controller',
  },
  // Management & Governance
  {
    name: 'amg',
    displayName: 'Amazon AMG',
    description: 'Amazon Managed Grafana',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'Preview',
    version: '0.0.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/amg-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/amg-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/amg-controller',
  },
  {
    name: 'prometheusservice',
    displayName: 'Amazon AMP',
    description: 'Amazon Managed Service for Prometheus',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.2.21',
    githubRepo: 'https://github.com/aws-controllers-k8s/prometheusservice-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/prometheusservice-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/prometheusservice-controller',
  },
  {
    name: 'applicationautoscaling',
    displayName: 'Amazon AutoScaling',
    description: 'Auto scaling for AWS resources',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.1.2',
    githubRepo: 'https://github.com/aws-controllers-k8s/applicationautoscaling-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/applicationautoscaling-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/applicationautoscaling-controller',
  },
  {
    name: 'cloudtrail',
    displayName: 'Amazon CloudTrail',
    description: 'Track user activity and API usage',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.21',
    githubRepo: 'https://github.com/aws-controllers-k8s/cloudtrail-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/cloudtrail-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/cloudtrail-controller',
  },
  {
    name: 'cloudwatch',
    displayName: 'Amazon CloudWatch',
    description: 'Monitoring and observability',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/cloudwatch-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/cloudwatch-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/cloudwatch-controller',
  },
  {
    name: 'cloudwatchlogs',
    displayName: 'Amazon CloudWatch Logs',
    description: 'Log management and analysis',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/cloudwatchlogs-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/cloudwatchlogs-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/cloudwatchlogs-controller',
  },
  {
    name: 'organizations',
    displayName: 'Amazon Organizations',
    description: 'Centrally manage multiple AWS accounts',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/organizations-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/organizations-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/organizations-controller',
  },
  {
    name: 'recyclebin',
    displayName: 'Amazon Recycle Bin',
    description: 'Recycle Bin for EBS snapshots and AMIs',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/recyclebin-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/recyclebin-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/recyclebin-controller',
  },
  {
    name: 'ssm',
    displayName: 'Amazon SSM',
    description: 'Systems Manager - Operational insights',
    category: 'Management & Governance',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.5',
    githubRepo: 'https://github.com/aws-controllers-k8s/ssm-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ssm-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ssm-controller',
  },
  // Messaging & Analytics
  {
    name: 'eventbridge',
    displayName: 'Amazon EventBridge',
    description: 'Serverless event bus',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.21',
    githubRepo: 'https://github.com/aws-controllers-k8s/eventbridge-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/eventbridge-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/eventbridge-controller',
  },
  {
    name: 'kinesis',
    displayName: 'Amazon Kinesis',
    description: 'Real-time data streaming',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.8',
    githubRepo: 'https://github.com/aws-controllers-k8s/kinesis-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/kinesis-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/kinesis-controller',
  },
  {
    name: 'kafka',
    displayName: 'Amazon MSK',
    description: 'Managed Apache Kafka',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.9',
    githubRepo: 'https://github.com/aws-controllers-k8s/kafka-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/kafka-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/kafka-controller',
  },
  {
    name: 'ses',
    displayName: 'Amazon SES',
    description: 'Simple Email Service',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/ses-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ses-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ses-controller',
  },
  {
    name: 'sns',
    displayName: 'Amazon SNS',
    description: 'Simple Notification Service - Pub/Sub messaging',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.1.9',
    githubRepo: 'https://github.com/aws-controllers-k8s/sns-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/sns-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/sns-controller',
  },
  {
    name: 'sqs',
    displayName: 'Amazon SQS',
    description: 'Simple Queue Service - Message queuing',
    category: 'Messaging & Analytics',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.1.9',
    githubRepo: 'https://github.com/aws-controllers-k8s/sqs-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/sqs-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/sqs-controller',
  },
  // Networking
  {
    name: 'apigatewayv2',
    displayName: 'Amazon APIGWv2',
    description: 'Build, deploy, and manage APIs',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.23',
    githubRepo: 'https://github.com/aws-controllers-k8s/apigatewayv2-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/apigatewayv2-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/apigatewayv2-controller',
  },
  {
    name: 'cloudfront',
    displayName: 'Amazon CloudFront',
    description: 'Content Delivery Network',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.9',
    githubRepo: 'https://github.com/aws-controllers-k8s/cloudfront-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/cloudfront-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/cloudfront-controller',
  },
  {
    name: 'elbv2',
    displayName: 'Amazon ELB',
    description: 'Elastic Load Balancing - Distribute traffic',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/elbv2-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/elbv2-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/elbv2-controller',
  },
  {
    name: 'networkfirewall',
    displayName: 'Amazon NetworkFirewall',
    description: 'Network traffic filtering',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/networkfirewall-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/networkfirewall-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/networkfirewall-controller',
  },
  {
    name: 'route53',
    displayName: 'Amazon Route53',
    description: 'Scalable DNS and domain registration',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'Preview',
    version: '0.0.25',
    githubRepo: 'https://github.com/aws-controllers-k8s/route53-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/route53-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/route53-controller',
  },
  {
    name: 'route53resolver',
    displayName: 'Amazon Route53Resolver',
    description: 'DNS resolution for hybrid clouds',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.8',
    githubRepo: 'https://github.com/aws-controllers-k8s/route53resolver-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/route53resolver-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/route53resolver-controller',
  },
  {
    name: 'apigateway',
    displayName: 'Amazon apigateway',
    description: 'REST API management',
    category: 'Networking',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.1.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/apigateway-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/apigateway-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/apigateway-controller',
  },
  // Other
  {
    name: 'bedrockagentcorecontrol',
    displayName: 'Amazon Bedrock Agent Core Control',
    description: 'Amazon Bedrock Agent Core Control',
    category: 'Other',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.0',
    githubRepo: 'https://github.com/aws-controllers-k8s/bedrockagentcorecontrol-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/bedrockagentcorecontrol-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/bedrockagentcorecontrol-controller',
  },
  // Security & Identity
  {
    name: 'acm',
    displayName: 'Amazon ACM',
    description: 'AWS Certificate Manager - SSL/TLS certificates',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/acm-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/acm-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/acm-controller',
  },
  {
    name: 'acmpca',
    displayName: 'Amazon ACM PCA',
    description: 'Private Certificate Authority',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.5',
    githubRepo: 'https://github.com/aws-controllers-k8s/acmpca-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/acmpca-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/acmpca-controller',
  },
  {
    name: 'cognitoidentityprovider',
    displayName: 'Amazon Cognito Identity Provider',
    description: 'User authentication and authorization',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/cognitoidentityprovider-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/cognitoidentityprovider-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/cognitoidentityprovider-controller',
  },
  {
    name: 'iam',
    displayName: 'Amazon IAM',
    description: 'Identity and Access Management',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.3.19',
    githubRepo: 'https://github.com/aws-controllers-k8s/iam-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/iam-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/iam-controller',
  },
  {
    name: 'kms',
    displayName: 'Amazon KMS',
    description: 'Key Management Service - Encryption keys',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.24',
    githubRepo: 'https://github.com/aws-controllers-k8s/kms-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/kms-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/kms-controller',
  },
  {
    name: 'ram',
    displayName: 'Amazon RAM',
    description: 'Resource Access Manager',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.5',
    githubRepo: 'https://github.com/aws-controllers-k8s/ram-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/ram-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/ram-controller',
  },
  {
    name: 'secretsmanager',
    displayName: 'Amazon SecretsManager',
    description: 'Manage and retrieve secrets',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.5',
    githubRepo: 'https://github.com/aws-controllers-k8s/secretsmanager-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/secretsmanager-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/secretsmanager-controller',
  },
  {
    name: 'wafv2',
    displayName: 'Amazon WAF',
    description: 'Web Application Firewall',
    category: 'Security & Identity',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.6',
    githubRepo: 'https://github.com/aws-controllers-k8s/wafv2-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/wafv2-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/wafv2-controller',
  },
  // Storage
  {
    name: 'efs',
    displayName: 'Amazon EFS',
    description: 'Elastic File System - Scalable file storage',
    category: 'Storage',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.7',
    githubRepo: 'https://github.com/aws-controllers-k8s/efs-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/efs-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/efs-controller',
  },
  {
    name: 's3',
    displayName: 'Amazon S3',
    description: 'Simple Storage Service - Object storage for the cloud',
    category: 'Storage',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.28',
    githubRepo: 'https://github.com/aws-controllers-k8s/s3-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/s3-controller',
  },
  {
    name: 's3control',
    displayName: 'Amazon S3 Control',
    description: 'S3 access management',
    category: 'Storage',
    stage: 'RELEASED',
    maintenancePhase: 'General Availability',
    version: '1.0.5',
    githubRepo: 'https://github.com/aws-controllers-k8s/s3control-controller',
    chartRepo: 'oci://public.ecr.aws/aws-controllers-k8s/s3control-chart',
    imageRepo: 'public.ecr.aws/aws-controllers-k8s/s3control-controller',
  },
];

export default function Services(): ReactNode {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ['all', ...Array.from(cats).sort()];
  }, []);

  const stages = useMemo(() => {
    const stgs = new Set(services.map(s => s.stage));
    return ['all', ...Array.from(stgs).sort()];
  }, []);

  const phases = useMemo(() => {
    const phs = new Set(services.filter(s => s.maintenancePhase).map(s => s.maintenancePhase!));
    return ['all', ...Array.from(phs).sort()];
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = searchTerm === '' ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesStage = selectedStage === 'all' || service.stage === selectedStage;
      const matchesPhase = selectedPhase === 'all' || service.maintenancePhase === selectedPhase;

      return matchesSearch && matchesCategory && matchesStage && matchesPhase;
    });
  }, [searchTerm, selectedCategory, selectedStage, selectedPhase]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStage('all');
    setSelectedPhase('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedStage !== 'all' || selectedPhase !== 'all';

  return (
    <Layout
      title="AWS Controllers for Kubernetes Services"
      description="Browse all available ACK service controllers">
      <main className="container margin-vert--lg">
        <div className="text--center margin-bottom--lg">
          <h1>ACK Service Controllers</h1>
          <p className="hero__subtitle">
            Manage AWS resources directly from Kubernetes using ACK controllers
          </p>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className={styles.filterSelect}>
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </option>
              ))}
            </select>

            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className={styles.filterSelect}>
              {phases.map(phase => (
                <option key={phase} value={phase}>
                  {phase === 'all' ? 'All Phases' : phase}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearButton}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className={styles.servicesGrid}>
          {filteredServices.map(service => (
            <div key={service.name} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <h3>{service.displayName}</h3>
                <div className={styles.badges}>
                  <span className={styles['badge-' + service.stage.toLowerCase().replace(' ', '-')]}>
                    {service.stage}
                  </span>
                  {service.maintenancePhase && (
                    <span className={styles['phase-' + service.maintenancePhase.toLowerCase().replace(' ', '-')]}>
                      {service.maintenancePhase}
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.serviceDescription}>{service.description}</p>

              <div className={styles.serviceFooter}>
                <div className={styles.serviceCategory}>{service.category}</div>
                {service.version && (
                  <div className={styles.serviceVersion}>v{service.version}</div>
                )}
              </div>

              <div className={styles.serviceLinks}>
                {service.githubRepo && (
                  <a href={service.githubRepo} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {service.chartRepo && (
                  <a href={service.chartRepo} target="_blank" rel="noopener noreferrer">
                    Helm Chart
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text--center margin-vert--xl">
            <p>No services found matching your criteria.</p>
          </div>
        )}

        <div className="margin-top--xl text--center">
          <h2>Don't see what you need?</h2>
          <p>
            <a href="https://github.com/aws-controllers-k8s/community/issues/new?template=new_controller_request.md"
               target="_blank"
               rel="noopener noreferrer"
               className="button button--primary button--lg">
              Propose a New Service Controller
            </a>
          </p>
        </div>
      </main>
    </Layout>
  );
}
