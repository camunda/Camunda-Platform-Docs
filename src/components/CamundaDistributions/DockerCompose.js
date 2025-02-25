import React from "react";
import { getDocsVersion } from "./utilz";

const DockerComposeBaseURL =
  "https://github.com/camunda/camunda-self-managed/releases/download";

export const DockerComposeURL = () => {
  const version = getDocsVersion();
  return `${DockerComposeBaseURL}/docker-compose-${version}/docker-compose-${version}.zip`;
};

export const DockerCompose = () => {
  return (
    <a title={DockerComposeURL()} href={DockerComposeURL()}>
      Docker Compose
    </a>
  );
};

export default DockerCompose;
