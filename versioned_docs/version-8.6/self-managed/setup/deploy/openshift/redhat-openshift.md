---
id: redhat-openshift
title: "Red Hat OpenShift"
description: "Deploy Camunda 8 Self-Managed on Red Hat OpenShift"
---

<!-- (!) Note: Please ensure that this guide maintains a consistent structure and presentation style throughout, as with docs/self-managed/setup/deploy/amazon/amazon-eks/eks-helm.md. The user should have a similar experience when reading both guides. -->

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Red Hat OpenShift, a Kubernetes distribution maintained by [Red Hat](https://www.redhat.com/en/technologies/cloud-computing/openshift), provides options for both managed and on-premises hosting.

Deploying Camunda 8 on Red Hat OpenShift is supported using Helm, given the appropriate configurations.

However, it's important to note that the [Security Context Constraints (SCCs)](#security-context-constraints-sccs) and [Routes](./redhat-openshift.md?current-ingress=openshift-routes#using-openshift-routes) configurations might require slight deviations from the guidelines provided in the [general Helm deployment guide](/self-managed/setup/install.md).

## Cluster Specification

When deploying Camunda 8 on an OpenShift cluster, the cluster specification should align with your specific requirements and workload characteristics. Here's a suggested configuration to begin with:

- **Instance type:** 4 vCPUs (x86_64, >3.1 GHz), 16 GiB Memory (for example, [mi7.xlarge on AWS](https://aws.amazon.com/en/ebs/general-purpose/))
- **Number of dedicated nodes:** 4
- **Volume type:** SSD volumes (with between 1000 and 3000 IOPS per volume, and a throughput of 1,000 MB/s per volume, for instance, [gp3 on AWS](https://aws.amazon.com/en/ebs/general-purpose/))

If you need to set up an OpenShift cluster on a cloud provider, we recommend our [guide to deploying a ROSA cluster](/self-managed/setup/deploy/amazon/openshift/terraform-setup.md).

### Supported Versions

We conduct testing and ensure compatibility against the following OpenShift versions:

| OpenShift Version | [End of Support Date](https://access.redhat.com/support/policy/updates/openshift) |
| ----------------- | --------------------------------------------------------------------------------- |
| 4.17.x            | June 27, 2025                                                                     |
| 4.16.x            | December 27, 2025                                                                 |
| 4.15.x            | August 27, 2025                                                                   |
| 4.14.x            | May 1, 2025                                                                       |

:::caution Version compatibility

Camunda 8 supports OpenShift versions in the Red Hat General Availability, Full Support, and Maintenance Support life cycle phases. For more information, refer to the [Red Hat OpenShift Container Platform Life Cycle Policy](https://access.redhat.com/support/policy/updates/openshift).

:::

## Requirements

- [Helm (3.16+)](https://helm.sh/docs/intro/install/)
- [kubectl (1.30+)](https://kubernetes.io/docs/tasks/tools/#kubectl) to interact with the cluster.
- [jq (1.7+)](https://jqlang.github.io/jq/download/) to interact with some variables.
- [GNU envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) to generate manifests.
- [oc (version supported by your OpenShift)](https://docs.openshift.com/container-platform/4.17/cli_reference/openshift_cli/getting-started-cli.html) to interact with OpenShift.
- A namespace to host the Camunda Platform, in this guide we will reference `camunda` as the target namespace.

## Deploy Camunda 8 via Helm charts

### Configure your deployment

Start by creating a `values.yml` file to store the configuration for your environment.
This file will contain key-value pairs that will be substituted using `envsubst`.
Over this guide, you will add and merge values in this file to configure your deployment to fit your needs.

You can find a reference example of this file here:

```hcl reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/base.yml
```

:::danger Merging YAML files

This guide references multiple configuration files that need to be merged into a single YAML file. Be cautious to avoid duplicate keys when merging the files. Additionally, pay close attention when copying and pasting YAML content. Ensure that the separator notation `---` does not inadvertently split the configuration into multiple documents.

We strongly recommend double-checking your YAML file before applying it. You can use tools like [yamllint.com](https://www.yamllint.com/) or the [YAML Lint CLI](https://github.com/adrienverge/yamllint) if you prefer not to share your information online.

:::

#### Configuring the Ingress

Before exposing services outside the cluster, we need an Ingress component. Here's how you can configure it:

<Tabs queryString="current-ingress">

<TabItem value="openshift-routes" label="Using OpenShift Routes" default>

[Routes](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html) expose services externally by linking a URL to a service within the cluster. OpenShift supports both the [standard Kubernetes Ingress and routes](https://docs.openshift.com/container-platform/latest/networking/ingress-operator.html), giving cluster users the flexibility to choose.

The presence of routes is rooted in their specification predating Ingress. The functionality of routes differs from Ingress; for example, unlike Ingress, routes don't allow multiple services to be linked to a single route or the use of paths.

To use these routes for the Zeebe Gateway, configure this through Ingress as well.

#### Setting Up the application domain for Camunda 8

The route created by OpenShift will use a domain to provide access to the platform. By default, you can use the OpenShift applications domain, but any other domain supported by the router can also be used.

To retrieve the OpenShift applications domain (used as an example here), run the following command:

```bash
export OPENSHIFT_APPS_DOMAIN=$(oc get ingresses.config.openshift.io cluster -o jsonpath='{.spec.domain}')
```

Next, define the route domain that will be used for the Camunda 8 deployment. For example:

```bash
export DOMAIN_NAME="camunda.$OPENSHIFT_APPS_DOMAIN"

echo "Camunda 8 will be reachable from $DOMAIN_NAME"
```

If you choose to use a custom domain instead, ensure it is supported by your router configuration and replace the example domain with your desired domain. For more details on configuring custom domains in OpenShift, refer to the official [custom domain OpenShift documentation](https://docs.openshift.com/dedicated/applications/deployments/osd-config-custom-domains-applications.html).

#### Checking if HTTP/2 is enabled

As the Zeebe Gateway also uses `gRPC` (which relies on `HTTP/2`), [HTTP/2 Ingress Connectivity must be enabled](https://docs.openshift.com/container-platform/latest/networking/ingress-operator.html#nw-http2-haproxy_configuring-ingress).

To check if HTTP/2 is already enabled on your OpenShift cluster, run the following command:

```bash
oc get ingresses.config/cluster -o json | jq '.metadata.annotations."ingress.operator.openshift.io/default-enable-http2"'
```

Alternatively, if you use a dedicated IngressController for the deployment:

```bash
# List your IngressControllers
oc -n openshift-ingress-operator get ingresscontrollers

# Replace <ingresscontroller_name> with your IngressController name
oc -n openshift-ingress-operator get ingresscontrollers/<ingresscontroller_name> -o json | jq '.metadata.annotations."ingress.operator.openshift.io/default-enable-http2"'
```

- If the output is `"true"`, it means HTTP/2 is enabled.
- If the output is `null` or empty, HTTP/2 is not enabled.

<details>
   <summary>Enable HTTP/2</summary>

If HTTP/2 is not enabled, you can enable it by running the following command:

**IngressController configuration:**

```bash
oc -n openshift-ingress-operator annotate ingresscontrollers/<ingresscontroller_name> ingress.operator.openshift.io/default-enable-http2=true
```

**Global cluster configuration:**

```bash
oc annotate ingresses.config/cluster ingress.operator.openshift.io/default-enable-http2=true
```

This will add the necessary annotation to [enable HTTP/2 for Ingress in your OpenShift cluster](https://docs.openshift.com/container-platform/latest/networking/ingress-operator.html#nw-http2-haproxy_configuring-ingress) globally on the cluster.

</details>

#### Configure Route TLS

Additionally, the Zeebe Gateway should be configured to use an encrypted connection with TLS. In OpenShift, the connection from HAProxy to the Zeebe Gateway service can use HTTP/2 only for re-encryption or pass-through routes, and not for edge-terminated or insecure routes.

1. **Zeebe Gateway:** two [TLS secrets](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) for the Zeebe Gateway are required, one for the **service** and the other one for the **route**:

   - The first TLS secret is issued to the Zeebe Gateway Service Name. This must use the [PKCS #8 syntax](https://en.wikipedia.org/wiki/PKCS_8) or [PKCS #1 syntax](https://en.wikipedia.org/wiki/PKCS_1) as Zeebe only supports these, referenced as `camunda-platform-internal-service-certificate`.

     In the example below, a TLS certificate is generated for the Zeebe Gateway service with an [annotation](https://docs.openshift.com/container-platform/latest/security/certificates/service-serving-certificate.html). The generated certificate will be in the form of a secret.

     Another option is [Cert Manager](https://docs.openshift.com/container-platform/latest/security/cert_manager_operator/index.html). For more details, review the [OpenShift documentation](https://docs.openshift.com/container-platform/latest/networking/routes/secured-routes.html#nw-ingress-creating-a-reencrypt-route-with-a-custom-certificate_secured-routes).

   <details>
     <summary>PKCS #8, PKCS #1 syntax</summary>

   > PKCS #1 private key encoding. PKCS #1 produces a PEM block that contains the private key algorithm in the header and the private key in the body. A key that uses this can be recognised by its BEGIN RSA PRIVATE KEY or BEGIN EC PRIVATE KEY header. NOTE: This encoding is not supported for Ed25519 keys. Attempting to use this encoding with an Ed25519 key will be ignored and default to PKCS #8.

   > PKCS #8 private key encoding. PKCS #8 produces a PEM block with a static header and both the private key algorithm and the private key in the body. A key that uses this encoding can be recognised by its BEGIN PRIVATE KEY header.

   [PKCS #1, PKCS #8 syntax definitionfrom cert-manager](https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.PrivateKeyEncoding)

   </details>

   - The second TLS secret is used on the exposed route, referenced as `camunda-platform-external-certificate`. For example, this would be the same TLS secret used for Ingress. We also configure the Zeebe Gateway Ingress to create a [Re-encrypt Route](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html#nw-ingress-creating-a-route-via-an-ingress_route-configuration).

   Finally, we mount the **Service Certificate Secret** (`camunda-platform-internal-service-certificate`) to the Zeebe Gateway Pod.
   Update your `values.yml` file with the following:

   ```yaml reference
   https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/zeebe-gateway-route.yml
   ```

   The domain used by the Zeebe Gateway for gRPC is `zeebe-$DOMAIN_NAME` which different from the one used for the rest, namely `$DOMAIN_NAME`, to avoid any conflicts. It is also important to note that the port used for gRPC is `443`.

2. **Operate:** mount the **Service Certificate Secret** to the Operate pod and configure the secure TLS connection. Here, only the `tls.crt` file is required.

Update your `values.yml` file with the following:

```yaml reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/operate-route.yml
```

The actual configuration properties can be reviewed [in the Operate configuration documentation](/self-managed/operate-deployment/operate-configuration.md#zeebe-broker-connection).

1. **Tasklist:** mount the **Service Certificate Secret** to the Tasklist pod and configure the secure TLS connection. Here, only the `tls.crt` file is required.

   Update your `values.yml` file with the following:

```yaml reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/tasklist-route.yml
```

The actual configuration properties can be reviewed [in the Tasklist configuration documentation](/self-managed/tasklist-deployment/tasklist-configuration.md#zeebe-broker-connection).

1. **Connectors:** update your `values.yml` file with the following:

```yaml reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/connectors-route.yml
```

The actual configuration properties can be reviewed [in the Connectors configuration documentation](/self-managed/connectors-deployment/connectors-configuration.md#zeebe-broker-connection).

1. Configure all other applications running inside the cluster and connecting to the Zeebe Gateway to also use TLS.

1. Set up the global configuration to enable the single Ingress definition with the host. Update your configuration file as shown below:

```yaml reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/helm-values/domain.yml
```

<!--Intended space left for not breaking the build!-->

<!--Intended space left for not breaking the build!-->
  </TabItem>

  <TabItem value="kubernetes-ingress" label="Using Kubernetes Ingress">

[Routes](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html) serve as OpenShift's default Ingress implementation.

If you find that its features aren't suitable for your needs, or if you prefer to use a Kubernetes-native Ingress controller, such as the [ingress-nginx controller](https://github.com/kubernetes/ingress-nginx), [you have that option](https://www.redhat.com/en/blog/a-guide-to-using-routes-ingress-and-gateway-apis-in-kubernetes-without-vendor-lock-in).

For guidance on installing an Ingress controller, you can refer to the [Ingress Setup documentation](/self-managed/setup/guides/ingress-setup.md).

:::note Difference between ingress-nginx and NGINX Ingress

Do not confuse the [ingress-nginx controller](https://github.com/kubernetes/ingress-nginx) with the [NGINX Ingress Controller](https://www.redhat.com/en/blog/using-nginx-ingress-controller-red-hat-openshift) that is endorsed by Red Hat for usage with OpenShift. Despite very similar names, they are two different products.

If you should decide to use the Red Hat endorsed [NGINX Ingress Controller](https://www.redhat.com/en/blog/using-nginx-ingress-controller-red-hat-openshift), you would require additional adjustments done to the Camunda 8 Ingress objects and the NGINX Ingress Controller itself to make `gRPC` and `HTTP/2` connections work. In that case, please refer to the [example and the prerequisites](https://github.com/nginxinc/kubernetes-ingress/blob/main/examples/ingress-resources/grpc-services/README.md).

:::

  </TabItem>
  <TabItem value="no-ingress" label="No Ingress">
If you do not have a domain name or do not intend to use one for your Camunda 8 deployment, external access to Camunda 8 web endpoints from outside the OpenShift cluster will not be possible.

However, you can use `kubectl port-forward` to access the Camunda platform without a domain name or Ingress configuration. For more information, refer to the [kubectl port-forward documentation](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/).

To make this work, you will need to configure the deployment to reference `localhost` with the forwarded port. Update your `values.yml` file with the following:

```yaml reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/no-domain.yml
```

  </TabItem>
</Tabs>

#### Configuring the Security Context Constraints

Depending on your OpenShift cluster's Security Context Constraints (SCCs) configuration, the deployment process may vary.
By default, OpenShift employs more restrictive SCCs. The Helm chart must assign `null` to the user running all components and dependencies.

<Tabs queryString="current-scc">
<TabItem value="w-scc" label="Restrictive SCCs" default>

The `global.compatibility.openshift.adaptSecurityContext` variable in your values.yaml can be used to set the following possible values:

- `force`: The `runAsUser` and `fsGroup` values will be null in all components.
- `disabled`: The `runAsUser` and `fsGroup` values will not be modified (default).

```hcl reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/scc.yml
```

</TabItem>
<TabItem value="no-scc" label="Permissive SCCs">

To use permissive SCCs, simply install the charts as they are. Follow the [general Helm deployment guide](/self-managed/setup/install.md).

```hcl reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/helm-values/no-scc.yml
```

</TabItem>
</Tabs>

#### Enable Enterprise components

Some components are not enabled by default in this deployment. For more information on how to configure and enable these components, refer to [configuring Enterprise components and Connectors](/self-managed/setup/install.md#configuring-enterprise-components-and-connectors).

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
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/procedure/generate-passwords.sh
```

Use these environment variables in the `kubectl` command to create the secret.

- The `smtp-password` should be replaced with the appropriate external value ([see how it's used by Web Modeler](/self-managed/modeler/web-modeler/configuration/configuration.md#smtp--email)).

```bash reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/procedure/create-identity-secret.sh
```

### Install Camunda 8 using Helm

Now that the `generated-values.yml` is ready, you can install Camunda 8 using Helm.

The following are the required environment variables with some example values:

```bash reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/procedure/chart-env.sh
```

Then run the following command:

```bash reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/generic/openshift/single-region/procedure/install-chart.sh
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

## Verify connectivity to Camunda 8

Please follow our [guide to verify connectivity to Camunda 8](/self-managed/setup/deploy/amazon/amazon-eks/eks-helm.md#verify-connectivity-to-camunda-8)

:::caution Domain name for gRPC Zeebe

In this setup, the domain used for gRPC communication with Zeebe is slightly different from the one in the guide. Instead of using `zeebe.$DOMAIN_NAME`, you need to use `zeebe-$DOMAIN_NAME`.

:::

## Pitfalls to avoid

For general deployment pitfalls, visit the [deployment troubleshooting guide](/self-managed/operational-guides/troubleshooting/troubleshooting.md).

### Security Context Constraints (SCCs)

[Security Context Constraints (SCCs)](https://docs.openshift.com/container-platform/latest/authentication/managing-security-context-constraints.html) are a set of conditions that a pod must adhere to in order to be accepted into the system. They define the security conditions under which a pod operates.

Similar to how roles control user permissions, SCCs regulate the permissions of deployed applications, both at the pod and container level. It's generally recommended to deploy applications with the most restrictive SCCs possible. If you're unfamiliar with security context constraints, you can refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/latest/authentication/managing-security-context-constraints.html).

<Tabs queryString="current-scc">
  <TabItem value="scc" label="Restrictive SCCs (default)" default>

#### Restrictive SCCs

The following represents the most restrictive SCCs that can be used to deploy Camunda 8. Note that in OpenShift 4.10, these are equivalent to the built-in `restricted` SCCs (which are the default SCCs).

```yaml
Allow Privileged: false
Default Add Capabilities: <none>
Required Drop Capabilities: KILL, MKNOD, SYS_CHROOT, SETUID, SETGID
Allowed Capabilities: <none>
Allowed Seccomp Profiles: <none>
Allowed Volume Types: configMap, downwardAPI, emptyDir, persistentVolumeClaim, projected, secret
Allow Host Network: false
Allow Host Ports: false
Allow Host PID: false
Allow Host IPC: false
Read Only Root Filesystem: false
Run As User Strategy: MustRunAsRange
SELinux Context Strategy: MustRunAs
FSGroup Strategy: MustRunAs
Supplemental Groups Strategy: RunAsAny
```

When using these SCCs, be sure not to specify _any_ `runAsUser` or `fsGroup` values in either the pod or container security context. Instead, allow OpenShift to assign arbitrary IDs.

:::note
If you are providing the ID ranges yourself, you can also configure the `runAsUser` and `fsGroup` values accordingly.
:::

The Camunda Helm chart can be deployed to OpenShift with a few modifications, primarily revolving around your desired security context constraints.
</TabItem>
<TabItem value="no-root-scc" label="Non-root SCCs">

#### Non-root SCCs

If you intend to deploy Camunda 8 while restricting applications from running as root (e.g., using the `nonroot` built-in SCCs), you'll need to configure each pod and container to run as a non-root user. For example, when deploying Zeebe using a stateful set, you would include the following YAML, replacing `1000` with the desired user ID:

```yaml
spec:
  template:
    spec:
      securityContext:
        runAsUser: 1000
      containers:
        securityContext:
          runAsUser: 1000
```

:::note
As the container user in OpenShift is always part of the root group, defining a `fsGroup` for any Camunda 8 application pod security context is unnecessary.
:::

This configuration is necessary for all Camunda 8 applications, as well as related ones (e.g., Keycloak, PostgreSQL, etc.). It's particularly crucial for stateful applications that will write to persistent volumes, but it's also generally a good security practice.
</TabItem>
<TabItem value="permissive-scc" label="Permissive SCCs">

#### Permissive SCCs

If you deploy Camunda 8 (and related infrastructure) with permissive SCCs out of the box, there's nothing specific for you to configure. Here, permissive SCCs refer to those where the strategy for `RunAsUser` is defined as `RunAsAny` (including root).

  </TabItem>
</Tabs>
