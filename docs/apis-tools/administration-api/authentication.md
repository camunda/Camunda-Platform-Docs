---
id: authentication
title: Authentication
slug: /apis-tools/administration-api/authentication
sidebar_position: 2
description: "Learn about access tokens and client credentials and scopes to get started with the Administration API."
---

To access the API endpoint, you need an access token. Your client must send a header in each request:

`Authorization: Bearer <Token>`

For example, send a request using _curl_:

```shell
curl -X POST -H -H :accept: application/json" -H "Authorization: Bearer <TOKEN>" -d '' http://api.cloud.camunda.io/clusters
```

For all requests, include the access token in the authorization header: `authorization:Bearer ${TOKEN}`.

## Client credentials and scopes

To interact with Camunda 8 programmatically without using the Camunda 8 Console, create client credentials in the organization settings under the **Administration API** tab.

Client credentials are created for an organization, and therefore can access all Camunda 8 clusters of this organization.

Scopes define the access for client credentials. A client can have one or multiple of the following permissions:

![createConsoleApiClient](../../components/console/manage-organization/img/create-console-api-client.png)

A client can have one or multiple permissions from the following groups:

- **Cluster**: [Manage your clusters](/components/console/manage-clusters/create-cluster.md).
- **Zeebe Client**: [Manage API clients](/components/console/manage-clusters/manage-api-clients.md) for your cluster.
- **Web Modeler API**: Interact with the [Web Modeler API](/apis-tools/web-modeler-api/index.md).
- **IP Allowlist**: Configure [IP-Allowlist](/components/console/manage-clusters/manage-ip-whitelists.md) rules.
- **Connector Secrets**: [Manage secrets](/components/console/manage-clusters/manage-secrets.md) of your clusters.
- **Members**: [Manage members](/components/console/manage-organization/manage-users.md) of your organization.
- **Backups**: Manage [backups](https://docs.camunda.io/docs/components/concepts/backups) of your Camunda 8 clusters (only available to Enterprise customers).

The full API description can be found [here](https://console.cloud.camunda.io/customer-api/openapi/docs/#/).

:::note
After client credentials are created, the `Client Secret` is only shown once. Save this `Client Secret` somewhere safe.
:::

## Access token

Once you have your client credentials, you can retrieve an access token using the following command:

```bash
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"grant_type":"client_credentials", "audience":"api.cloud.camunda.io", "client_id":"XXX", "client_secret":"YYY"}' \
    https://login.cloud.camunda.io/oauth/token
```

:::note
Access tokens have a validity period found in the access token. After this time, a new access token must be requested.
:::

:::note
The auth service has built-in rate limiting. If too many token requests are executed in a short time, the client is blocked for a certain time. Since the access tokens have a certain validity period, they must be cached on the client side.
:::
