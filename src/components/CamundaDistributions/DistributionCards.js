import React from "react";
import ArtifactCard from "./ArtifactCard.js";
import { DockerComposeURL } from "./DockerCompose.js";
import { getDocsVersion } from "./utilz";

//
export const C8Run = (runCommandArgs = []) => {
  const jsonData = {
    "8.6.7": [
      {
        system: "linux-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-linux-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "windows-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "darwin-aarch64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
    "8.6.6": [
      {
        system: "linux-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-linux-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "windows-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "darwin-aarch64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
    "8.6.5": [
      {
        system: "linux-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-linux-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "windows-x86_64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "darwin-aarch64",
        download:
          "https://github.com/camunda/camunda/releases/download/8.6.7/camunda8-run-8.6.7-windows-x86_64.tar.gz",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "More",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
  };

  const runCommand = ["./start.sh"];

  if (runCommandArgs) {
    runCommand.concat(runCommandArgs);
  }

  return <ArtifactCard data={jsonData} runCommand={runCommand.join("\n")} />;
};

//
export const DockerCompose = () => {
  const jsonData = {
    latest: [
      {
        system: "",
        download:
          "https://github.com/camunda/camunda-self-managed/releases/download/docker-compose-alpha/docker-compose-alpha.zip",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
        ],
      },
    ],
  };

  const runCommand = "docker compose up -d";

  return <ArtifactCard data={jsonData} runCommand={runCommand} />;
};

//
export const Helm = ({ runCommandArgs }) => {
  const jsonData = {
    "11.1.1": [
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
    "11.1.0": [
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
    "11.0.4": [
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
      {
        system: "",
        download: "",
        links: [
          {
            description: "Release Notes",
            link: "https://github.com/camunda/camunda-platform-helm/releases/tag/camunda-platform-11.1.1",
          },
          {
            description: "Values",
            link: "https://artifacthub.io/packages/helm/camunda/camunda-platform/11.1.1#parameters",
          },
        ],
      },
    ],
  };

  const runCommand = [
    "helm repo add camunda https://helm.camunda.io",
    "helm repo update",
    'helm install camunda camunda/camunda-platform --version "${version}"',
  ];

  if (runCommandArgs) {
    runCommand.concat(runCommandArgs);
  }

  return <ArtifactCard data={jsonData} runCommand={runCommand.join("\n")} />;
};
