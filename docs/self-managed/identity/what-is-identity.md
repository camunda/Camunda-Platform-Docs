---
id: what-is-identity
title: "What is Identity?"
sidebar_label: "What is Identity?"
description: "Identity is the component within the Camunda 8 stack responsible for authentication and authorization."
---

Identity is the component within the Camunda 8 stack responsible for authentication and authorization. Identity functions differently in Orchestration clusters and in Console and Web Modeler. For more information on these differences, see the Self-Managed [reference architecture](/self-managed/reference-architecture/reference-architecture.md#orchestration-cluster-vs-web-modeler-and-console).

## Identity for Orchestration clusters

Identity is included by default in the [Orchestration cluster](/self-managed//reference-architecture/reference-architecture.md#orchestration-cluster), and does not require any external dependencies. For more information, see the Identity [configuration options](/self-managed/identity/orchestration-identity/configuration.md).

## Identity for Web Modeler and Console

For [Web Modeler and Console deployments](/self-managed/reference-architecture/reference-architecture.md#), Identity runs as a separate and dedicated component. For more information, see the guides on using an [existing Keycloak](/self-managed/setup/guides/using-existing-keycloak.md) instance, and connecting to an [OIDC provider](/self-managed/setup/guides/connect-to-an-oidc-provider.md).

Once deployed, Identity manages the following in Web Modeler and Console:

- Applications
- APIs
- Permissions
- Roles

For example, using Identity you can:

- [Add and assign a role to a user](/self-managed/identity/user-guide/roles/add-assign-role.md), which is a way to group sets of permissions which can be assigned to users using the Identity UI.
- [Add and assign a permission to a role](/self-managed/identity/user-guide/roles/add-assign-permission.md) to control the level of access a user or an application has to a particular component.
- [Create a group](/self-managed/identity/user-guide/groups/create-group.md) to apply a set of roles and authorizations to users.
- [Manage resource authorizations](/self-managed/identity/user-guide/authorizations/managing-resource-authorizations.md) to control resource access within the Identity application.
- [Utilize configuration variables](/self-managed/identity/deployment/configuration-variables.md).
