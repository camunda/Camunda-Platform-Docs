---
id: configuration
title: "Configuration"
description: "Learn about the Identity configuration options available in your Orchestration cluster."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
As a Spring Boot application, Identity supports any standard
[Spring configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) method.
:::

The following variables apply globally to all components within the Camunda Orchestration core: Zeebe, Operate, and Tasklist.

<!-- updates must be made to BOTH tables -->
<Tabs>
  <TabItem value="env" label="Environment variables" default>

| Environment variable                                  | Description                                                                                       | Default value       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------- |
| `SPRING_PROFILES_ACTIVE`                              | **Note:** This property will be deprecated as additional authentication methods become available. | `consolidated-auth` |
| `CAMUNDA_SECURITY_AUTHENTICATION_METHOD`              | The authentication method to use.                                                                 | `basic`             |
| `CAMUNDA_SECURITY_AUTHENTICATION_UNAUTHENTICATED-API` | If the API is enabled without authentication.                                                     | `true`              |
| `CAMUNDA_PERSISTENT_SESSIONS_ENABLED`                 | Enables shared authentication between the Orchestration web applications (Operate and Tasklist).  | `true`              |
| `CAMUNDA_SECURITY_AUTHORIZATIONS_ENABLED`             | If authorizations are enabled.                                                                    | `true`              |
| `CAMUNDA_SECURITY_INITIALIZATION_USERS[0]_USERNAME`   | The username of the first user.                                                                   | `demo`              |
| `CAMUNDA_SECURITY_INITIALIZATION_USERS[0]_PASSWORD`   | The password of the first user.                                                                   | `demo`              |
| `CAMUNDA_SECURITY_INITIALIZATION_USERS[0]_NAME`       | The name of the first user.                                                                       | Demo                |
| `CAMUNDA_SECURITY_INITIALIZATION_USERS[0]_EMAIL`      | The email address of the first user.                                                              | `demo@demo.com`     |

  </TabItem>
  <TabItem value="helm" label="Helm properties" default>

| Helm property                                         | Description                                                                                       | Default value       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------- |
| `spring.profiles.active`                              | **Note:** This property will be deprecated as additional authentication methods become available. | `consolidated-auth` |
| `camunda.security.authentication.method`              | The authentication method to use.                                                                 | `basic`             |
| `camunda.security.authentication.unauthenticated-api` | If the API is enabled without authentication.                                                     | `true`              |
| `camunda.persistent.sessions.enabled`                 | Enables shared authentication between the Orchestration web applications (Operate and Tasklist).  | `true`              |
| `camunda.security.authorizations.enabled`             | If authorizations are enabled.                                                                    | `true`              |
| `camunda.security.initialization.users[0].username`   | The username of the first user.                                                                   | `demo`              |
| `camunda.security.initialization.users[0].password`   | The password of the first user.                                                                   | `demo`              |
| `camunda.security.initialization.users[0].name`       | The name of the first user.                                                                       | `Demo`              |
| `camunda.security.initialization.users[0].email`      | The email address of the first user.                                                              | `demo@demo.com`     |

  </TabItem>
</Tabs>
