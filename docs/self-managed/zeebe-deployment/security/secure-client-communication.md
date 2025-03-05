---
id: secure-client-communication
title: "Secure client communication"
description: "Zeebe supports TLS between the gateway and all the officially supported clients. In this section, we will review how to configure these components."
---

Zeebe supports transport layer security (TLS v1.3) between the gateway and all the officially supported clients. In this section, we will review how to configure these components.

## Gateway

TLS in the gateway is disabled by default. This means that if you are just experimenting with Zeebe or in development, there is no configuration needed. However, if you want to enable authentication, we strongly recommend you enable TLS between the client and the gateway. To do so, you will need to configure both the REST and gRPC parts of the gateway separately.

:::note
You can use different certificates, or even reuse the same configuration for both protocols, as each are configured independently from the other.
:::

### gRPC

You can configure TLS for the gRPC gateway in the `security` section of the configuration files. The following configurations are present in both `gateway.yaml.template` and `broker.standalone.yaml.template`, the file you should edit depends on whether you are using a standalone gateway or an embedded gateway.

```yaml
---
security:
  # Enables TLS authentication between clients and the gateway
  enabled: false

  # Sets the path to the certificate chain file
  certificateChainPath:

  # Sets the path to the private key file location
  privateKeyPath:
```

`enabled` should be either `true` or `false`, where true will enable TLS authentication between client and gateway, and false will disable it. `certificateChainPath` and `privateKeyPath` are used to configure the certificate with which the server will authenticate itself. `certificateChainPath` should be a file path pointing to a certificate chain in PEM format representing the server's certificate, and `privateKeyPath` is a file path pointing to the certificate's PKCS8 private key, also in PEM format.

Additionally, as you can see in the configuration file, each value can also be configured through an environment variable. The environment variable to use again depends on whether you are using a standalone gateway or an embedded gateway.

### REST

The REST server is simply a Spring Boot server, and as such, [any of the common server properties can be applied to it](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties.server). Note that, as of 8.5.0, it is a _reactive_ server, meaning **none of the servlet properties will have any effect**.

To enable TLS for the REST server, you will need to configure the properties under the `server.ssl` tree. To enable TLS, you will need to at least specify a certificate and private key. This can be done using a PEM certificate chain file with its private key, as seen in the gRPC section, or via a key store. For example, with a PEM file:

```yaml
server:
  ssl:
    enabled: true
    certificate: /path/to/my/certificate.pem
    certificate-private-key: /path/to/my/private.key
```

[This Spring blog post](https://spring.io/blog/2023/06/07/securing-spring-boot-applications-with-ssl) provides a great tutorial on how to use other options to configure the server security.

## Clients

Unlike the gateway, TLS is enabled by default in all of Zeebe's supported clients. The following sections show how to disable or properly configure each client.

:::note
Disabling TLS should only be done for testing or development. During production deployments, clients and gateways should be properly configured to establish secure connections.
:::

### Java

Without any configuration, the client looks in the system's certificate store for a CA certificate with which to validate the gateway's certificate chain. If you wish to use TLS without having to install a certificate in client's system, you can specify a CA certificate:

```java
public class SecureClient {
    public static void main(final String[] args) {
        final ZeebeClient client = ZeebeClient.newClientBuilder().caCertificatePath("path/to/certificate").build();

        // ...
    }
}
```

Alternatively, use the `ZEEBE_CA_CERTIFICATE_PATH` environment variable to override the code configuration.

To disable TLS in a Java client, use the `.usePlaintext()` option:

```java
public class InsecureClient {
    public static void main(final String[] args) {
        final ZeebeClient client = ZeebeClient.newClientBuilder().usePlaintext().build();

        // ...
    }
}
```

Alternatively, use the `ZEEBE_INSECURE_CONNECTION` environment variable to override the code configuration. To enable an insecure connection, set it to **true**. To use a secure connection, set it to any non-empty value other than **true**. Setting the environment variable to an empty string is equivalent to unsetting it.

## Self signed certificates

It may be useful, for testing or development purposes, to use TLS between the client and the gateway; to simplify things, we can use self-signed certificates for this.

### Testing & example

To generate your own self-signed certificates for testing/development, you will need `openssl` install on your local machine. Then you can run:

```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 --nodes -addext 'subjectAltName=IP:127.0.0.1'
```

This will generate a new certificate, `cert.pem`, and a new passwordless key, `key.pem`.

:::danger
Do not use these in production! Again, this is for development and testing purposes only.
:::

Then start up your gateway with the certificate and key specified above. For example, if we run a broker with an embedded gateway directly using Docker:

```sh
docker run -p 26500:26500 -e ZEEBE_BROKER_NETWORK_HOST=0.0.0.0 -e ZEEBE_BROKER_GATEWAY_SECURITY_ENABLED=true -e ZEEBE_BROKER_GATEWAY_SECURITY_CERTIFICATECHAINPATH=/usr/local/zeebe/cert.pem -e ZEEBE_BROKER_GATEWAY_SECURITY_PRIVATEKEYPATH=/usr/local/zeebe/key.pem --mount type=bind,source="$(pwd)"/cert.pem,target=/usr/local/zeebe/cert.pem --mount type=bind,source="$(pwd)"/key.pem,target=/usr/local/zeebe/key.pem camunda/zeebe
```

There is one caveat: in order for the client to accept this self-signed certificate, you will need to trust it. The simplest way is to specify it as part of the client's configuration. Refer to the documentation above on how to configure your clients.

## Troubleshooting authentication issues

Here we will describe a few ways the clients and gateway could be misconfigured and what those errors look like. Hopefully, this will help you recognize these situations and provide an easy fix.

:::note
`zbctl` is a [community-supported client](https://github.com/camunda-community-hub/zeebe-client-go/blob/main/cmd/zbctl/zbctl.md).
:::

### TLS is enabled in `zbctl` but disabled in the gateway

The client will fail with the following error:

```
Error: rpc error: code = Unavailable desc = all SubConns are in TransientFailure, latest connection error: connection error: desc = "transport: authentication handshake failed: tls: first record does not look like a TLS handshake"
```

The following error will be logged by Netty in the gateway:

```
Aug 06, 2019 4:23:22 PM io.grpc.netty.NettyServerTransport notifyTerminated
INFO: Transport failed
io.netty.handler.codec.http2.Http2Exception: HTTP/2 client preface string missing or corrupt. Hex dump for received bytes: 1603010096010000920303d06091559c43ec48a18b50c028
  at io.netty.handler.codec.http2.Http2Exception.connectionError(Http2Exception.java:103)
  at io.netty.handler.codec.http2.Http2ConnectionHandler$PrefaceDecoder.readClientPrefaceString(Http2ConnectionHandler.java:306)
  at io.netty.handler.codec.http2.Http2ConnectionHandler$PrefaceDecoder.decode(Http2ConnectionHandler.java:239)
  at io.netty.handler.codec.http2.Http2ConnectionHandler.decode(Http2ConnectionHandler.java:438)
  at io.netty.handler.codec.ByteToMessageDecoder.decodeRemovalReentryProtection(ByteToMessageDecoder.java:505)
  at io.netty.handler.codec.ByteToMessageDecoder.callDecode(ByteToMessageDecoder.java:444)
  at io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:283)
  at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:374)
  at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:360)
  at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:352)
  at io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1421)
  at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:374)
  at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:360)
  at io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:930)
  at io.netty.channel.epoll.AbstractEpollStreamChannel$EpollStreamUnsafe.epollInReady(AbstractEpollStreamChannel.java:794)
  at io.netty.channel.epoll.EpollEventLoop.processReady(EpollEventLoop.java:424)
  at io.netty.channel.epoll.EpollEventLoop.run(EpollEventLoop.java:326)
  at io.netty.util.concurrent.SingleThreadEventExecutor$5.run(SingleThreadEventExecutor.java:918)
  at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
  at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
  at java.lang.Thread.run(Thread.java:748)
```

**Solution:** Either enable TLS in the gateway as well or specify the `--insecure` flag when using `zbctl`.

### TLS is disabled in `zbctl` but enabled for the gateway

`zbctl` will fail with the following error:

```
Error: rpc error: code = Unavailable desc = all SubConns are in TransientFailure, latest connection error: connection closed
```

**Solution:** Either enable TLS in the client by specifying a path to a certificate or disable it in the gateway by editing the appropriate configuration file.

### TLS is enabled for both client and gateway but the CA certificate can't be found

`zbctl` will fail with the following error:

```
Error: rpc error: code = Unavailable desc = all SubConns are in TransientFailure, latest connection error: connection error: desc = "transport: authentication handshake failed: x509: certificate signed by unknown authority
```

**Solution:** Either install the CA certificate in the appropriate location for the system or specify a path to certificate using the methods described above.
