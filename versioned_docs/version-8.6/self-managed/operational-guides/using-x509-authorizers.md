---
id: using-x509-authorizers
title: "Using mTLS/X.509 Authorizers"
sidebar_label: "Using mTLS/X.509 Authorizers"
description: "Learn how to configure Camunda 8 using X.509 certificates to authenticate components"
---

:::caution
Current version of Camunda 8 does not support Desktop and Web Modelers.
:::

:::caution
This guide includes several code and configuration snippets related to security and certificate generating.
Those snippets are provided for demonstration purposes only and are required to be adjusted before using in production
environments, please use with caution.
:::

The default strategy for Camunda 8 authentication is OAuth2 client credentials flow.
This guide will explain how to configure your Camunda 8 instance to use OAuth2 with X.509 certificates to authenticate.

## Prerequisites

To begin using X.509 authorization, you need to have an ability to create and sign X.509 certificates with a trusted
CA authority certificate. The identity provider (IdP), e.g. Keycloak, has to support OAuth2 X.509 client certificate
authorization flows as per OAuth2 standard.

## (Optional) Generate trust store

Assuming, you are using self-generated root CA certificate, you need to create a new trust store, that includes your
root CA certificate.

One of the options to do so is using a `keytool`:

```bash
keytool -import -alias root.ca -file rootCA.crt -keypass $PW -keystore truststore.jks -storepass $PW -trustcacerts -noprompt
```

The outcome of this step has to be a `truststore.jks` file containing all trusted CA certificates.

## Identity Provider

Create PKCS12 keys, signed by your root CA certificate. Let your IdP use those certificates for managing SSL
connections.

For example, one can do the following, assuming Keycloak is chosen IdP:

```bash
IDP_COUNTRY="DE"
IDP_STATE="BW"
IDP_LOCALITY="Karlsruhe"
IDP_ORG_NAME="IDP Security Provider GmbH"
IDP_ORG_UNIT="Keycloak Dept"
IDP_SERVER_CN="keycloak"

# Generate new Keycloak key and certificate
openssl req -new -newkey rsa:4096 -keyout keycloak.key -out keycloak.csr -nodes -subj "/C=$IDP_COUNTRY/ST=$IDP_STATE/L=$IDP_LOCALITY/O=$IDP_ORG_NAME/OU=$IDP_ORG_UNIT/CN=$IDP_SERVER_CN" -passout pass:$PW

# Define extension params for Keycloak
cat <<EOF > keycloak.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names

[alt_names]
DNS.1 = $IDP_SERVER_CN
EOF

# Sign keycloak key with CA certificate
openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in keycloak.csr -out keycloak.crt -days 3650 -CAcreateserial -passin pass:$PW -extfile keycloak.ext

openssl pkcs12 -export -out keycloak.p12 -name "keycloak" -inkey keycloak.key -in keycloak.crt -passout pass:$PW

# Convert keycloak certificate to PEM format
openssl x509 -in keycloak.crt -out keycloak-crt.pem -outform PEM

# Convert keycloak key to PEM format
openssl rsa -in  keycloak.key -out keycloak-key.pem # KEY

cat keycloak-crt.pem rootCA-crt.pem > keycloak-crt-chain.pem # CERTIFICATE
```

If using Keycloak, unable SSL by the following environment variables:

```bash
KC_HTTPS_CERTIFICATE_KEY_FILE: /path/to/key.pem
KC_HTTPS_CERTIFICATE_FILE: /path/to/certificate.pem
KC_HTTPS_TRUST_STORE_FILE: /path/to/truststore.jks
KC_HTTPS_TRUST_STORE_PASSWORD: password
KC_HTTPS_CLIENT_AUTH: request
KEYCLOAK_HTTPS_PORT: 18443
```

## Camunda Identity

Generate a keystore with X.509 certificates, for example, as follows:

```bash
USER_COUNTRY="DE"
USER_STATE="BE"
USER_LOCALITY="Berlin"
USER_ORG_NAME="Camunda"
USER_ORG_UNIT="Identity"
USER_SERVER_CN="identity"
USER_EMAIL_ADDRESS="identity@camunda.com"

# Create identity certificate
openssl req -new -newkey rsa:4096 -nodes -keyout identity.key -out identity.csr -subj "/emailAddress="$USER_EMAIL_ADDRESS"/C=$USER_COUNTRY/ST=$USER_STATE/L=$USER_LOCALITY/O=$USER_ORG_NAME/OU=$USER_ORG_UNIT/CN=$USER_SERVER_CN"

# Sign identity certificate with CA
openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in identity.csr -out identity.crt -days 3650 -CAcreateserial -passin pass:$PW

# Export identity certificate
openssl pkcs12 -export -out identity.p12 -name "identity" -inkey identity.key -in identity.crt -passout pass:$PW
```

Camunda 8 Identity, is a Spring Boot Java application, follow an [official Oracle guide](https://docs.oracle.com/javaee/1.4/tutorial/doc/Security6.html)
to configure Camunda 8 Identity using SSL certificates. For example, via setting environment variable:

```bash
_JAVA_OPTIONS: "-Djavax.net.ssl.keyStore=/opt/security/conf/identity.p12 -Djavax.net.ssl.keyStorePassword=$PW -Djavax.net.ssl.trustStore=/opt/security/conf/truststore.jks -Djavax.net.ssl.trustStorePassword=$PW"
```

### BYO IdP with Camunda Identity

If you have already configured IdP, you may need to set the following environment variables while running
Camunda 8 Identity:

```bash
CAMUNDA_IDENTITY_TYPE: GENERIC
SPRING_PROFILES_ACTIVE: oidc
CAMUNDA_IDENTITY_ISSUER_BACKEND_URL: https://issuer.backend.url
CAMUNDA_IDENTITY_CLIENT_ID: camunda-identity
CAMUNDA_IDENTITY_CLIENT_SECRET: null
CAMUNDA_IDENTITY_BASE_URL: http://${HOST}:8084
CAMUNDA_IDENTITY_ISSUER: https://issuer.url
CAMUNDA_IDENTITY_ISSUER_URL: https://issuer.url
CAMUNDA_IDENTITY_AUDIENCE: camunda-identity-resource-server
IDENTITY_INITIAL_CLAIM_NAME: claim-name
IDENTITY_INITIAL_CLAIM_VALUE: claim-value
```

Learn more at the Camunda 8 [Identity configuration guide](/self-managed/identity/user-guide/configuration/making-identity-production-ready.md).

## Zeebe

Follow the dedicated Zeebe page to set up SSL certificates.

Please, keep in mind, several component may attempt to authorize via Zeebe, meaning they will use Zeebe client ID but
component's certificate DN. Therefore, Zeebe's certificate has to be (1) either intermediary, or (2) your IdP has to
support DN regular expressions.

Learn more about [Zeebe secure client communication](/self-managed/zeebe-deployment/security/secure-client-communication.md).

## Operate, Tasklist, Optimize, Connectors

For each component, generate and sign PKCS12 key stores, for example, for Operate:

```bash
USER_COUNTRY="DE"
USER_STATE="BE"
USER_LOCALITY="Berlin"
USER_ORG_NAME="Camunda"
USER_ORG_UNIT="Operate"
USER_SERVER_CN="operate"
USER_EMAIL_ADDRESS="operate@camunda.com"

# Create operate certificate
openssl req -new -newkey rsa:4096 -nodes -keyout operate.key -out operate.csr -subj "/emailAddress="$USER_EMAIL_ADDRESS"/C=$USER_COUNTRY/ST=$USER_STATE/L=$USER_LOCALITY/O=$USER_ORG_NAME/OU=$USER_ORG_UNIT/CN=$USER_SERVER_CN"

# Sign operate certificate with CA
openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in operate.csr -out operate.crt -days 3650 -CAcreateserial -passin pass:$PW

# Export operate certificate
openssl pkcs12 -export -out operate.p12 -name "operate" -inkey operate.key -in operate.crt -passout pass:$PW
```

These components are regular Java applications. Follow an [official Oracle guide](https://docs.oracle.com/javaee/1.4/tutorial/doc/Security6.html)
to configure their using SSL certificates. For example, via setting environment variable:

```bash
_JAVA_OPTIONS=-Djavax.net.ssl.keyStore=/path/to/components/keystore.p12 -Djavax.net.ssl.keyStorePassword=$PW -Djavax.net.ssl.trustStore=/opt/security/conf/truststore.jks -Djavax.net.ssl.trustStorePassword=$PW
```

## Enable X.509 authorizers in IdP

Go to your IdP client settings and change authorization method from Client Credentials to X.509 Authorizer.
In Keycloak, for example, you can do it through Home Page -> Select Realm -> Clients -> Select Client -> Credentials -> Client Authenticator -> X.509 Certificate.

In the Subject DN field input the subject DN of your certificate. Please, keep in mind that both the order and attributes
are important. In the [Operate](#operate-tasklist-optimize-connectors) example, the Subject DN field value will be
`CN=operate, OU=Operate, O=Camunda, L=Berlin, ST=BE, C=DE, EMAILADDRESS=operate@camunda.com`.

### Enable X.509 authorizers in IdP for Zeebe

Since components may authorize via Zeebe, using Zeebe's client ID but component's certificate, there are two options
how one can configure X.509 certificates.

#### Option 1: using intermediary certificate

In this option, certificate chains look as following:

- Zeebe: Root CA --signs--> Zeebe Intermediary Certificate (ZIC)
- Other components: Root CA --signs--> Zeebe Intermediary Certificate (ZIC) --signs--> Component Certificate (CC)

In that instance, Subject DN for the Zeebe client has to be the last common certificate in the chain, thus
in the mentioned example is ZIC. For the other components, the Subject DN remains the same - CC.

#### Option 2: using regular expressions

In this option, every component, including Zeebe, has its own certificate signed by Root CA. In that case, you can apply
a regular expression to the Subject DN if you IdP supports that. For example, in Keycloak, the Subject DN field may look
like `CN=(.*?), OU=(.*?), O=Camunda, L=Berlin, ST=BE, C=DE, EMAILADDRESS=(.*?)`.
