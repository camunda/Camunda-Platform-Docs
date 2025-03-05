import React from "react";
import { useActiveVersion } from "@docusaurus/plugin-content-docs/client";

const DockerComposeBaseURL =
  "https://github.com/camunda/camunda-distributions/releases/download";

const getVersion = () => {
  const docsVersion = useActiveVersion();
  if (docsVersion.label == "Next") return "alpha";
  // NOTE: This is a workaround for the irregular release cut of the 8.7 version.
  // NOTE: Once the 8.8 docker compose version is released, 8.8 should point to 8.8
  // TODO: Remove this condition once the 8.7 is released.
  if (
    docsVersion.label == "8.7 (unreleased)" ||
    docsVersion.label == "8.8 (unreleased)"
  )
    return "alpha";
  return docsVersion.label;
};

const DockerCompose = () => {
  const version = getVersion();
  return (
    <a
      title={`${DockerComposeBaseURL}/docker-compose-${version}/docker-compose-${version}.zip`}
      href={`${DockerComposeBaseURL}/docker-compose-${version}/docker-compose-${version}.zip`}
    >
      Docker Compose
    </a>
  );
};

export default DockerCompose;
