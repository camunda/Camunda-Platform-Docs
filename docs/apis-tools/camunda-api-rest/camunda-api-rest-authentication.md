---
id: camunda-api-rest-authentication
title: "Authentication"
description: "Step through authentication options that can be used to access Camunda 8 REST API."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

All Camunda 8 REST API requests require authentication. To authenticate, generate a [JSON Web Token (JWT)](https://jwt.io/introduction/) depending on your environment and include it in each request.

## Generate a token

<Tabs groupId="environment" defaultValue="saas" queryString values={
[
{label: 'SaaS', value: 'saas' },
{label: 'Self-Managed', value: 'self-managed' },
]}>

<TabItem value='saas'>

1. [Create client credentials](/guides/setup-client-connection-credentials.md) in the **Clusters > Cluster name > API** tab of [Camunda Console](https://console.camunda.io/).
2. Add permissions to this client for **Zeebe**.
3. Once you have created the client, capture the following values required to generate a token:
   <!-- this comment convinces the markdown processor to still treat the table as a table, but without adding surrounding paragraphs. 🤷 -->
   | Name                     | Environment variable name        | Default value                                |
   | ------------------------ | -------------------------------- | -------------------------------------------- |
   | Client ID                | `ZEEBE_CLIENT_ID`                | -                                            |
   | Client Secret            | `ZEEBE_CLIENT_SECRET`            | -                                            |
   | Authorization Server URL | `ZEEBE_AUTHORIZATION_SERVER_URL` | `https://login.cloud.camunda.io/oauth/token` |
   | Audience                 | `ZEEBE_TOKEN_AUDIENCE`           | `zeebe.camunda.io`                           |
   | Zeebe REST Address       | `ZEEBE_REST_ADDRESS`             | -                                            |
   <!-- this comment convinces the markdown processor to still treat the table as a table, but without adding surrounding paragraphs. 🤷 -->
   :::caution
   When client credentials are created, the `Client Secret` is only shown once. Save this `Client Secret` somewhere safe.
   :::
4. Execute an authentication request to the token issuer:
   ```bash
   curl --request POST ${ZEEBE_AUTHORIZATION_SERVER_URL} \
       --header 'Content-Type: application/x-www-form-urlencoded' \
       --data-urlencode 'grant_type=client_credentials' \
       --data-urlencode "audience=${ZEEBE_TOKEN_AUDIENCE}" \
       --data-urlencode "client_id=${ZEEBE_CLIENT_ID}" \
       --data-urlencode "client_secret=${ZEEBE_CLIENT_SECRET}"
   ```
   A successful authentication response looks like the following:
   ```json
   {
     "access_token": "<TOKEN>",
     "expires_in": 300,
     "refresh_expires_in": 0,
     "token_type": "Bearer",
     "not-before-policy": 0
   }
   ```
5. Capture the value of the `access_token` property and store it as your token.

</TabItem>

<TabItem value='self-managed'>

1. [Add an M2M application in Identity](/self-managed/identity/user-guide/additional-features/incorporate-applications.md).
2. [Add permissions to this application](/self-managed/identity/user-guide/additional-features/incorporate-applications.md) for **Camunda 8 REST API**.
3. Capture the `Client ID` and `Client Secret` from the application in Identity.
4. [Generate a token](/self-managed/identity/user-guide/authorizations/generating-m2m-tokens.md) to access the REST API. Provide the `client_id` and `client_secret` from the values you previously captured in Identity.
   ```shell
   curl --location --request POST 'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token' \
   --header 'Content-Type: application/x-www-form-urlencoded' \
   --data-urlencode "client_id=${CLIENT_ID}" \
   --data-urlencode "client_secret=${CLIENT_SECRET}" \
   --data-urlencode 'grant_type=client_credentials'
   ```
   A successful authentication response looks like the following:
   ```json
   {
     "access_token": "<TOKEN>",
     "expires_in": 300,
     "refresh_expires_in": 0,
     "token_type": "Bearer",
     "not-before-policy": 0
   }
   ```
5. Capture the value of the `access_token` property and store it as your token.

</TabItem>

</Tabs>

## Use a token

Include the previously captured token as an authorization header in each request: `Authorization: Bearer <TOKEN>`.

For example, to send a request to the Camunda 8 REST API's `/topology` endpoint:

<Tabs groupId="environment" defaultValue="saas" queryString values={
[
{label: 'SaaS', value: 'saas' },
{label: 'Self-Managed', value: 'self-managed' },
]}>

<TabItem value='saas'>

:::tip
The `${ZEEBE_REST_ADDRESS}` variable below represents the URL of the Camunda 8 REST API. You can capture this URL when creating an API client. You can also construct it as `https://${REGION_ID}.zeebe.camunda.io/${CLUSTER_ID}/`.
:::

</TabItem>

<TabItem value='self-managed'>

:::tip
The `${ZEEBE_REST_ADDRESS}` variable below represents the URL of the Camunda 8 REST API. You can configure this value in your Self-Managed installation. The default value is `http://localhost:8080/`.
:::

</TabItem>

</Tabs>

```shell
curl --header "Authorization: Bearer ${TOKEN}" \
     ${ZEEBE_REST_ADDRESS}/v2/topology
```

A successful response includes [information about the cluster](/apis-tools/camunda-api-rest/specifications/get-topology.api.mdx). For example:

```json
{
  "brokers": [
    ...
  ],
  "clusterSize": 3,
  "partitionsCount": 3,
  "replicationFactor": 3,
  "gatewayVersion": "8.6.0"
}
```

## Token expiration

Access tokens expire according to the `expires_in` property of a successful authentication response. After this duration, in seconds, you must request a new access token.

## Authentication via cookie (Self-Managed only)

:::note
When authenticating via cookie, note that Cross-Site Request Forgery (CSRF) protection must be disabled to allow this method of authentication. In a Camunda Self-Managed cluster, set the following configuration properties:

```sh
CAMUNDA_REST_QUERY_ENABLED=true
CAMUNDA_OPERATE_CSRFPREVENTIONENABLED=false
CAMUNDA_TASKLIST_CSRFPREVENTIONENABLED=false
```

:::

Another way to access the Camunda 8 REST API in a Self-Managed cluster is to send cookie headers in each request. The cookie can be obtained by using the API endpoint `/api/login`. Take the following steps:

1. Log in as user 'demo' and store the cookie in the file `cookie.txt`:

```shell
curl -c cookie.txt -X POST 'http://localhost:8080/api/login?username=demo&password=demo'
```

2. Send the cookie (as a header) in each API request. In this case, request all process definitions:

```shell
curl -b cookie.txt -X POST 'http://localhost:8080/v2/user-task/search' -H 'Content-Type: application/json' -d '{}'
```
