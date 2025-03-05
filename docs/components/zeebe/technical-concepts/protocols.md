---
id: protocols
title: "Protocols"
description: "Let's discuss gRPC and supported clients."
---

Zeebe clients connect to brokers via a stateless gateway.

For the communication between client and gateway, a mix of REST and [gRPC](https://grpc.io/) is used. The gRPC protocol is defined using Protocol Buffers v3 ([proto3](https://developers.google.com/protocol-buffers/docs/proto3)), and you can find it in the
[Zeebe repository](https://github.com/camunda/camunda/tree/main/zeebe/gateway-protocol). There, you will also find the OpenAPI v3 spec for the REST portion of the gateway API.

Note that while gRPC requires HTTP/2, the REST API can work with either HTTP/1.1 or HTTP/2.

## What is gRPC?

gRPC was first developed by Google and is now an open source project and part of the Cloud Native Computing Foundation.

If you’re new to gRPC, see [What is gRPC](https://grpc.io/docs/guides/index.html) on the project website for an introduction.

## Why gRPC?

gRPC has many beneficial features that make it a good fit for Zeebe, including:

- Supports bi-directional streaming for opening a persistent connection and sending or receiving a stream of messages between client and server
- Uses the common HTTP/2 protocol by default
- Uses Protocol Buffers as an interface definition and data serialization mechanism–specifically, Zeebe uses proto3, which supports client generation in ten different programming languages.

## Supported clients

Currently, Zeebe officially supports a gRPC client in [Java](/apis-tools/java-client/index.md).

<!-- Remove note? -->

:::note
As of 8.5.0, the Go client does not support the REST API of the gateway.
:::

[Community clients](/apis-tools/community-clients/index.md) have been created in other languages, including C#, Ruby, and JavaScript.

If there is no client in your target language yet, you can [build your own client](/apis-tools/build-your-own-client.md) in a range of different programming languages.

## Intercepting calls

Zeebe supports loading arbitrary [gRPC server interceptors](self-managed/zeebe-deployment/zeebe-gateway/interceptors.md)
and [Jakarta servlet filters](self-managed/zeebe-deployment/zeebe-gateway/filters.md) to intercept incoming calls.
