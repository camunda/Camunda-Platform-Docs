import { useActiveVersion } from "@docusaurus/plugin-content-docs/client";

export const getDocsVersion = () => {
  const docsVersion = useActiveVersion();
  if (docsVersion.label == "Next") return "alpha";
  // NOTE: This is a workaround for the irregular release cut of the 8.7 version.
  // TODO: Remove this condition once the 8.7 is released.
  if (docsVersion.label == "8.7") return "alpha";
  return docsVersion.label;
};
