---
id: eks-helm
title: "Install Camunda 8 on an EKS cluster"
description: "Set up the Camunda 8 environment with Helm and an optional Ingress setup on Amazon EKS."
---

<!-- (!) Note: Please ensure that this guide maintains a consistent structure and presentation style throughout, as with docs/self-managed/setup/deploy/openshift/terraform-setup.md. The user should have a similar experience when reading both guides. -->

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

This guide provides a comprehensive walkthrough for installing the Camunda 8 Helm chart on your existing AWS Kubernetes EKS cluster. It also includes instructions for setting up optional DNS configurations and other optional AWS-managed services, such as OpenSearch and PostgreSQL.

Lastly you'll verify that the connection to your Self-Managed Camunda 8 environment is working.

## Requirements

- A Kubernetes cluster; see the [eksctl](./eksctl.md) or [Terraform](./terraform-setup.md) guide.
- [Helm (3.16+)](https://helm.sh/docs/intro/install/)
- [kubectl (1.30+)](https://kubernetes.io/docs/tasks/tools/#kubectl) to interact with the cluster.
- [jq (1.7+)](https://jqlang.github.io/jq/download/) to interact with some variables.
- [GNU envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) to generate manifests.
- (optional) Domain name/[hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html) in Route53. This allows you to expose Camunda 8 and connect via community-supported [zbctl](https://github.com/camunda-community-hub/zeebe-client-go/blob/main/cmd/zbctl/zbctl.md) or [Camunda Modeler](https://camunda.com/download/modeler/).
- A namespace to host the Camunda Platform, in this guide we will reference `camunda` as the target namespace.

### Considerations

While this guide is primarily tailored for UNIX systems, it can also be run under Windows by utilizing the [Windows Subsystem for Linux](https://learn.microsoft.com/windows/wsl/about).

Multi-tenancy is disabled by default and is not covered further in this guide. If you decide to enable it, you may use the same PostgreSQL instance and add an extra database for multi-tenancy purposes.

:::caution Optimize compatibility with OpenSearch

**Migration:** The migration step will be disabled during the installation. For more information, refer to [using Amazon OpenSearch Service](/self-managed/setup/guides/using-existing-opensearch.md).

:::

## Architecture

<!-- TODO: update Arch to include Aurora and OpenSearch both text and diagram (https://github.com/camunda/team-infrastructure-experience/issues/409) -->

Note the [existing architecture](../../../../about-self-managed.md#architecture) extended by deploying a Network Load Balancer with TLS termination within the [ingress](https://kubernetes.github.io/ingress-nginx/user-guide/tls/) below.

Additionally, two components ([external-dns](https://github.com/kubernetes-sigs/external-dns) and [cert-manager](https://cert-manager.io/)) handle requesting the TLS certificate from [Let's Encrypt](https://letsencrypt.org/) and configuring Route53 to confirm domain ownership and update the DNS records to expose the Camunda 8 deployment.

![Camunda 8 Self-Managed AWS Architecture Diagram](./assets/camunda-8-self-managed-architecture-aws.png)

## Export environment variables

To streamline the execution of the subsequent commands, it is recommended to export multiple environment variables.

### Export the AWS region and Helm chart version

The following are the required environment variables with some example values:

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/chart-env.sh
```

### Export database values

When using either standard authentication (network based or username and password) or IRSA authentication, specific environment variables must be set with valid values. Follow the guide for either [eksctl](./eksctl.md#configuration-1) or [Terraform](./terraform-setup.md#export-values-for-the-helm-chart) to set them correctly.

Verify the configuration of your environment variables by running the following loop:

<Tabs groupId="env" defaultValue="standard" queryString values={
[
{label: 'Standard authentication', value: 'standard' },
{label: 'IRSA authentication', value: 'irsa' },
]}>

<TabItem value="standard">

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/check-env-variables.sh
```

</TabItem>

<TabItem value="irsa">

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7-irsa/procedure/check-env-variables.sh
```

</TabItem>

</Tabs>

## (Optional) Ingress Setup

:::info Domain or domainless installation

If you do not have a domain name, external access to Camunda 8 web endpoints from outside the AWS VPC will not be possible. In this case, you may skip the DNS setup and proceed directly to [deploying Camunda 8 via Helm charts](#deploy-camunda-8-via-helm-charts).

Alternatively, you can use `kubectl port-forward` to access the Camunda platform without a domain or Ingress configuration. For more information, see the [kubectl port-forward documentation](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/).

Throughout the rest of this installation guide, we will refer to configurations as **"With domain"** or **"Without domain"** depending on whether the application is exposed via a domain.
:::

In this section, we provide an optional setup guide for configuring an Ingress with TLS and DNS management, allowing you to access your application through a specified domain. If you haven't set up an Ingress, refer to the [Kubernetes Ingress documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/) for more details. In Kubernetes, an Ingress is an API object that manages external access to services in a cluster, typically over HTTP, and can also handle TLS encryption for secure connections.

To monitor your Ingress setup using Amazon CloudWatch, you may also find the official AWS guide on [monitoring nginx workloads with CloudWatch Container Insights and Prometheus](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Sample-Workloads-nginx.html) helpful. Additionally, for detailed steps on exposing Kubernetes applications with the nginx ingress controller, refer to the [official AWS tutorial](https://aws.amazon.com/fr/blogs/containers/exposing-kubernetes-applications-part-3-nginx-ingress-controller/).

### Export Values

Set the following values for your Ingress configuration:

```shell
# The domain name you intend to use
export DOMAIN_NAME=camunda.example.com
# The email address for Let's Encrypt registration
export MAIL=admin@camunda.example.com
# Helm chart versions for Ingress components
export INGRESS_HELM_CHART_VERSION="4.11.2"
export EXTERNAL_DNS_HELM_CHART_VERSION="1.15.0"
export CERT_MANAGER_HELM_CHART_VERSION="1.15.3"
```

Additionally, obtain these values by following the guide for either [eksctl](./eks-helm.md) or [Terraform](./terraform-setup.md), as they will be needed in later steps:

- `EXTERNAL_DNS_IRSA_ARN`
- `CERT_MANAGER_IRSA_ARN`
- `REGION`

### ingress-nginx

[Ingress-nginx](https://github.com/kubernetes/ingress-nginx) is an open-source Kubernetes Ingress controller that provides a way to manage external access to services within a Kubernetes cluster. It acts as a reverse proxy and load balancer, routing incoming traffic to the appropriate services based on rules defined in the Ingress resource.

The following installs `ingress-nginx` in the `ingress-nginx` namespace via Helm. For more configuration options, consult the [Helm chart](https://github.com/kubernetes/ingress-nginx/tree/main/charts/ingress-nginx).

```shell
helm upgrade --install \
  ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version $INGRESS_HELM_CHART_VERSION \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io\/aws-load-balancer-backend-protocol=tcp' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io\/aws-load-balancer-cross-zone-load-balancing-enabled=true' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io\/aws-load-balancer-type=nlb' \
  --namespace ingress-nginx \
  --create-namespace
```

### external-dns

[External-dns](https://github.com/kubernetes-sigs/external-dns) is a Kubernetes add-on that automates the management of DNS records for external resources, such as load balancers or Ingress controllers. It monitors the Kubernetes resources and dynamically updates the DNS provider with the appropriate DNS records.

The following installs `external-dns` in the `external-dns` namespace via Helm. For more configuration options, consult the [Helm chart](https://github.com/kubernetes-sigs/external-dns/tree/master/charts/external-dns).

Consider setting `domainFilters` via `--set` to restrict access to certain hosted zones.

:::tip
Make sure to have `EXTERNAL_DNS_IRSA_ARN` exported prior by either having followed the [eksctl](./eksctl.md#policy-for-external-dns) or [Terraform](./terraform-setup.md#outputs) guide.
:::

:::danger Uniqueness of txtOwnerId for DNS

If you are already running `external-dns` in a different cluster, ensure each instance has a **unique** `txtOwnerId` for the TXT record. Without unique identifiers, the `external-dns` instances will conflict and inadvertently delete existing DNS records.

In the example below, it's set to `external-dns` and should be changed if this identifier is already in use. Consult the [documentation](https://kubernetes-sigs.github.io/external-dns/v0.15.0/#note) to learn more about DNS record ownership.
:::

```shell
helm upgrade --install \
  external-dns external-dns \
  --repo https://kubernetes-sigs.github.io/external-dns/ \
  --version $EXTERNAL_DNS_HELM_CHART_VERSION \
  --set "env[0].name=AWS_DEFAULT_REGION" \
  --set "env[0].value=$REGION" \
  --set txtOwnerId=external-dns \
  --set policy=sync \
  --set "serviceAccount.annotations.eks\.amazonaws\.com\/role-arn=$EXTERNAL_DNS_IRSA_ARN" \
  --namespace external-dns \
  --create-namespace
```

### cert-manager

[Cert-manager](https://cert-manager.io/) is an open-source Kubernetes add-on that automates the management and issuance of TLS certificates. It integrates with various certificate authorities (CAs) and provides a straightforward way to obtain, renew, and manage SSL/TLS certificates for your Kubernetes applications.

To simplify the installation process, it is [recommended](https://cert-manager.io/docs/installation/helm/#3-install-customresourcedefinitions) to install the cert-manager `CustomResourceDefinition` resources before installing the chart. This separate step allows for easy uninstallation and reinstallation of cert-manager without deleting any custom resources that have been installed.

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v$CERT_MANAGER_HELM_CHART_VERSION/cert-manager.crds.yaml
```

The following installs `cert-manager` in the `cert-manager` namespace via Helm. For more configuration options, consult the [Helm chart](https://artifacthub.io/packages/helm/cert-manager/cert-manager). The supplied settings also configure `cert-manager` to ease the certificate creation by setting a default issuer, which allows you to add a single annotation on an Ingress to request the relevant certificates.

:::tip
Make sure to have `CERT_MANAGER_IRSA_ARN` exported prior by either having followed the [eksctl](./eksctl.md#policy-for-cert-manager) or [Terraform](./terraform-setup.md#outputs) guide.
:::

```shell
helm upgrade --install \
  cert-manager cert-manager \
  --repo https://charts.jetstack.io \
  --version $CERT_MANAGER_HELM_CHART_VERSION \
  --namespace cert-manager \
  --create-namespace \
  --set "serviceAccount.annotations.eks\.amazonaws\.com\/role-arn=$CERT_MANAGER_IRSA_ARN" \
  --set securityContext.fsGroup=1001 \
  --set ingressShim.defaultIssuerName=letsencrypt \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  --set ingressShim.defaultIssuerGroup=cert-manager.io
```

Create a `ClusterIssuer` via `kubectl` to enable cert-manager to request certificates from [Let's Encrypt](https://letsencrypt.org/):

```shell
cat << EOF | kubectl apply -f -
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $MAIL
    privateKeySecretRef:
      name: letsencrypt-issuer-account-key
    solvers:
      - selector: {}
        dns01:
          route53:
            region: $REGION
            # Cert-manager will automatically observe the hosted zones
            # Cert-manager will automatically make use of the IRSA assigned service account
EOF
```

## Deploy Camunda 8 via Helm charts

For more configuration options, refer to the [Helm chart documentation](https://artifacthub.io/packages/helm/camunda/camunda-platform#parameters). Additionally, explore our existing resources on the [Camunda 8 Helm chart](/self-managed/setup/install.md) and [guides](/self-managed/setup/guides/guides.md).

Depending of your installation path, you may use different settings.
For easy and reproducible installations, we will use yaml files to configure the chart.

### 1. Create the `values.yml` file

Start by creating a `values.yml` file to store the configuration for your environment. This file will contain key-value pairs that will be substituted using `envsubst`. You can find a reference example of this file here:

<Tabs groupId="values">
  <TabItem value="with-domain-std" label="Standard with domain" default>

The following makes use of the [combined Ingress setup](/self-managed/setup/guides/ingress-setup.md#combined-ingress-setup) by deploying a single Ingress for all HTTP components and a separate Ingress for the gRPC endpoint.

:::info Cert-manager annotation for domain installation
The annotation `kubernetes.io/tls-acme=true` will be [interpreted by cert-manager](https://cert-manager.io/docs/usage/ingress/) and automatically results in the creation of the required certificate request, easing the setup.
:::

```yaml reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/helm-values/values-domain.yml
```

:::danger Exposure of the Zeebe Gateway

Publicly exposing the Zeebe Gateway without proper authorization can pose significant security risks. To avoid this, consider disabling the Ingress for the Zeebe Gateway by setting the following values to `false` in your configuration file:

- `zeebeGateway.ingress.grpc.enabled`
- `zeebeGateway.ingress.rest.enabled`

By default, authorization is enabled to ensure secure access to Zeebe. Typically, only internal components need direct access to Zeebe, making it unnecessary to expose the gateway externally.

:::

#### Reference the credentials in secrets

Before installing the Helm chart, create Kubernetes secrets to store the Keycloak database authentication credentials and the OpenSearch authentication credentials.

To create the secrets, run the following commands:

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/create-external-db-secrets.sh
```

</TabItem>

<TabItem value="without-domain-std" label="Standard without domain">

```hcl reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/helm-values/values-no-domain.yml
```

#### Reference the credentials in secrets

Before installing the Helm chart, create Kubernetes secrets to store the Keycloak database authentication credentials and the OpenSearch authentication credentials.

To create the secrets, run the following commands:

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/create-external-db-secrets.sh
```

  </TabItem>

  <TabItem value="with-domain-irsa" label="IRSA with domain" default>

The following makes use of the [combined Ingress setup](/self-managed/setup/guides/ingress-setup.md#combined-ingress-setup) by deploying a single Ingress for all HTTP components and a separate Ingress for the gRPC endpoint.

:::info Cert-manager annotation for domain installation
The annotation `kubernetes.io/tls-acme=true` will be [interpreted by cert-manager](https://cert-manager.io/docs/usage/ingress/) and automatically results in the creation of the required certificate request, easing the setup.
:::

```hcl reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7-irsa/helm-values/values-domain.yml
```

:::danger Exposure of the Zeebe Gateway

Publicly exposing the Zeebe Gateway without proper authorization can pose significant security risks. To avoid this, consider disabling the Ingress for the Zeebe Gateway by setting the following values to `false` in your configuration file:

- `zeebeGateway.ingress.grpc.enabled`
- `zeebeGateway.ingress.rest.enabled`

By default, authorization is enabled to ensure secure access to Zeebe. Typically, only internal components need direct access to Zeebe, making it unnecessary to expose the gateway externally.

:::

  </TabItem>

  <TabItem value="without-domain-irsa" label="IRSA without domain">

```hcl reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7-irsa/helm-values/values-no-domain.yml
```

  </TabItem>

</Tabs>

### 2. Configure your deployment

#### Enable Enterprise components

Some components are not enabled by default in this deployment. For more information on how to configure and enable these components, refer to [configuring Web Modeler, Console, and Connectors](../../../install.md#configuring-web-modeler-console-and-connectors).

#### Use internal Elasticsearch instead of the managed OpenSearch

If you do not wish to use a managed OpenSearch service, you can opt to use the internal Elasticsearch deployment. This configuration disables OpenSearch and enables the internal Kubernetes Elasticsearch deployment:

<details>
<summary>Show configuration changes to disable external OpenSearch usage</summary>

```yaml
global:
  elasticsearch:
    enabled: true
  opensearch:
    enabled: false

elasticsearch:
  enabled: true
```

</details>

#### Use internal PostgreSQL instead of the managed Aurora

If you prefer not to use an external PostgreSQL service, you can switch to the internal PostgreSQL deployment. In this case, you will need to configure the Helm chart as follows and remove certain configurations related to the external database and service account:

<details>
<summary>Show configuration changes to disable external database usage</summary>

```yaml
identityKeycloak:
  postgresql:
    enabled: true

  # Remove external database configuration
  # externalDatabase:
  #   ...

  # Remove service account and annotations
  # serviceAccount:
  #   ...

  # Remove extra environment variables for external database driver
  # extraEnvVars:
  #   ...

webModeler:
  # Remove this part

  # restapi:
  #     externalDatabase:
  #         url: jdbc:aws-wrapper:postgresql://${DB_HOST}:5432/${DB_WEBMODELER_NAME}
  #         user: ${DB_WEBMODELER_USERNAME}
  #         existingSecret: webmodeler-postgres-secret
  #         existingSecretPasswordKey: password

identity:
  # Remove this part

  # externalDatabase:
  #     enabled: true
  #     host: ${DB_HOST}
  #     port: 5432
  #     username: ${DB_IDENTITY_USERNAME}
  #     database: ${DB_IDENTITY_NAME}
  #     existingSecret: identity-postgres-secret
  #     existingSecretPasswordKey: password
```

</details>

#### Fill your deployment with actual values

Once you've prepared the `values.yml` file, run the following `envsubst` command to substitute the environment variables with their actual values:

```bash
# generate the final values
envsubst < values.yml > generated-values.yml

# print the result
cat generated-values.yml
```

Next, store various passwords in a Kubernetes secret, which will be used by the Helm chart. Below is an example of how to set up the required secret. You can use `openssl` to generate random secrets and store them in environment variables:

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/generate-passwords.sh
```

Use these environment variables in the `kubectl` command to create the secret.

- The `smtp-password` should be replaced with the appropriate external value ([see how it's used by Web Modeler](/self-managed/modeler/web-modeler/configuration/configuration.md#smtp--email)).

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/create-identity-secret.sh
```

### 3. Install Camunda 8 using Helm

Now that the `generated-values.yml` is ready, you can install Camunda 8 using Helm. Run the following command:

```bash reference
https://github.com/camunda/camunda-tf-eks-module/blob/main/examples/camunda-8.7/procedure/install-chart.sh
```

This command:

- Installs (or upgrades) the Camunda platform using the Helm chart.
- Substitutes the appropriate version using the `$CAMUNDA_HELM_CHART_VERSION` environment variable.
- Applies the configuration from `generated-values.yml`.

:::note

This guide uses `helm upgrade --install` as it runs install on initial deployment and upgrades future usage. This may make it easier for future [Camunda 8 Helm upgrades](/self-managed/setup/upgrade.md) or any other component upgrades.

:::

You can track the progress of the installation using the following command:

```bash
watch -n 5 '
  kubectl get pods -n camunda --output=wide;
  if [ $(kubectl get pods -n camunda --field-selector=status.phase!=Running -o name | wc -l) -eq 0 ] &&
     [ $(kubectl get pods -n camunda -o json | jq -r ".items[] | select(.status.containerStatuses[]?.ready == false)" | wc -l) -eq 0 ];
  then
    echo "All pods are Running and Healthy - Installation completed!";
  else
    echo "Some pods are not Running or Healthy";
  fi
'
```

<details>
<summary>Understand how each component interacts with IRSA</summary>
<summary>

#### Web Modeler

As the Web Modeler REST API uses PostgreSQL, configure the `restapi` to use IRSA with Amazon Aurora PostgreSQL. Check the [Web Modeler database configuration](../../../../modeler/web-modeler/configuration/database.md#running-web-modeler-on-amazon-aurora-postgresql) for more details.
Web Modeler already comes fitted with the [aws-advanced-jdbc-wrapper](https://github.com/awslabs/aws-advanced-jdbc-wrapper) within the Docker image.

#### Keycloak

:::caution Only available from v21+

IAM Roles for Service Accounts can only be implemented with Keycloak 21+. This may require you to adjust the version used in the Camunda Helm chart.

:::

From Keycloak versions 21+, the default JDBC driver can be overwritten, allowing use of a custom wrapper like the [aws-advanced-jdbc-wrapper](https://github.com/awslabs/aws-advanced-jdbc-wrapper) to utilize the features of IRSA. This is a wrapper around the default JDBC driver, but takes care of signing the requests.

The [official Keycloak documentation](https://www.keycloak.org/server/db#preparing-keycloak-for-amazon-aurora-postgresql) also provides detailed instructions for utilizing Amazon Aurora PostgreSQL.

A custom Keycloak container image containing necessary configurations is accessible on Docker Hub at [camunda/keycloak](https://hub.docker.com/r/camunda/keycloak). This image, built upon the base image [bitnami/keycloak](https://hub.docker.com/r/bitnami/keycloak), incorporates the required wrapper for seamless integration.

#### Container image sources

The sources of the [Camunda Keycloak images](https://hub.docker.com/r/camunda/keycloak) can be found on [GitHub](https://github.com/camunda/keycloak). In this repository, the [aws-advanced-jdbc-wrapper](https://github.com/awslabs/aws-advanced-jdbc-wrapper) is assembled in the `Dockerfile`.

Maintenance of these images is based on the upstream [Bitnami Keycloak images](https://hub.docker.com/r/bitnami/keycloak), ensuring they are always up-to-date with the latest Keycloak releases. The lifecycle details for Keycloak can be found on [endoflife.date](https://endoflife.date/keycloak).

##### Keycloak image configuration

Bitnami Keycloak container image configuration is available at [hub.docker.com/bitnami/keycloak](https://hub.docker.com/r/bitnami/keycloak).

##### Identity

Identity uses PostgreSQL, and `identity` is configured to use IRSA with Amazon Aurora PostgreSQL. Check the [Identity database configuration](../../../../identity/deployment/configuration-variables.md#running-identity-on-amazon-aurora-postgresql) for more details. Identity includes the [aws-advanced-jdbc-wrapper](https://github.com/awslabs/aws-advanced-jdbc-wrapper) within the Docker image.

#### Amazon OpenSearch Service

##### Internal database configuration

The default setup is sufficient for Amazon OpenSearch Service clusters without **fine-grained access control**.

Fine-grained access control adds another layer of security to OpenSearch, requiring you to add a mapping between the IAM role and the internal OpenSearch role. Visit the [AWS documentation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html) on fine-grained access control.

There are different ways to configure the mapping within Amazon OpenSearch Service:

- Via a [Terraform module](https://registry.terraform.io/modules/idealo/opensearch/aws/latest) in case your OpenSearch instance is exposed.
- Via the [OpenSearch dashboard](https://opensearch.org/docs/latest/security/access-control/users-roles/).
- Via the **REST API**. To authorize the IAM role in OpenSearch for access, follow these steps:

  Use the following `curl` command to update the OpenSearch internal database and authorize the IAM role for access. Replace placeholders with your specific values:

  ```bash
  curl -sS -u "<OS_DOMAIN_USER>:<OS_DOMAIN_PASSWORD>" \
      -X PATCH \
      "https://<OS_ENDPOINT>/_opendistro/_security/api/rolesmapping/all_access?pretty" \
      -H 'Content-Type: application/json' \
      -d'
  [
    {
      "op": "add",
      "path": "/backend_roles",
      "value": ["<ROLE_NAME>"]
    }
  ]
  '
  ```

  - Replace `<OS_DOMAIN_USER>` and `<OS_DOMAIN_PASSWORD>` with your OpenSearch domain admin credentials.
  - Replace `<OS_ENDPOINT>` with your OpenSearch endpoint URL.
  - Replace `<ROLE_NAME>` with the IAM role name created by Terraform, which is output by the `opensearch_role` module.

  :::note Security of basic auth usage

  **This example uses basic authentication (username and password), which may not be the best practice for all scenarios, especially if fine-grained access control is enabled.** The endpoint used in this example is not exposed by default, so consult your OpenSearch documentation for specifics on enabling and securing this endpoint.

  :::

Ensure that the `iam_role_arn` of the previously created `opensearch_role` is assigned to an internal role within Amazon OpenSearch Service. For example, `all_access` on the Amazon OpenSearch Service side is a good candidate, or if required, extra roles can be created with more restrictive access.

</summary>
</details>

## Verify connectivity to Camunda 8

First, we need an OAuth client to be able to connect to the Camunda 8 cluster.

### Generate an M2M token using Identity

Generate an M2M token by following the steps outlined in the [Identity getting started guide](/self-managed/identity/getting-started/install-identity.md), along with the [incorporating applications documentation](/self-managed/identity/user-guide/additional-features/incorporate-applications.md).

Below is a summary of the necessary instructions:

<Tabs groupId="domain">
  <TabItem value="with" label="With domain" default>

1. Open Identity in your browser at `https://${DOMAIN_NAME}/identity`. You will be redirected to Keycloak and prompted to log in with a username and password.
2. Use `demo` as both the username and password.
3. Select **Add application** and select **M2M** as the type. Assign a name like "test."
4. Select the newly created application. Then, select **Access to APIs > Assign permissions**, and select the **Core API** with "read" and "write" permission.
5. Retrieve the `client-id` and `client-secret` values from the application details

```shell
export ZEEBE_CLIENT_ID='client-id' # retrieve the value from the identity page of your created m2m application
export ZEEBE_CLIENT_SECRET='client-secret' # retrieve the value from the identity page of your created m2m application
```

</TabItem>
  
<TabItem value="without" label="Without domain">

Identity and Keycloak must be port-forwarded to be able to connect to the cluster.

```shell
kubectl port-forward services/camunda-identity 8080:80 --namespace camunda
kubectl port-forward services/camunda-keycloak 18080:80 --namespace camunda
```

1. Open Identity in your browser at `http://localhost:8080`. You will be redirected to Keycloak and prompted to log in with a username and password.
2. Use `demo` as both the username and password.
3. Select **Add application** and select **M2M** as the type. Assign a name like "test."
4. Select the newly created application. Then, select **Access to APIs > Assign permissions**, and select the **Core API** with "read" and "write" permission.
5. Retrieve the `client-id` and `client-secret` values from the application details

```shell
export ZEEBE_CLIENT_ID='client-id' # retrieve the value from the identity page of your created m2m application
export ZEEBE_CLIENT_SECRET='client-secret' # retrieve the value from the identity page of your created m2m application
```

<details>
<summary>To access the other services and their UIs, port-forward those Components as well:</summary>
<summary>

```shell
Operate:
> kubectl port-forward svc/camunda-operate  8081:80 --namespace camunda
Tasklist:
> kubectl port-forward svc/camunda-tasklist 8082:80 --namespace camunda
Optimize:
> kubectl port-forward svc/camunda-optimize 8083:80 --namespace camunda
Connectors:
> kubectl port-forward svc/camunda-connectors 8086:8080 --namespace camunda
WebModeler:
> kubectl port-forward svc/camunda-web-modeler-webapp 8084:80 --namespace camunda
Console:
> kubectl port-forward svc/camunda-console 8085:80 --namespace camunda
```

</summary>
</details>

</TabItem>
</Tabs>

### Use the token

For a detailed guide on generating and using a token, please conduct the relevant documentation on [authenticating with the REST API](./../../../../../apis-tools/camunda-api-rest/camunda-api-rest-authentication.md?environment=self-managed).

<Tabs groupId="domain">
  <TabItem value="with" label="With domain" default>

Export the following environment variables:

```shell
export ZEEBE_ADDRESS_REST=https://$DOMAIN_NAME/zeebe
export ZEEBE_AUTHORIZATION_SERVER_URL=https://$DOMAIN_NAME/auth/realms/camunda-platform/protocol/openid-connect/token
```

  </TabItem>
  <TabItem value="without" label="Without domain">

This requires to port-forward the Zeebe Gateway to be able to connect to the cluster.

```shell
kubectl port-forward services/camunda-zeebe-gateway 8080:8080 --namespace camunda
```

Export the following environment variables:

```shell
export ZEEBE_ADDRESS_REST=http://localhost:8080
export ZEEBE_AUTHORIZATION_SERVER_URL=http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token
```

  </TabItem>

</Tabs>

Generate a temporary token to access the REST API, then capture the value of the `access_token` property and store it as your token.

```shell
export TOKEN=$(curl --location --request POST "${ZEEBE_AUTHORIZATION_SERVER_URL}" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=${ZEEBE_CLIENT_ID}" \
--data-urlencode "client_secret=${ZEEBE_CLIENT_SECRET}" \
--data-urlencode "grant_type=client_credentials" | jq '.access_token' -r)
```

Use the stored token, in our case `TOKEN`, to use the REST API to print the cluster topology.

```shell
curl --header "Authorization: Bearer ${TOKEN}" "${ZEEBE_ADDRESS_REST}/v2/topology"
```

...and results in the following output:

<details>
  <summary>Example output</summary>
  <summary>

```shell
{
  "brokers": [
    {
      "nodeId": 0,
      "host": "camunda-zeebe-0.camunda-zeebe",
      "port": 26501,
      "partitions": [
        {
          "partitionId": 1,
          "role": "leader",
          "health": "healthy"
        },
        {
          "partitionId": 2,
          "role": "follower",
          "health": "healthy"
        },
        {
          "partitionId": 3,
          "role": "follower",
          "health": "healthy"
        }
      ],
      "version": "8.6.0"
    },
    {
      "nodeId": 1,
      "host": "camunda-zeebe-1.camunda-zeebe",
      "port": 26501,
      "partitions": [
        {
          "partitionId": 1,
          "role": "follower",
          "health": "healthy"
        },
        {
          "partitionId": 2,
          "role": "leader",
          "health": "healthy"
        },
        {
          "partitionId": 3,
          "role": "follower",
          "health": "healthy"
        }
      ],
      "version": "8.6.0"
    },
    {
      "nodeId": 2,
      "host": "camunda-zeebe-2.camunda-zeebe",
      "port": 26501,
      "partitions": [
        {
          "partitionId": 1,
          "role": "follower",
          "health": "healthy"
        },
        {
          "partitionId": 2,
          "role": "follower",
          "health": "healthy"
        },
        {
          "partitionId": 3,
          "role": "leader",
          "health": "healthy"
        }
      ],
      "version": "8.6.0"
    }
  ],
  "clusterSize": 3,
  "partitionsCount": 3,
  "replicationFactor": 3,
  "gatewayVersion": "8.6.0"
}
```

  </summary>
</details>

## Test the installation with payment example application

To test your installation with the deployment of a sample application, refer to the [installing payment example guide](../../../guides/installing-payment-example.md).

## Advanced topics

The following are some advanced configuration topics to consider for your cluster:

- [Cluster autoscaling](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)

To get more familiar with our product stack, visit the following topics:

- [Operate](/components/operate/operate-introduction.md)
- [Tasklist](/components/tasklist/introduction-to-tasklist.md)
- [Optimize]($optimize$/components/what-is-optimize)
