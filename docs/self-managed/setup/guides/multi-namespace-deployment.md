---
id: multi-namespace-deployment
title: "Multi-namespace deployment"
description: "Deploy Camunda 8 Self-Managed across several namespaces for better resource management and environment separation."
---

Camunda 8 Self-Managed offers flexible deployment options that allow it to span multiple namespaces. This setup consists of a management cluster, which includes the Console, Identity, and Web Modeler components, along with several orchestration clusters (including Zeebe, Operate, Tasklist, and Optimize).

For this configuration, each namespace is set up independently through Helm, with deployments classified into two types: `Web Modeler and Console` and `Camunda Orchestration Cluster`. Each type has a specific values file designed for its deployment requirements.

Below, we illustrate multi-namespace Camunda deployment: one namespace will be dedicated to the `Web Modeler and Console` cluster, and the other two will be used for the `Camunda Orchestration cluster`.

## Web Modeler and Console deployment

This deployment includes Identity, Web Modeler, and Console. Identity allows the other two deployments to authenticate against Keycloak. Web Modeler is a central tool for designing and deploying business process diagrams across all your automation deployments. Console enables you to get a high-level view of your `Camunda Orchestration` clusters.
Create the following Management deployment Helm values file.

```yaml
# File: camunda-main.yaml
global:
  ingress:
    host: camunda-main.example.com
  identity:
    auth:
      console:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
      connectors:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
      core:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
        redirectUrl: "https://camunda-team01.example.com/core,https://camunda-team02.example.com/core"
      optimize:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
        redirectUrl: "https://camunda-team01.example.com/optimize,https://camunda-team02.example.com/optimize"
core:
  enabled: false
optimize:
  enabled: false
connectors:
  enabled: false
elasticsearch:
  enabled: false
```

Install Camunda Management cluster with Helm:

```shell
helm install camunda camunda/camunda-platform \
  -n camunda-main \
  -f camunda-main.yaml
```

## Team One deployment

Let's create a Camunda orchestration cluster that can be owned and managed by Team One and will be deployed into namespace `camunda-team01`. This deployment includes Core, and Optimize, and authenticates against Keycloak in the Management deployment:

```yaml
# File: camunda-team01.yaml
global:
  ingress:
    host: camunda-team01.example.com
  identity:
    auth:
      publicIssuerUrl: "https://camunda-main.example.com/auth/realms/camunda-platform"
      connectors:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
      optimize:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
      core:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
    service:
      url: "http://camunda-main-identity.camunda-main.svc.cluster.local:80/identity"
    keycloak:
      url:
        protocol: "http"
        host: "camunda-main-keycloak.camunda-main.svc.cluster.local"
        port: "80"
identity:
  enabled: false
webModeler:
  enabled: false
postgresql:
  enabled: false
```

Then, install as usual:

```shell
helm template camunda camunda/camunda-platform \
  -n camunda-team01 \
  -f camunda-team01.yaml
```

## Team Two deployment

This deployment uses namespace `camunda-team02`, includes Core, and Optimize, and authenticates against Keycloak in the management deployment:

```yaml
# File: camunda-team02.yaml
global:
  ingress:
    host: camunda-team02.example.com
  identity:
    auth:
      publicIssuerUrl: "https://camunda-main.example.com/auth/realms/camunda-platform"
      connectors:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
      core:
        existingSecret: <APP_MACHINE2MACHINE_SECRET>
    service:
      url: "http://camunda-main-identity.camunda-main.svc.cluster.local:80/identity"
    keycloak:
      url:
        protocol: "http"
        host: "camunda-main-keycloak.camunda-main.svc.cluster.local"
        port: "80"
identity:
  enabled: false
webModeler:
  enabled: false
postgresql:
  enabled: false
```

Then, install as usual:

```shell
helm install camunda camunda/camunda-platform \
  -n camunda-team02 \
  -f camunda-team02.yaml
```

## Multi-namespace Camunda Console deployment

To use Camunda Console Self-Managed in a multi-namespace setup, obtain Helm deployment configuration for all namespaces/deployments you would like Console to manage.

Update `Web Modeler and Console` deployment to deploy Console Self-Managed. For more details, visit this [Installation guide](/self-managed/setup/install.md#install-console).

Assuming Camunda clusters have been deployed using the above examples, run the following script to get the release information for all deployments.

```shell
DEPLOYMENTS="camunda-main camunda-team01 camunda-team02"

for DEPLOYMENT in ${DEPLOYMENTS}; do
  helm template camunda camunda/camunda-platform \
    -n ${DEPLOYMENT} -f ${DEPLOYMENT}.yaml \
    --show-only templates/camunda/configmap-release.yaml |
      kubectl apply --dry-run=client -o jsonpath='{.data.info}' -f -
done
```

Add the output of this command to the management deployment values file `camunda-main.yaml`:

```yaml
console:
  configuration: |
    camunda:
      console:
        managed:
          method: plain
          releases:
          # This is the output of the script above.
          - name: camunda
            namespace: camunda-main
            version: 9.1.2
            components:
            - name: Keycloak
              url: http://camunda-main.example.com/auth
            - name: Identity
              url: http://camunda-main.example.com
              readiness: http://camunda-identity.camunda-main:80/actuator/health
              metrics: http://camunda-identity.camunda-main:82/actuator/prometheus- name: camunda
            namespace: camunda-team01
            version: 9.1.2
            components:
            - name: Operate
              url: http://camunda-team01.example.com
              readiness: http://camunda-operate.camunda-team01:80/actuator/health/readiness
              metrics: http://camunda-operate.camunda-team01:80/actuator/prometheus
            - name: Optimize
              url: http://camunda-team01.example.com
              readiness: http://camunda-optimize.camunda-team01:80/api/readyz
              metrics: http://camunda-optimize.camunda-team01:8092/actuator/prometheus
            - name: Tasklist
              url: http://camunda-team01.example.com
              readiness: http://camunda-tasklist.camunda-team01:80/actuator/health/readiness
              metrics: http://camunda-tasklist.camunda-team01:80/actuator/prometheus
            - name: Zeebe Gateway
              url:
                grpc: grpc://zeebe.camunda-team01.example.com
                http: http://camunda-team01.example.com/zeebe
              readiness: http://camunda-zeebe-gateway.camunda-team01:9600/actuator/health/readiness
              metrics: http://camunda-zeebe-gateway.camunda-team01:9600/actuator/prometheus
            - name: Zeebe
              readiness: http://camunda-zeebe.camunda-team01:9600/ready
              metrics: http://camunda-zeebe.camunda-team01:9600/actuator/prometheus- name: camunda
            namespace: camunda-team02
            version: 9.1.2
            components:
            - name: Operate
              url: http://camunda-team02.example.com
              readiness: http://camunda-operate.camunda-team02:80/actuator/health/readiness
              metrics: http://camunda-operate.camunda-team02:80/actuator/prometheus
            - name: Optimize
              url: http://camunda-team02.example.com
              readiness: http://camunda-optimize.camunda-team02:80/api/readyz
              metrics: http://camunda-optimize.camunda-team02:8092/actuator/prometheus
            - name: Tasklist
              url: http://camunda-team02.example.com
              readiness: http://camunda-tasklist.camunda-team02:80/actuator/health/readiness
              metrics: http://camunda-tasklist.camunda-team02:80/actuator/prometheus
            - name: Zeebe Gateway
              url:
                grpc: grpc://zeebe.camunda-team02.example.com
                http: http://camunda-team02.example.com/zeebe
              readiness: http://camunda-zeebe-gateway.camunda-team02:9600/actuator/health/readiness
              metrics: http://camunda-zeebe-gateway.camunda-team02:9600/actuator/prometheus
            - name: Zeebe
              readiness: http://camunda-zeebe.camunda-team02:9600/ready
              metrics: http://camunda-zeebe.camunda-team02:9600/actuator/prometheus
```

:::note
The above values highlight the changes needed to set up the multi-namespace deployment. These parameters must be incorporated/merged with other Helm Chart values (e.g., TLS or Ingress setup).

Additionally, the machine-to-machine secrets should be the same across all namespaces for each Camunda component to authenticate against Keycloak.

For more details, check the full [Helm values](https://artifacthub.io/packages/helm/camunda/camunda-platform#parameters).
:::
