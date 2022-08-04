---
id: introduction-to-connectors
title: Introduction to connectors
description: Introduction to connectors in Web Modeler
---

To automate complex [business processes](/components/concepts/processes.md) using Camunda Platform 8, a user has to implement the business logic using the concept of [job workers](/components/concepts/job-workers.md). Creating these job workers requires an initial investment and effort to get started with Camunda Platform 8. At the same time, some use cases require the same business logic to be implemented. The concept of connectors is to provide a solution to reduce the onboarding time to enable fast prototyping and solve everyday use cases in Camunda Platform 8.

A connector is a reusable building block that works out of the box. Each connector task can be configured with domain specific parameters without implementing custom business logic. In the following documentation, learn more about [using connectors](use-connectors.md) and which connectors are [available out of the box](available-connectors/available-connectors-overview.md).

The concept of a connector consists of two parts: the business logic is implemented as a [job worker](/components/concepts/job-workers.md), and the user interface during modeling is provided using an [element template](/components/modeler/desktop-modeler/element-templates/about-templates.md).

In Camunda Platform 8 SaaS, the provided connectors are operated by Camunda and offered in the scope of the product. In Camunda Platform 8 Self-Managed, the user can employ the same concept of element templates and job workers to provide their connector landscape.
