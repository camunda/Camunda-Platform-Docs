---
id: flags
title: Flags
description: "Flags allow you to control the availability of certain features within Desktop Modeler."
---

Flags allow you to control the availability of certain features within Desktop Modeler.

## Configuring Flags

You may configure flags in a `flags.json` file or pass them via CLI.

### Configure in `flags.json`

Place a `flags.json` file inside the `resources` folder of your local [`{USER_DATA}`](../search-paths#user-data-directory) or [`{APP_DATA_DIRECTORY}`](../search-paths#app-data-directory) directory to persist them.

### Configure via CLI

Pass flags via the command line when starting the application.

```
camunda-modeler --disable-plugins
```

Flags passed as command line arguments take precedence over those configured via a configuration file.

## Available Flags

| flag                         | default value                       |
| ---------------------------- | ----------------------------------- |
| "disable-plugins"            | false                               |
| "disable-adjust-origin"      | false                               |
| "disable-cmmn"               | true                                |
| "disable-dmn"                | false                               |
| "disable-form"               | false                               |
| "disable-platform"           | false                               |
| "disable-zeebe"              | false                               |
| "disable-remote-interaction" | false                               |
| "single-instance"            | false                               |
| "user-data-dir"              | [Electron default](../search-paths) |
| "display-version"            | `undefined`                         |
| "zeebe-ssl-certificate"      | `undefined`                         |

## Examples

### BPMN-only Mode

To disable the CMMN and DMN editing capabilities of the App, configure your `flags.json` like this:

```js
{
    "disable-dmn": true,
    "disable-form": true
}
```

As a result, the app will only allow users to model BPMN diagrams.

![BPMN only mode](./img/bpmn-only.png)

### Custom `display-version` label

To display a custom version information in the status bar of the app, configure your `flags.json` like this:

```js
{
    "display-version": "1.2.3"
}
```

![Custom version info](./img/display-version.png)

### Zeebe SSL certificate

To use a self-signed certificate to connect to Camunda Platform 8 Self-Managed, configure your `flags.json` like this:

```js
{
    "zeebe-ssl-certificate": "/Users/local/certificate.pem"
}
```

As a result, the app will use the certificate to securely connect to the gateway.
