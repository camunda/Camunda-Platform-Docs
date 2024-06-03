---
id: index
title: "Community-supported component clients"
sidebar_label: "Component clients"
description: "In addition to the core Camunda-maintained clients, examine a number of community-maintained component libraries."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

:::note
Camunda extensions found in the [Camunda Community Hub](https://github.com/camunda-community-hub) are maintained by the community and are not part of the commercial Camunda product. Camunda does not support community extensions as part of its commercial services to enterprise customers.
:::

:::tip
Looking for JavaScript or Node.js clients? They are now available through an [official Camunda SDK](/apis-tools/node-js-sdk.md)!
:::

In addition to the core Camunda-maintained clients, there are a number of community-maintained component libraries:

<Tabs groupId="clients" defaultValue="zeebe" queryString values={
[
{label: 'Zeebe', value: 'zeebe' },
{label: 'Tasklist', value: 'tasklist' },
{label: 'Operate', value: 'operate' },
{label: 'Other', value: 'other' }
]}>

<TabItem value='zeebe'>

- [Ballerina](https://github.com/camunda-community-hub/ballerina-zeebe)
- [C#](c-sharp.md)
- [Micronaut](micronaut.md)
- [Python](python.md)
- [Ruby](ruby.md)
- [Rust](rust.md)
- [Spring](spring.md)
- [Quarkus](quarkus.md)

</TabItem>

<TabItem value='tasklist'>

- [.NET](https://github.com/camunda-community-hub/dotnet-custom-tasklist)
- [Java](https://github.com/camunda-community-hub/camunda-tasklist-client-java)

</TabItem>

<TabItem value='operate'>

- [Java](https://github.com/camunda-community-hub/camunda-operate-client-java)
- [Node.js](https://github.com/camunda-community-hub/operate-client-node-js)

</TabItem>

<TabItem value='other'>

- [Optimize - Node.js](https://github.com/camunda-community-hub/optimize-client-node-js)
- [Web Modeler - Java](https://github.com/camunda-community-hub/web-modeler-java-client)

</TabItem>

</Tabs>
