---
id: dependencies
title: "Source code and third-party dependencies"
description: "Dependencies and third-party libraries for all Camunda 8 components."
keywords: ["dependencies", "third-party", "third-party libraries"]
---

Camunda provides its users and customers with access to its source code as part of [this written offer](https://legal.camunda.com/licensing-and-other-legal-terms#written-offer-source-code), as well as CycloneDX SBOMs, which list all direct and transitive third-party dependencies and their respective licenses. Please click the tabs below to access these items for each Camunda component.

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs groupId="dependencies" defaultValue="camunda-platform" queryString values={
[
{label: 'Camunda 8', value: 'camunda-platform', },
{label: 'Desktop Modeler', value: 'modeler', },
{label: 'Web Modeler', value: 'web-modeler', },
{label: 'Connectors', value: 'connectors', },
{label: 'Console Self-Managed', value: 'console-sm', },
]
}>

<TabItem value='camunda-platform'>

### Camunda 8

- **Dependencies:** CycloneDX SBOM files, that list all direct and transitive third-party dependencies and their respective licenses, are provided [on demand](mailto:dependency-request@camunda.com).
- **Source code:** Access the source code for Camunda 8 at [github.com/camunda/camunda](https://github.com/camunda/camunda).

</TabItem>

<TabItem value='modeler'>

- **Dependencies:** You can find an up-to-date list of direct and transitive libraries used and their license terms in the [THIRD_PARTY_NOTICES](https://github.com/camunda/camunda-modeler/blob/master/THIRD_PARTY_NOTICES), located in the root of the source code repository. This file is also shipped with the application distribution as `THIRD_PARTY_NOTICES.camunda-modeler.txt`.
- **Source code:** Access the source code for Desktop Modeler at [github.com/camunda/camunda-modeler](https://github.com/camunda/camunda-modeler).

</TabItem>

<TabItem value='web-modeler'>

- **Dependencies:** CycloneDX SBOM files, that list all direct and transitive third-party dependencies and their respective licenses, are provided [on demand](mailto:dependency-request@camunda.com).
- **Source code:** Access to source code is provided [on demand](mailto:dependency-request@camunda.com).

</TabItem>

<TabItem value='connectors'>

- **Dependencies:** Find CycloneDX SBOM files, that list all direct and transitive third-party dependencies and their respective licenses, in the [release assets](https://github.com/camunda/connectors/releases) of each Connectors release.
- **Source code:** Access the source code for Connectors at [github.com/camunda/connectors](https://github.com/camunda/connectors).

</TabItem>

<TabItem value='console-sm'>

### Console Self-Managed

- **Dependencies:** CycloneDX SBOM files, that list all direct and transitive third-party dependencies and their respective licenses, are provided [on demand](mailto:dependency-request@camunda.com).
- **Source code:** Access to source code is provided [on demand](mailto:dependency-request@camunda.com).

</TabItem>

</Tabs>
