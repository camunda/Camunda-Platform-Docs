---
id: troubleshooting
title: Troubleshooting
description: "This page lists common issues with Desktop Modeler and potential resolutions."
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

## How to start Desktop Modeler without plugins

You can start Desktop Modeler with the [`--disable-plugins` flag](./flags/flags.md#disable-plug-ins).

## How to obtain Desktop Modeler logs

Depending on your operating system, you can find Desktop Modeler logs in different places:

<Tabs groupId="os" defaultValue="windows" queryString values={
[
{label: 'Windows', value: 'windows' },
{label: 'macOS', value: 'macos' },
{label: 'Linux', value: 'linux' }
]
}>

<TabItem value='windows'>

```plain
%APPDATA%\camunda-modeler\logs
```

</TabItem>

<TabItem value='macos'>

```plain
~/Library/Logs/camunda-modeler
```

</TabItem>

<TabItem value='linux'>

```plain
~/.config/camunda-modeler/logs
```

</TabItem>
</Tabs>

To produce logging output, you can also run Desktop Modeler from the command line.

## I cannot connect to Zeebe

You try to connect (i.e., to deploy) to a remote Zeebe instance, and Desktop Modeler tells you it "cannot find a running Zeebe."

To resolve this issue, check if you can connect to Zeebe through another client, i.e., community-supported[`zbctl`](https://github.com/camunda-community-hub/zeebe-client-go/blob/main/cmd/zbctl/zbctl.md). If that works, [further debug your Zeebe connection](#debug-zeebe-connection-issues). If that does not work, resolve the [general connection issue](#resolve-a-general-zeebe-connection-issue) first.

## Resolve a general Zeebe connection issue

You try to connect to Zeebe from both Desktop Modeler _and_ community-supported[`zbctl`](https://github.com/camunda-community-hub/zeebe-client-go/blob/main/cmd/zbctl/zbctl.md), and neither of them works. General connection failures can have a couple of reasons:

### The (remote) Zeebe instance is not reachable

Ensure your computer has access to the (remote) network.

### The connection to Zeebe happens through a proxy

[Inspect the connection](#how-can-i-get-details-about-a-secure-remote-connection) to understand if it can be established.

Secure connections to Zeebe require [HTTP/2 over TLS with protocol negotiation via ALPN](/self-managed/operational-guides/troubleshooting/troubleshooting.md#zeebe-ingress-grpc). Ensure your proxy supports these features and does not forcefully downgrade the connection to HTTP/1.

## Debug Zeebe connection issues

You can connect to Zeebe via community-supported[`zbctl`](https://github.com/camunda-community-hub/zeebe-client-go/blob/main/cmd/zbctl/zbctl.md) or another API client. However, connecting through Desktop Modeler fails.

### Secure connection to Zeebe fails

When connecting securely to Camunda 8 SaaS, Camunda 8 Self-Managed, or a standalone Zeebe instance (via `https` endpoint URL), Desktop Modeler tries to establish a secure connection. In the process, it strictly validates the server certificates presented against well-known certificate authorities. Failure to connect may have several reasons:

#### The (remote) endpoint is not configured for secure connections

Ensure you properly configured the remote endpoint.

#### The (remote) endpoint presents an untrusted certificate

[Inspect the connection](#how-can-i-get-details-about-a-secure-remote-connection) to understand which certificates are being returned by the server.

Ensure you configure Desktop Modeler for [custom SSL certificates](#how-can-i-provide-a-custom-ssl-certificate).

If intermediate signing authorities sign the server certificate, ensure the remote endpoint [serves both server and intermediate certificates](https://nginx.org/en/docs/http/configuring_https_servers.html#chains) to Desktop Modeler.

## How can I provide a custom SSL certificate?

You configured a custom SSL certificate in your (remote) Zeebe endpoint and want Desktop Modeler to accept that certificate.

The app [strictly validates](./flags/flags.md#zeebe-ssl-certificate) the remote server certificate trust chain. If you use a custom SSL server certificate, you must make the signing CA certificate known to Desktop Modeler, not the server certificate itself.

Desktop Modeler reads trusted certificate authorities from your operating systems trust store. Installing custom CA certificates in that trust store is recommended for most users. Alternatively, you may provide custom trusted CA certificates via the [`--zeebe-ssl-certificate` flag](./flags/flags.md#zeebe-ssl-certificate).

## How can I get details about a secure remote connection?

You can use the following command to retrieve information about HTTP/2 over TLS support (ALPN) and certificates provided by a remote endpoint:

```sh
> openssl s_client -alpn h2 -connect google.com:443 -servername google.com
[...]
---
Certificate chain
 0 s:/CN=*.google.com
   i:/C=US/O=Google Trust Services LLC/CN=GTS CA 1C3
 1 s:/C=US/O=Google Trust Services LLC/CN=GTS CA 1C3
   i:/C=US/O=Google Trust Services LLC/CN=GTS Root R1
 2 s:/C=US/O=Google Trust Services LLC/CN=GTS Root R1
   i:/C=BE/O=GlobalSign nv-sa/OU=Root CA/CN=GlobalSign Root CA
---
[...]
---
New, TLSv1/SSLv3, Cipher is AEAD-CHACHA20-POLY1305-SHA256
Server public key is 256 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
ALPN protocol: h2
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : AEAD-CHACHA20-POLY1305-SHA256
    Session-ID:
    Session-ID-ctx:
    Master-Key:
    Start Time: 1687516295
    Timeout   : 7200 (sec)
    Verify return code: 0 (ok)
---
```

## How can I debug log gRPC / Zeebe communication?

You can also start Desktop Modeler with gRPC logging turned on to get detailed [logging output](#how-to-obtain-desktop-modeler-logs) on communication to Zeebe:

<Tabs groupId="os" defaultValue="windows" queryString values={
[
{label: 'Windows', value: 'windows' },
{label: 'macOS', value: 'macos' },
{label: 'Linux', value: 'linux' }
]
}>

<TabItem value='windows'>

```plain
set DEBUG=* && set ZEEBE_NODE_LOG_LEVEL=DEBUG && set GRPC_VERBOSITY=DEBUG && set GRPC_TRACE=all && "Camunda Modeler.exe"
```

</TabItem>

<TabItem value='macos'>

```plain
DEBUG=* ZEEBE_NODE_LOG_LEVEL=DEBUG GRPC_VERBOSITY=DEBUG GRPC_TRACE=all camunda-modeler
```

</TabItem>

<TabItem value='linux'>

```plain
DEBUG=* ZEEBE_NODE_LOG_LEVEL=DEBUG GRPC_VERBOSITY=DEBUG GRPC_TRACE=all camunda-modeler
```

</TabItem>
</Tabs>

## Desktop Modeler does not start on Ubuntu 24 / modern Linux

Modern Linux operating systems introduce restrictions on user namespaces, a sandboxing (isolation) mechanism Modeler uses. You may see an error message when you start the application:

```sh
$ ./camunda-modeler
[46193:1114/170934.837319:FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that [...]/camunda-modeler-[...]-linux-x64/chrome-sandbox is owned by root and has mode 4755.
zsh: trace trap (core dumped)  ./camunda-modeler
```

To remedy this, configure your system to allow sandboxing by [creating an AppArmor profile](https://github.com/camunda/camunda-modeler/issues/4695#issuecomment-2478458250), or review [this issue](https://github.com/camunda/camunda-modeler/issues/4695#issuecomment-2478581677) for an in-depth explanation of available options. If you don't have the necessary permissions to permit sandboxing, you may choose to disable the sandbox, though this is not recommended.

## Other questions?

Head over to the [Modeler category on the forum](https://forum.camunda.io/c/modeler/6) to receive help from the community.
