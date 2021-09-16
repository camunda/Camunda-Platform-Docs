---
id: index
title: "Operating Zeebe in Production"
sidebar_label: "Overview"
---

This chapter covers topics relevant for anyone who wants to operate Zeebe in production.

- [Resource planning](resource-planning.md) - Gives an introduction for calculating how many resources need to be provisioned.
- [Network ports](network-ports.md) - Discusses which ports are needed to run Zeebe
- [Setting up a Zeebe cluster](setting-up-a-cluster.md) - Quick guide on how to set up a cluster with multiple brokers.
- [Metrics](metrics.md) - Lists options to monitor Zeebe.
- [Health status](health.md) - Lists available high level health and liveness probes.
- [Backpressure](backpressure.md) - Discusses the backpressure mechanism used by Zeebe brokers.
- [Disk space](disk-space.md) - Explains how to set limits for the amount of free disk space. Once these limits are undercut, Zeebe will degrade gracefully to allow the operations team to provide more disk space.
- [Upgrade zeebe](upgrade-zeebe.md) - Contains information on how to perform a rolling upgrade.
