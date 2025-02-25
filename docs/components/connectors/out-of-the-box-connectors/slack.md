---
id: slack
title: Slack Connector
sidebar_label: Slack
description: Send messages to channels or users in your Slack workspace from your BPMN process.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs groupId="slack" defaultValue="outbound" queryString values={
[
{label: 'Outbound', value: 'outbound' },
{label: 'Inbound', value: 'inbound' }
]}>

<TabItem value='outbound'>

The **Slack Connector** is an outbound Connector that allows you to send messages to channels or users in your [Slack](https://slack.com) workspace from your BPMN process.

## Prerequisites

To use the Slack Connector, a Slack app must be registered with the Slack workspace you would like to send messages to. A respective OAuth token needs to be configured as a secret in your cluster. Follow [these steps in the appendix](#appendix) to learn how to set this up.

## Create a Slack Connector task

import ConnectorTask from '../../../components/react-components/connector-task.md'

<ConnectorTask/>

## Make your Slack Connector executable

To make the **Slack Connector** executable, fill out the mandatory fields highlighted in red in the properties panel on the right side of the screen.

### Authentication

Set **Authentication** to your Slack OAuth token, which is stored as a secret. For example, `{{secrets.SLACK_OAUTH_TOKEN}}`.

### Create channel

:::info
This API uses the Slack [`conversations.create`](https://api.slack.com/methods/conversations.create) method.
You need to ensure that your Slack application has related permissions enabled.
:::

To create a channel, take the following steps:

1. Set **Method** to `Create Channel`.
2. Set the **New Channel Name**:
   - The channel name can be up to 80 characters, and can contain lowercase letters, digits, and symbols `-` and `_`.
   - This can be provided as a FEEL expression.
3. Set channel **Visibility** as required:
   - **Public** channels are visible to every workspace member.
   - **Private** channels are visible to explicitly invited people only.

### Invite user to channel

:::info
This API uses the Slack [`conversations.invite`](https://api.slack.com/methods/conversations.invite) method.
You need to ensure that your Slack application has related permissions enabled.
:::

To invite users to a channel, take the following steps:

1. Set **Method** to `Invite to Channel`.
2. Set the `Invite by` method:
   - Invite by **Channel Name**:
     - The channel name can be up to 80 characters, and can contain lowercase letters, digits, and symbols `-` and `_`.
     - This can be provided as a FEEL expression.
   - Invite by **Channel ID**:
     - The channel ID must be a valid Slack Channel ID.
     - This can be provided as a FEEL expression.
3. Set the **Users** as required:
   1. One single username or email or ID (for example: `@myUser` or `my.user@company.com` or `ABCDEF12345`).
   2. A comma separated list of users (for example: `@myUser, my.user@company.com, ABCDEF12345`).
   3. FEEL expression. In this case you can provide a valid list of strings (for example: `["@myUser", "my.user@company.com", "ABCDEF12345"]`).
   - Formats:
     - If a username starts with an `@` symbol, it will be handled as user name.
     - If a username is in an email format, it will be handled as an email.
     - If a username doesn't start with an `@`, and isn't an email, it will be handled as a user ID.
   - If a null input or an input which is not a type of String or a Collection provided, you will get an Exception.
   - If all username is provided as any other type than a String, you will get an Exception.
   - If one of the usernames is provided as any other type than a String, it will be omitted.
   - If you provide a channel name it will be omitted since it is not possible to invite a channel to another channel.

### Post message

:::info
This API uses the Slack [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage) method.
You need to ensure that your Slack application has related permissions enabled.
:::

To post a message, take the following steps:

1. Set **Method** to `Post Message`.
2. Set **Channel/User Name** to either the **channel** or **user** you want to send the message to.
   1. A **channel** is specified by a unique identifier starting with a `#` (for example, `#myChannel`).
   2. A **user** is specified by a username starting with an `@` symbol (for example, `@myUser`).
3. (Optional) A **thread** can be specified to start a thread from a specific message. For example, `ts` in the response can be used (see [here](#post-message)). If the message has been posted by a user, we currently have no way to retrieve the `ts` value. Visit the [Slack documentation](https://api.slack.com/methods/chat.postMessage) for additional details.
4. Select a **Message type**.
   1. When **Plain text** is selected, set **Message** to the message string you would like to send (for example, `Hello World!`).
   2. When **Message block** is selected, set **Message block** to a formatted rich text block format. Learn more about rich text message block format in the [official Slack documentation](https://api.slack.com/reference/surfaces/formatting#stack_of_blocks).
5. (Optional) **Attachments** are array of variables to which **camunda documents** are assigned.

:::note
To work with documents you must upload them first, [using the REST API](/apis-tools/camunda-api-rest/specifications/create-document.api.mdx) for example.
The result of the endpoint must then be assigned to a variables in **Start Process Instance** so you can use the variables in the **Attachments** field.
:::

The **Channel/User Name** and **Message** can either be given [static values](/components/concepts/expressions.md#expressions-vs-static-values), or FEEL expressions. FEEL expressions can be used to [access process variables or dynamically create values](/components/concepts/expressions.md). This can be handy if a process variable is used to store the relevant channel or if the message needs to be composed dynamically, for example:

`Channel/User Name` property might look like:

```
#slack-connectors
```

`Message` property:

```
= "Order-" + orderId + " was dispatched"
```

In the above example, the Channel/User Name is set to the [static value](/components/concepts/expressions.md#expressions-vs-static-values) "#slack-connectors," which will post the message to the specified Slack channel. The **Message** property uses a FEEL expression to dynamically create the message content. It concatenates the string "Order-" with the value stored in the process variable orderId and adds "was dispatched" to complete the message. This way, the message will vary based on the specific orderId stored during the process execution.

:::note
Slack's [guidance on formatting](https://api.slack.com/reference/surfaces/formatting#basics) can assist in formatting messages.
:::

## Slack API response

The **Slack Connector** exposes the Slack API response as a [local variable](/components/concepts/variables.md#variable-scopes) called `response`.
Response contents are method-specific.

### Create channel

The following fields are available in the `response` variable after executing **Create Channel** method:

- **channel**:
  - **id**: channel ID
  - **name**: channel name

Notice that the **name** field can be subsequently used as an argument of **Post Message** method.

### Post message

The following fields are available in the `response` variable after executing the **Post Message** method.
Notice that all fields describe state in the Slack workspace:

- **ts**: timestamp ID
- **channel**: channel ID
- **message**:
  - **type**: message type
  - **team**: team ID
  - **user**: user ID
  - **text**: message text
  - **ts**: timestamp ID
  - **appID**: Slack App ID
  - **botID**: Slack Bot ID

### Output mapping

You can use an Output Mapping to map the response:

1. Use **Result Variable** to store the response in a process variable. For example, `myResultVariable`.
2. Use **Result Expression** to map fields from the response into process variables. For example:

```
= {
    messageText: response.message.text
}
```

## Appendix

To use the **Slack Connector**, the following prerequisites need to be set up.

1. [Slack workspace](#use-a-well-known-slack-workspace) - The workspace the **Slack Connector** will communicate with.
2. [Slack basic app with bot token configured](#configure-a-basic-slack-app) - The **Slack Connector** will communicate through this Slack app with the workspace. You can consider the Slack app as _Slack bot representing the Camunda platform_.
3. [Slack bot token stored as secret](#store-slack-bot-token-as-secret) - The secret will store the Slack bot token and can be used to reference it from BPMN processes without revealing it in the BPMN `xml`.

### Use a well-known Slack workspace

A Slack workspace consists of channels in which workspace members can communicate and collaborate. A workspace is identified by a unique name, for example `https://myWorkspace.slack.com/`. In most cases you will know which workspace you want to connect with already. If you want to set up a new workspace, refer to the [official Slack documentation](https://slack.com/help/articles/115001344007-Create-a-workspace-on-Enterprise-Grid).

### Configure a basic Slack app

:::caution
You can only install a Slack app to a workspace in which you are a member or that you own. It is not possible if you have guest-only permissions. See the [guide to apps in Slack](https://slack.com/help/articles/360001537467-Guide-to-apps-in-Slack) for more details.
:::

The **Slack Connector** communicates through a Slack app with a concrete Slack workspace. For example, when sending a Slack message, the message will be posted by the Slack app. For the **Slack Connector** to work, you need to perform the following steps:

1. [Create a Slack app](https://api.slack.com/apps).
2. [Request required scopes](https://api.slack.com/scopes) - The scopes represent what your app can and cannot do (for example, posting messages).
   1. For the **Create Channel** method to work, you need to grant at least the [`channels:manage`](https://api.slack.com/scopes/channels:manage) scope.
   2. For the **Post Message** method to work, you need to grant at least the [`chat:write`](https://api.slack.com/scopes/chat:write) scope.
3. [Install the Slack app to your workspace](https://api.slack.com/authentication/basics#installing).
4. [Invite the Slack app to your workspace via /invite](https://slack.com/help/articles/201259356-Slash-commands-in-Slack#h_01EPZ2Z81EJ67RA2BGDKZ9M1AN).

Once the app is set up, copy the [bot token](https://api.slack.com/authentication/token-types) of the app. It is represented as a string and begins with `xoxb-`. This is the OAuth Bearer token, which the **Slack Connector** will use to authenticate with the Slack API.

### Store Slack bot token as secret

The **Slack Connector** uses an OAuth bearer token (for example, the Slack app bot token) to authenticate with the Slack API.

We advise you to keep your Slack bot token safe and avoid exposing it in the BPMN `xml` file by creating a secret:

1. Follow our [guide for creating secrets](/components/console/manage-clusters/manage-secrets.md).
2. Name your secret `SLACK_OAUTH_TOKEN` so you can reference it later in the Connector.

</TabItem>

<TabItem value='inbound'>

The **Slack inbound Connector** is a Connector that allows you to start or continue
a BPMN process triggered by a [Slack](https://slack.com/) message.

## Create a Slack inbound Connector task

1. Start building your BPMN diagram. You can use the **Slack inbound Connector** with either a **Start Event** or **Intermediate Catch Event**.
2. Select the applicable element and change its template to a **Slack Inbound Connector**.
3. Fill in all required properties.
4. Complete your BPMN diagram.
5. Deploy the diagram to activate the webhook.
6. Navigate to the **Webhooks** tab in the properties panel to see the webhook URL.

## Make your Slack inbound Connector for receiving event notifications executable

1. In the **Webhook Configuration** section, configure the **Webhook ID**. By default, **Webhook ID** is pre-filled with a random value. This value will be a part of the Slack event subscription or slash command URL.
2. In the **Webhook Configuration** section, configure the **Slack signing secret**. This value is unique to your Slack application and used to validate a Slack payload integrity. Read more about signing secrets in the [Slack documentation](https://api.slack.com/authentication/verifying-requests-from-slack).
3. In the **Activation** section, configure **Condition** when the Slack event or command can trigger a new BPMN process. The following example will trigger a new BPMN process for every `app_mention` Slack event type: `=(request.body.event.type = "app_mention")`.
4. In the **Variable mapping** section, fill the field **Result variable** to store the response in a process variable. For example, `myResultVariable`.
5. In the **Variable expression** section, fill the field to map specific fields from the response into process variables using [FEEL](/components/modeler/feel/what-is-feel.md).
   The following example will extract both Slack message sender ID and text from Slack `app_mention` event: `={senderId: request.body.event.user, text: request.body.event.text}`.

### Correlation

The **Correlation** section allows you to configure the message correlation parameters.

:::note
The **Correlation** section is not applicable for the plain **start event** element template of the Slack Connector. Plain **start events** are triggered by process instance creation and do not rely on message correlation.
:::

#### Correlation keys

- **Correlation key (process)** is a FEEL expression that defines the correlation key for the subscription. This corresponds to the **Correlation key** property of a regular **message intermediate catch event**.
- **Correlation key (payload)** is a FEEL expression used to extract the correlation key from the incoming message. This expression is evaluated in the Connector Runtime and the result is used to correlate the message.

For example, given your correlation key is defined with `myCorrelationKey` process variable, and the request body contains `"event": {"text": "12345"}`, your correlation key settings will look like this:

- **Correlation key (process)**: `=myCorrelationKey`
- **Correlation key (payload)**: `=request.body.event.text`

Learn more about correlation keys in the [messages guide](../../../concepts/messages).

#### Message ID expression

The **Message ID expression** is an optional field that allows you to extract the message ID from the incoming request. The message ID serves as a unique identifier for the message and is used for message correlation.
This expression is evaluated in the Connector Runtime and the result is used to correlate the message.

In most cases, it is not necessary to configure the **Message ID expression**. However, it is useful if you want to ensure message deduplication or achieve a certain message correlation behavior.
Learn more about how message IDs influence message correlation in the [messages guide](../../../concepts/messages#message-correlation-overview).

For example, to set the message ID to the value of the `text` field of the incoming message, configure the **Message ID expression** as follows:

```
= request.body.event.text
```

#### Message TTL

The **Message TTL** is an optional field that allows you to set the time-to-live (TTL) for the correlated messages. TTL defines the time for which the message is buffered in Zeebe before being correlated to the process instance (if it can't be correlated immediately).
The value is specified as an ISO 8601 duration. For example, `PT1H` sets the TTL to one hour. Learn more about the TTL concept in Zeebe in the [message correlation guide](../../../concepts/messages#message-buffering).

## Make your Slack inbound Connector for receiving slash command notifications executable

1. In the **Webhook Configuration** section, configure the **Webhook ID**. By default, **Webhook ID** is pre-filled with a random value. This value will be a part of the Slack event subscription or slash command URL.
2. In the **Webhook Configuration** section, configure the **Slack signing secret**. This value is unique to your Slack application and used to validate a Slack payload integrity. Read more about signing secrets in the [Slack documentation](https://api.slack.com/authentication/verifying-requests-from-slack).
3. In the **Activation** section, configure **Condition** when the Slack event or command can trigger a new BPMN process. The following example will trigger a new BPMN process for every `/test` Slack command type: `=(connectorData.command = "/test")`.
4. In the **Variable mapping** section, fill the field **Result variable** to store the response in a process variable. For example, `myResultVariable`.
5. In the **Variable expression** section, fill the field to map specific fields from the response into process variables using [FEEL](/components/modeler/feel/what-is-feel.md).
   The following example will extract both Slack message sender ID and text from Slack `/test hello` command: `={senderId: connectorData.user_id, text: connectorData.text}`.

When using the **Slack inbound Connector** with an **Intermediate Catch Event**, fill in the **Correlation key (process)** and **Correlation key (payload)**.

- **Correlation key (process)** is a FEEL expression that defines the correlation key for the subscription. This corresponds to the **Correlation key** property of a regular **Message Intermediate Catch Event**.
- **Correlation key (payload)** is a FEEL expression used to extract the correlation key from the incoming message. This expression is evaluated in the Connector Runtime and the result is used to correlate the message.

For example, given that your correlation key is defined with `myCorrelationKey` process variable, and the request body contains `text=hello}`, your correlation key settings will look like this:

- **Correlation key (process)**: `=myCorrelationKey`
- **Correlation key (payload)**: `=connectorData.text`

Learn more about correlation keys in the [messages guide](../../../concepts/messages).

## Activate the Slack inbound Connector by deploying your diagram

Once you click the **Deploy** button, your **Slack inbound Connector** will be activated and publicly available.

URLs of the exposed **Slack inbound Connector** adhere to the following pattern:

`https://<base URL>/inbound/<webhook ID>`

- `<base URL>` is the URL of Connectors component deployment. When using the Camunda 8 SaaS offering, this will typically contain your **region Id** and **cluster Id**, found in your client credentials under the **API** tab within your cluster.
- `<webhook ID>` is the ID (path) you configured in the properties of your **Slack inbound Connector**.

If you make changes to your **Slack Inbound Connector** configuration, you need to redeploy the BPMN diagram for the changes to take effect.

When you click on the event with **Slack inbound Connector** applied to it, a new **Webhooks** tab will appear in the properties panel. This tab displays the URL of the **Slack inbound Connector** for every cluster where you have deployed your BPMN diagram.

:::note
The **Webhooks** tab is only supported in Web Modeler as part of the Camunda 8 SaaS offering.
You can still use Slack inbound Connectors in Desktop Modeler, or with your Camunda 8 Self-Managed.
In that case, Slack inbound Connector deployments and URLs will not be displayed in Modeler.
:::

## Wiring with Slack

### Events API

This is a simplified guide. For full guide, refer to the [official Slack documentation](https://api.slack.com/apis/connections/events-api).

1. Make sure you have sufficient permissions to modify your Slack application.
2. Open [Slack API portal](https://api.slack.com) and select your Slack application.
3. Navigate to the **Event Subscription** page.
4. Click **Enable Events**.
5. In the **Request URL** field, put the webhook URL. You can find it at the **Webhook** tab in the properties panel of you BPMN diagram.
6. Make sure that the **Request URL** indicates that endpoint is **Verified**. This process may take several seconds.
7. Click **Subscribe to bot events**.
8. Select all events you wish to receive. **Note:** some messages may produce several events. For example, a message `@YourBot test` will generate both `app-mention` and `message` events.
9. Click **Save** to apply new changes.
10. Install or re-install your app into your workspace.

### Slash commands

This is a simplified guide. For a full guide, refer to the [official Slack documentation](https://api.slack.com/interactivity/slash-commands).

1. Make sure you have sufficient permissions to modify your Slack application.
2. Open [Slack API portal](https://api.slack.com) and select your Slack application.
3. Navigate to **Slash Commands**.
4. Click **Create New Command**.
5. Fill the fields **Command**, **Short Description**, and **Usage Hint** as you prefer.
6. In the **Request URL** field, put the webhook URL. You can find it at the **Webhook** tab in the properties panel of your BPMN diagram.
7. Click **Save** to apply new changes.

## Security considerations

### Integrity

Each Slack message is signed with HMAC using a Slack signing key. The **Slack inbound Connector** verifies HMAC integrity
for every incoming request. Read more about signing secrets in the
[Slack documentation](https://api.slack.com/authentication/verifying-requests-from-slack).

## Appendix

### Slack `app_mention` event example

```
POST https://<base URL>/inbound/<webhook ID>

connection: close
content-type: application/json
content-length: 429
x-slack-request-timestamp: 1687791117
x-slack-signature: v0=aaaaaaaabbbbbbbbcccccccddddddeeeeeeffffffff
accept: application/json,*/*
accept-encoding: gzip,deflate
user-agent: Slackbot 1.0 (+https://api.slack.com/robots)
host: <base URL>

{
   "token": "XXXXXXXX",
   "team_id": "XXXXXXXX",
   "api_app_id": "XXXXXXXX",
   "event": {
      "client_msg_id": "ffb7ded2-6f55-468d-926f-cad3195c8056",
      "type": "app_mention",
      "text": "<@XXXXXXXX> say hello",
      "user": "XXXXXXXX",
      "ts": "11111111.2222222",
      "blocks": [
         {
            "type": "rich_text",
            "block_id": "rarsi",
            "elements": [
               {
                  "type": "rich_text_section",
                  "elements": [
                     {
                        "type": "user",
                        "user_id": "XXXXXXXX"
                     },
                     {
                        "type": "text",
                        "text": " say hello"
                     }
                  ]
               }
            ]
         }
      ],
      "team": "XXXXXXXX",
      "thread_ts": "1687864866.335329",
      "parent_user_id": "XXXXXXXX",
      "channel": "XXXXXXXX",
      "event_ts": "1687866358.496959"
   },
   "type": "event_callback",
   "event_id": "XXXXXXXX",
   "event_time": 1687866358,
   "authorizations": [
      {
         "enterprise_id": null,
         "team_id": "XXXXXXXX",
         "user_id": "XXXXXXXX",
         "is_bot": true,
         "is_enterprise_install": false
      }
   ],
   "is_ext_shared_channel": false,
   "event_context": "XXXXXXXX"
}
```

### Slack slash command example

Given the following command is executed: `/test123 test`.

```
POST https://<base URL>/inbound/<webhook ID>

connection: close
content-type: application/x-www-form-urlencoded
content-length: 429
x-slack-request-timestamp: 1687792480
x-slack-signature: v0=aaaaaaaabbbbbbbbcccccccddddddeeeeeeffffffff
accept: application/json,*/*
accept-encoding: gzip,deflate
user-agent: Slackbot 1.0 (+https://api.slack.com/robots)
host: <base URL>

token=qQqQqQqQqQqQqQqQqQ
&team_id=T05ABCDEFG
&team_domain=yourdomain
&channel_id=C05QQQQQQ
&channel_name=channel1
&user_id=U05AAAAAAA
&user_name=your.user
&command=%2Ftest123
&text=test
&api_app_id=A05DDDDDDD
&is_enterprise_install=false
&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FXXXXXXXXX%2FYYYYYYYYYYY%2FZZZZZZZZ
&trigger_id=111111111.222222222.33333333
```

</TabItem>

</Tabs>
