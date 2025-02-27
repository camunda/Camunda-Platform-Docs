// import React, { useState } from "react";
// import Link from "@docusaurus/Link";
// import CodeBlock from "@theme/CodeBlock";
// import styles from "./styles.module.css";

// const ArtifactCard = (artifactData = Object) => {
//   const versions = artifactData.keys()
//   return (
//     <div className={styles.card}>
//       <div className={styles.dropdownContainer}>
//       {version != null && (
//           <>
//             <label>Version</label>
//             <select
//               value={version}
//               onChange={(e) => setVersion(e.target.value)}
//             >
//               {versions.map((version) => (
//                 <option key={version} value={version}>
//                   {version}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}
//         {artifactData.system != "" && (
//           <>
//             <label>System</label>
//             <select
//               value={artifactData.system}
//               onChange={(e) => setArchitecture(e.target.value)}
//             >
//               {artifactData.system.map((os) => (
//                 <option key={os} value={os}>
//                   {os}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}
//       </div>
//       <div>
//         {downloadURL != "" && (
//           <Link
//             to={downloadURL}
//             title={downloadURL}
//             className={styles.downloadURL}
//           >
//             Download
//           </Link>
//         )}
//         <br />
//         {runCommand != "" && (
//           <CodeBlock language="shell">
//             {runCommand.replaceAll("${version}", version)}
//           </CodeBlock>
//         )}
//       </div>
//       <div className={styles.linkContainer}>
//       {extraLinks.forEach(element => {
//           <Link to={element.url}>{element.desc}</Link>
//         })}
//       </div>
//     </div>
//   );
// };

// export default ArtifactCard;
import React, { useState } from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";

const ArtifactCard = ({ data, runCommand = "" }) => {
  const versions = Object.keys(data);

  // Ensure at least one version exists
  const [selectedVersion, setSelectedVersion] = useState(versions[0] || "");
  const [selectedSystem, setSelectedSystem] = useState(
    data[versions[0]]?.[0]?.system || ""
  );

  const handleVersionChange = (event) => {
    const newVersion = event.target.value;
    setSelectedVersion(newVersion);
    setSelectedSystem(data[newVersion]?.[0]?.system || "");
  };

  const handleSystemChange = (event) => {
    setSelectedSystem(event.target.value);
  };

  const selectedData =
    data[selectedVersion]?.find((item) => item.system === selectedSystem) || {};

  return (
    <div className={styles.card}>
      <div className={styles.dropdownContainer}>
        <label>
          Version:
          <select value={selectedVersion} onChange={handleVersionChange}>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </label>
        {selectedSystem && (
          <label>
            System:
            <select value={selectedSystem} onChange={handleSystemChange}>
              {data[selectedVersion]?.map((item) => (
                <option key={item.system} value={item.system}>
                  {item.system}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {selectedData.download && (
        <>
          <h4>Get</h4>
          <Link
            to={selectedData.download}
            title={selectedData.download}
            className={styles.downloadURL}
          >
            Download
          </Link>
        </>
      )}

      <h4>Run</h4>
      {runCommand && (
        <CodeBlock language="shell">
          {runCommand.replace("${version}", selectedVersion)}
        </CodeBlock>
      )}

      {selectedData.links && (
        <>
          <h4>Links</h4>
          <ul>
            {selectedData.links.map((link, index) => (
              <li key={index}>
                <a href={link.link} target="_blank" rel="noopener noreferrer">
                  {link.description}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ArtifactCard;
