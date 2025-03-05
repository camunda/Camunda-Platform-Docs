---
id: box
sidebar_label: Box
title: Box Connector
description: Interact with the Box storage API.
---

The **Box Connector** is an outbound Connector that allows you to interact with the [Box](https://box.com/) storage API from your BPMN process.

## Prerequisites

To use the **Box Connector**, you must have a Box account. You can use an [enterprise account](https://www.box.com/) or create a [developer account](https://developer.box.com/).

The **Box Connector** supports different Box API authentication methods, all of which require a [Custom App](https://developer.box.com/guides/applications/app-types/custom-apps/) in your Box account.

- Camunda recommends enabling the **Generate user access tokens** feature in **Advanced Features** in your app configuration. This allows the Connector to login as an [app user](https://github.com/box/box-java-sdk/blob/v4.13.1/doc/authentication.md#obtaining-user-token). You can use the **User ID** shown on the overview page in your Box app console.
- Ensure the app is **Authorized** in the **Platform Apps Manager** section of your Box account.

:::note
A [Custom App](https://developer.box.com/guides/applications/app-types/custom-apps/) is required to interact with the Box API without any manual user interaction during credentials creation when authenticating with the Connector.
:::

## Create a Box Connector task

import ConnectorTask from '../../../components/react-components/connector-task.md'

<ConnectorTask/>

## Authentication

To authenticate the Connector with Box, select an authentication type from the **Authentication** dropdown:

- **Client Credentials Enterprise**: Authenticate using an **Enterprise ID**. You must have an enterprise account with Box.
- **Client Credentials User**: Authenticate using a **User ID**. You must have a [Custom App](https://developer.box.com/guides/applications/app-types/custom-apps/) set up in Box.
- **Devoloper Token** : Authenticate using a developer token. These tokens are usually only valid for 60 minutes, and should be used for testing purposes only.
- **JWT JSON Config**: Authenticate using a JSON configuration file created and downloaded from your Box App Configuration page.

## Operations

The **Box Connector** supports the following operations that allow you to interact with the items stored in your Box account.

:::note

The Box Connector supports two methods for locating items stored in your Box account:

- File or folder path properties allow you to either specify the **Item ID** (found in the Box URL when browsing your items) or using the item names separated by slashes (`/`) for items in folders.
- A path consisting of only a single `/` denotes the root of your Box folder. For example, `/my-folder` would point to the `my-folder` folder located in the root directory. You can use the path notation for files (`/my/image.png`) and folders (`/my/sub/folder`).

:::

:::note
Starting from version 8.7.0, the Box Connector supports uploading documents from (or downloading documents to) the Camunda document store. Review the **Document** field in the properties panel where the document reference can be provided. See additional details and limitations in [document handling](/components/concepts/document-handling.md).
:::

### Create Folder

Creates a new folder in your store.

| Property    | Type        | Required | Example                          |
| :---------- | :---------- | :------- | :------------------------------- |
| Folder name | String      | Yes      | "my-folder"                      |
| Parent path | Folder path | No       | `/`, `123`, `/my/parent/folders` |

:::note
This operation fails if a folder already exists with the same name, as Box only supports unique names.
:::

### Delete Folder

Deletes an existing folder. Optionally include all items and subfolders.

| Property    | Type    | Required | Example      |
| :---------- | :------ | :------- | :----------- |
| Folder path | String  | Yes      | "/my-folder" |
| Recursive   | Boolean | No       | `true`       |

### Delete File

Deletes a single file item.

| Property  | Type   | Required | Example        |
| :-------- | :----- | :------- | :------------- |
| File path | String | Yes      | "/my-file.png" |

### Move File

Moves a file item into a folder.

| Property           | Type   | Required | Example           |
| :----------------- | :----- | :------- | :---------------- |
| File path          | String | Yes      | "/my-file.png"    |
| Target folder path | String | Yes      | "/another/folder" |

### Download File

Downloads a file item by creating a document in the process engine, and returning a reference
to the document in the response.

| Property  | Type   | Required | Example        |
| --------- | ------ | -------- | -------------- |
| File path | String | Yes      | "/my-file.png" |

For example, you can reference the document representing the downloaded file using the example response expression:

```json
{"download": document}
```

### Upload File

Upload a file using an existing document reference.

The Box Connector resolves the document reference and creates a new file item in your Box store.

| Property           | Type                      | Required | Example          |
| ------------------ | ------------------------- | -------- | ---------------- |
| File path          | String                    | Yes      | "/my-file.png"   |
| Folder path        | String                    | Yes      | "/upload/folder" |
| Document reference | Document reference object | Yes      | `{...}`          |

The result of the upload can be accessed via the `item` property of the result.

Example value of a successful file upload:

```json
{ "item": { "id": "1734104173434", "name": "my_new_file.png", "type": "file" } }
```

### Search

Searches the items stored in the Box account.

| Property              | Type   | Required | Example       |
| --------------------- | ------ | -------- | ------------- |
| Search query          | String | Yes      | "inci"        |
| Seach sort column     | String | No       | `modified_at` |
| Search sort direction | String | No       | `DESC`        |
| Search offset         | String | No       | `0`, `10`     |
| Search limit          | String | No       | `50`          |

Example search result with a single item:

```json
{
  "items": [
    { "id": "1733978444906", "name": "incident-wrapped.png", "type": "file" }
  ]
}
```
