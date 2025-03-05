---
id: zeebe-overview
title: "Zeebe"
sidebar_label: "Introduction"
description: "Zeebe is the process automation engine powering Camunda 8. While written in Java, you do not need to be a Java developer to use Zeebe."
---

import OverviewImg from '../zeebe/technical-concepts/assets/zeebe-architecture.png';
import ZeebeGrid from '../zeebe/react-components/\_zeebe-card';

import { gettingStartedCards } from '../zeebe/react-components/\_zeebe-card-data';

<p><a title="Zeebe architecture" href="../technical-concepts/architecture"><img src={OverviewImg} alt="Zeebe architecture" style={{border:0,padding:0,paddingLeft:20,margin:0,float: 'right', width: '60%'}} className="fade-in-top-image"/></a>Zeebe is the process automation engine powering Camunda 8. While written in Java, you do not need to be a Java developer to use Zeebe.</p>

A workflow engine is an essential part of any process automation tool. We call it an “engine” because it drives business processes from start to finish, no matter how complex the process and decision logic need to be.

## Why Zeebe?

Zeebe doesn’t rely on a central database, so there’s no performance bottleneck as process volumes increase. Deliver high throughput by distributing processing across clusters, or add cluster nodes to execute an unlimited number of processes at consistently low latency.

Zeebe distributes data across all brokers in a cluster with storage directly on the server filesystem. If one broker goes down, another can replace it with no data loss. This pre-configured replication mechanism ensures that Camunda can recover from machine or software failure with no human interaction, no data loss, and minimal downtime.

For documentation on deploying Zeebe as part of Camunda 8 Self-Managed, refer to the [deployment guide](../../self-managed/zeebe-deployment/zeebe-installation.md).

## Get started

New to Zeebe? Learn about clustering, partitions, internal processing, and more.

<ZeebeGrid zeebe={gettingStartedCards} />
