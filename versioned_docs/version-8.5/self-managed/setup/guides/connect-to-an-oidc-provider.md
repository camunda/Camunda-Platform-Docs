---
id: connect-to-an-oidc-provider
title: "Connect to an OpenID Connect provider"
description: "To enable a smoother integration with your existing systems, connect to an OpenID Connect provider"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

To enable a smoother integration with your existing systems, Camunda supports connecting to an OpenID Connect (OIDC) authentication provider. To connect to a Keycloak authentication provider, see our guide on [using an existing Keycloak](using-existing-keycloak.md).

In this guide, we step through the configuration required to connect Camunda to your authentication provider.

## Prerequisites

- Information about your OIDC provider's configuration, including the issuer URL.
- Ability to create applications in your OIDC provider.
- Ability to access the following information about the applications you have created in your OIDC provider:
  - Client ID
  - Client secrets
  - Audience
- A [claim name and value](/self-managed/identity/deployment/configuration-variables.md#oidc-configuration) to use for initial access.

:::note
The steps below are a general approach for the Camunda components; it is important you reference the [component-specific
configuration](#component-specific-configuration) to ensure the components are configured correctly.
:::

## Configuration

<Tabs groupId="authPlatform" defaultValue="generic" queryString values={[{label: 'Generic', value: 'generic' },{label: 'Microsoft Entra ID', value: 'microsoftEntraId' }]} >
<TabItem value="generic">

<h3>Steps</h3>

1. In your OIDC provider, create an application for each of the components you want to connect. The expected redirect URI of the component you are configuring an app for can be found in [component-specific configuration](#component-specific-configuration).
2. For all Components, ensure the appropriate application type is used:
   - **Operate, Tasklist, Optimize, Identity:** Web applications requiring confidential access/a confidential client
   - **Web Modeler:** A single-page application requiring public access/a public client
3. Make a note of the following values for each application you create:
   - Client ID
   - Client secret
   - Audience
4. Set the following environment variables or Helm values for the component you are configuring an app for:

<Tabs groupId="optionsType" defaultValue="env" queryString values={[{label: 'Environment variables', value: 'env' },{label: 'Helm values', value: 'helm' }]} >
<TabItem value="env">

```
   CAMUNDA_IDENTITY_TYPE=GENERIC
   CAMUNDA_IDENTITY_BASE_URL=<IDENTITY_URL>
   CAMUNDA_IDENTITY_ISSUER=<URL_OF_ISSUER>
   CAMUNDA_IDENTITY_ISSUER_BACKEND_URL=<URL_OF_ISSUER> // this is used for container to container communication
   CAMUNDA_IDENTITY_CLIENT_ID=<Client ID from Step 2>
   CAMUNDA_IDENTITY_CLIENT_SECRET=<Client secret from Step 2>
   CAMUNDA_IDENTITY_AUDIENCE=<Audience from Step 2>
   IDENTITY_INITIAL_CLAIM_NAME=<Initial claim name  if not using the default "oid">
   IDENTITY_INITIAL_CLAIM_VALUE=<Initial claim value>
   SPRING_PROFILES_ACTIVE=oidc
```

</TabItem>
<TabItem value="helm">

```yaml
global:
  identity:
    auth:
      issuer: <URL_OF_ISSUER>
      # this is used for container to container communication
      issuerBackendUrl: <URL_OF_ISSUER>
      tokenUrl: <TOKEN_URL_ENDPOINT>
      jwksUrl: <JWKS_URL>
      type: "GENERIC"
      identity:
        clientId: <Client ID from Step 2>
        existingSecret: <Client secret from Step 2>
        audience: <Audience from Step 2>
        initialClaimName: <Initial claim name if not using the default "oid">
        initialClaimValue: <Initial claim value>
      operate:
        clientId: <Client ID from Step 2>
        audience: <Audience from Step 2>
        existingSecret: <Client secret from Step 2>
      tasklist:
        clientId: <Client ID from Step 2>
        audience: <Audience from Step 2>
        existingSecret: <Client secret from Step 2>
      optimize:
        clientId: <Client ID from Step 2>
        audience: <Audience from Step 2>
        existingSecret: <Client secret from Step 2>
      zeebe:
        clientId: <Client ID from Step 2>
        audience: <Audience from Step 2>
        existingSecret: <Client secret from Step 2>
      webModeler:
        clientId: <Client ID from Step 2>
        clientApiAudience: <Audience from Step 2>
        publicApiAudience: <Audience for using Web Modeler's API. For security reasons, use a different value than for clientApiAudience>
```

</TabItem>
</Tabs>

:::danger
Once set, your initial claim name and value cannot be updated using environment or Helm values, and must be changed directly in the database.
:::

<h3>Additional considerations</h3>

For authentication, the Camunda components use the scopes `email`, `openid`, `offline_access`, and `profile`.

</TabItem>
<TabItem value="microsoftEntraId">

<h3>Steps</h3>

:::note
Ensure you register a new application for each component.
:::

1. Within the Entra ID admin center, [register a new application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) for **each** component you would like to connect.
2. Navigate to the new application's **Overview** page, and make note of the **Client ID**.
3. Within your new application, [configure a platform](https://learn.microsoft.com/en-gb/entra/identity-platform/quickstart-register-app#configure-platform-settings) for the appropriate component:
   - **Web**: Operate, Tasklist, Optimize, Identity
   - **Single-page application**: Modeler
4. Add your component's redirect URI, found under [Component-specific configuration](#component-specific-configuration).
5. [Create a new client secret](https://learn.microsoft.com/en-gb/entra/identity-platform/quickstart-register-app?tabs=client-secret#add-credentials), and note the new secret's value for later use.
6. Set the following environment variables for the component you are configuring an app for:

<Tabs groupId="optionsType" defaultValue="env" queryString values={[{label: 'Environment variables', value: 'env' },{label: 'Helm values', value: 'helm' }]} >
<TabItem value="env">

```
    CAMUNDA_IDENTITY_TYPE=MICROSOFT
    CAMUNDA_IDENTITY_BASE_URL=<IDENTITY_URL>
    CAMUNDA_IDENTITY_ISSUER=https://login.microsoftonline.com/<Microsoft Entra tenant ID>/v2.0
    CAMUNDA_IDENTITY_ISSUER_BACKEND_URL=https://login.microsoftonline.com/<Microsoft Entra tenant ID>/v2.0
    CAMUNDA_IDENTITY_CLIENT_ID=<Client ID from Step 2>
    CAMUNDA_IDENTITY_CLIENT_SECRET=<Client secret from Step 5>
    CAMUNDA_IDENTITY_AUDIENCE=<Client ID from Step 2>
    IDENTITY_INITIAL_CLAIM_NAME=<Initial claim name if not using the default "oid">
    IDENTITY_INITIAL_CLAIM_VALUE=<Initial claim value>
    SPRING_PROFILES_ACTIVE=oidc
```

</TabItem>
<TabItem value="helm">

```yaml
global:
  identity:
    auth:
      issuer: https://login.microsoftonline.com/<Microsoft Entra tenant ID>/v2.0
      # this is used for container to container communication
      issuerBackendUrl: https://login.microsoftonline.com/<Microsoft Entra tenant ID>/v2.0
      tokenUrl: https://login.microsoftonline.com/<Microsoft Entra tenant ID>/oauth2/v2.0/token
      jwksUrl: https://login.microsoftonline.com/<Microsoft Entra tenant ID>/discovery/v2.0/keys
      type: "MICROSOFT"
      publicIssuerUrl: https://login.microsoftonline.com/<Microsoft Entra tenant ID>/v2.0
      identity:
        clientId: <Client ID from Step 2>
        existingSecret: <Client secret from Step 3>
        audience: <Client ID from Step 2>
        initialClaimName: <Initial claim name if not using the default "oid">
        initialClaimValue: <Initial claim value>
        redirectUrl: <See the Helm value in the table below>
      operate:
        clientId: <Client ID from Step 2>
        audience: <Client ID from Step 2>
        existingSecret: <Client secret from Step 5>
        redirectUrl: <See the Helm value in the table below>
      tasklist:
        clientId: <Client ID from Step 2>
        audience: <Client ID from Step 2>
        existingSecret: <Client secret from Step 5>
        redirectUrl: <See the Helm value in the table below>
      optimize:
        clientId: <Client ID from Step 2>
        audience: <Client ID from Step 2>
        existingSecret: <Client secret from Step 5>
        redirectUrl: <See the Helm value in the table below>
      zeebe:
        clientId: <Client ID from Step 2>
        audience: <Client ID from Step 2>
        existingSecret: <Client secret from Step 5>
        tokenScope: "<Client ID from Step 2>/.default"
      webModeler:
        clientId: <Client ID from Step 2>
        clientApiAudience: <Client ID from Step 2>
        publicApiAudience: <Audience for using Web Modeler's API. For security reasons, use a different value than for clientApiAudience>
        redirectUrl: <See the Helm value in the table below>
      connectors:
        clientId: <Client ID from Step 2>
        existingSecret: <Client secret from Step 5>
```

</TabItem>
</Tabs>

:::danger
Once set, your initial claim name and value cannot be updated using environment or Helm values, and must be changed directly in the database.
:::

<h3>Additional considerations</h3>

Due to technical limitations regarding [third party content](https://openid.net/specs/openid-connect-frontchannel-1_0.html#ThirdPartyContent),
front channel single sign out is not supported. This means that when a user logs out of one component, they will not be logged out of the other components.

For authentication, the Camunda components use the scopes `email`, `openid`, `offline_access`, `profile`,
and `<CLIENT_UUID>/.default`. To ensure your users are able to successfully authenticate with Entra ID, you must
ensure that either there is
an [admin consent flow configured](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-admin-consent-workflow)
or grant consent on behalf of your users using
the [admin consent](https://learn.microsoft.com/en-gb/entra/identity/enterprise-apps/user-admin-consent-overview#admin-consent)
process.

The client should be configured to support `grant_type`:

- To **create** an M2M token, the `client_credentials` grant type is required. The response contains an access token.
- To **renew** a token using a refresh token, the `refresh_token` grant type is required.
- To **create** a token via authorization flow, the `authorization_code` grant type is required. The response contains both access and refresh tokens.

To successfully authenticate with Entra ID, you should use the `v2.0` API. This means that
the `CAMUNDA_IDENTITY_ISSUER_BACKEND_URL` value should end with `/v2.0`.

Follow the [Microsoft Entra instructions](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest#configure-the-app-manifest-in-the-microsoft-entra-admin-center) to configure the app manifest, and set the [requestedAccessTokenVersion](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest#api-attribute) under `Api:` to `2`:

```json
    "requestedAccessTokenVersion": 2,
```

</TabItem>
</Tabs>

### Component-specific configuration

| Component   | Redirect URI                                                                                                                           | Notes/Limitations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity    | **Microsoft Entra ID:**<br/> `https://<IDENTITY_URL>/auth/login-callback` <br/><br/> **Helm:**<br/> `https://<IDENTITY_URL>`           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Operate     | **Microsoft Entra ID:**<br/> `https://<OPERATE_URL>/identity-callback` <br/><br/> **Helm:**<br/> `https://<OPERATE_URL>`               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Optimize    | **Microsoft Entra ID:** <br/> `https://<OPTIMIZE_URL>/api/authentication/callback` <br/><br/> **Helm:** <br/> `https://<OPTIMIZE_URL>` | There is a fallback if you use the existing ENV vars to configure your authentication provider, if you use a custom `yaml`, you need to update your properties to match the new values in this guide.<br/><br/>When using an OIDC provider, the following Optimize features are not currently available: <br/>- The user permissions tab in collections<br/>- The `Alerts` tab in collections<br/>- Digests<br/>- Accessible user names for Owners of resources (the `sub` claim value is displayed instead).                                                                                                                                                                                                                                                                                                                                                                                  |
| Tasklist    | **Microsoft Entra ID:**<br/> `https://<TASKLIST_URL>/identity-callback` <br/><br/> **Helm:**<br/> `https://<TASKLIST_URL>`             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Web Modeler | **Microsoft Entra ID:**<br/> `https://<WEB_MODELER_URL>/login-callback` <br/><br/> **Helm:**<br/> `https://<WEB_MODELER_URL>`          | Web Modeler requires two clients: one for the internal API, and one for the external/public API. <br/><br/> Required configuration variables for webapp:<br/>`OAUTH2_CLIENT_ID=[client-id]`<br/>`OAUTH2_JWKS_URL=[provider-jwks-url]`<br/>`OAUTH2_TOKEN_AUDIENCE=[client-audience]`<br/>`OAUTH2_TOKEN_ISSUER=[provider-issuer]`<br/>`OAUTH2_TYPE=[provider-type]`<br/><br/> Required configuration variables for restapi:<br/>`CAMUNDA_IDENTITY_BASEURL=[identity-base-url]`<br/>`CAMUNDA_IDENTITY_TYPE=[provider-type]`<br/>`CAMUNDA_MODELER_SECURITY_JWT_AUDIENCE_INTERNAL_API=[client-audience]`<br/>`CAMUNDA_MODELER_SECURITY_JWT_AUDIENCE_PUBLIC_API=[publicapi-audience]` (for security reasons, <strong>use a different value here than for `CAMUNDA_MODELER_SECURITY_JWT_AUDIENCE_INTERNAL_API`</strong>)<br/>`SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=[provider-issuer]` |
| Zeebe       | no redirect URI                                                                                                                        | Instead, include `tokenScope:"<Azure-AppRegistration-ClientID> /.default "`. This refers to the Helm value `global.identity.auth.zeebe.tokenScope`, which should be set to the displayed value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Connectors  |                                                                                                                                        | Connectors act as a client in the OIDC flow. <br/><br/> For outbound-only mode (when `CAMUNDA_CONNECTOR_POLLING_ENABLED` is `false`), only Zeebe client properties are required: <br/> `ZEEBE_CLIENT_ID=[client-id]`<br/>`ZEEBE_CLIENT_SECRET=[client-secret]`<br/>`ZEEBE_AUTHORIZATION_SERVER_URL=[provider-issuer]`<br/>`ZEEBE_TOKEN_AUDIENCE=[Zeebe audience]`<br/>`ZEEBE_TOKEN_SCOPE=[Zeebe scope]` (optional)<br/><br/> For inbound mode, Operate client properties are required:<br/>`CAMUNDA_IDENTITY_TYPE=[provider-type]`<br/>`CAMUNDA_IDENTITY_AUDIENCE=[Operate audience]`<br/>`CAMUNDA_IDENTITY_CLIENT_ID=[client-id]`<br/>`CAMUNDA_IDENTITY_CLIENT_SECRET=[client-secret]`<br/>`CAMUNDA_IDENTITY_ISSUER_BACKEND_URL=[provider-issuer]`                                                                                                                                            |
