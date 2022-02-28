---
id: usage-metrics
title: Usage metrics
---

Operate provides usage metrics under `usage-metrics` Actuator endpoint. It is exposed on management port, 
that can be configured via `management.server.port` configuration parameter (default: 8080).

## Amount of created process instances

```
http://<host>:<port>/actuator/usage-metrics/process-instances?startTime={startTime}&endTime={endTime}
```

, where `startTime` and `endTime` are of format `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`, e.g. "1970-11-14T10:50:26.963-0100".

Sample response:
```json
{
    "total" : 99
}
```