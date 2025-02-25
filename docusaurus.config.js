const versionedLinks = require("./src/mdx/versionedLinks");
const { unsupportedVersions } = require("./src/versions");

const latestVersion = require("./src/versions").versionMappings[0].docsVersion;

const docsSiteUrl = process.env.DOCS_SITE_URL || "https://docs.camunda.io";
const { themes } = require("prism-react-renderer");

module.exports = {
  // https://docusaurus.io/blog/releases/3.6#adoption-strategy
  future: {
    experimental_faster: true,
  },
  title: "Camunda 8 Docs",
  tagline:
    "Start orchestrating your processes with Camunda 8 SaaS or Self-Managed.",
  // url: "https://camunda-cloud.github.io",
  url: docsSiteUrl,
  // baseUrl: "/camunda-cloud-documentation/",
  baseUrl: process.env.DOCS_SITE_BASE_URL || "/",
  customFields: {
    canonicalUrlRoot: docsSiteUrl,
  },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "camunda", // Usually your GitHub org/user name.
  projectName: "camunda-docs", // Usually your repo name.
  trailingSlash: true,
  // do not delete the following 'noIndex' line as it is modified for production
  noIndex: true,
  plugins: [
    // This custom Osano plugin must precede the gtm-plugin.
    "./static/plugins/osano",
    [
      "./static/plugins/gtm",
      {
        containerId: "GTM-KQGNSTS",
        tagManagerUrl:
          process.env.TAG_MANAGER_URL || "https://ssgtm.camunda.io",
      },
    ],
    "./static/plugins/bpmn-js",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "optimize",
        path: "optimize",
        routeBasePath: "optimize",
        beforeDefaultRemarkPlugins: [versionedLinks],
        sidebarPath: require.resolve("./optimize_sidebars.js"),
        editUrl: "https://github.com/camunda/camunda-docs/edit/main/",
        lastVersion: "3.14.0",
        versions: {
          current: {
            label: "8.8 / 3.16.0 (unreleased)",
          },
          "3.15.0": {
            label: "8.7 / 3.15.0 (unreleased)",
          },
          "3.14.0": {
            label: "8.6 / 3.14.0",
          },
          "3.13.0": {
            label: "8.5 / 3.13.0",
            banner: "none",
          },
          "3.12.0": {
            label: "8.4 / 3.12.0",
            banner: "none",
          },
          "3.11.0": {
            label: "8.3 / 3.11.0",
            banner: "none",
          },
        },
      },
    ],
    [
      // Operate API docs generation
      "docusaurus-plugin-openapi-docs",
      {
        id: "api-operate-openapi",
        docsPluginId: "default",
        config: {
          operate: {
            specPath: "api/operate/operate-openapi.yaml",
            outputDir: "docs/apis-tools/operate-api/specifications",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            hideSendButton: true,
            version: "1",
            label: "Unused but required field",
            baseUrl: "Unused but required field",
            versions: {
              8.7: {
                specPath: "api/operate/version-8.7/operate-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.7/apis-tools/operate-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.6: {
                specPath: "api/operate/version-8.6/operate-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.6/apis-tools/operate-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.5: {
                specPath: "api/operate/version-8.5/operate-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.5/apis-tools/operate-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.4: {
                specPath: "api/operate/version-8.4/operate-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.4/apis-tools/operate-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
            },
          },
        },
      },
    ],
    [
      // Tasklist REST API docs generation
      "docusaurus-plugin-openapi-docs",
      {
        id: "api-tasklist-openapi",
        docsPluginId: "default",
        config: {
          tasklist: {
            specPath: "api/tasklist/tasklist-openapi.yaml",
            outputDir: "docs/apis-tools/tasklist-api-rest/specifications",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            hideSendButton: true,
            version: "1",
            label: "Unused but required field",
            baseUrl: "Unused but required field",
            versions: {
              8.7: {
                specPath: "api/tasklist/version-8.7/tasklist-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.7/apis-tools/tasklist-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.6: {
                specPath: "api/tasklist/version-8.6/tasklist-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.6/apis-tools/tasklist-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.5: {
                specPath: "api/tasklist/version-8.5/tasklist-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.5/apis-tools/tasklist-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.4: {
                specPath: "api/tasklist/version-8.4/tasklist-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.4/apis-tools/tasklist-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
            },
          },
        },
      },
    ],
    [
      // Administration Self-Managed REST API docs generation
      "docusaurus-plugin-openapi-docs",
      {
        id: "api-adminsm-openapi",
        docsPluginId: "default",
        config: {
          adminsm: {
            specPath: "api/administration-sm/administration-sm-openapi.yaml",
            outputDir: "docs/apis-tools/administration-sm-api/specifications",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            hideSendButton: true,
            version: "1",
            label: "Unused but required field",
            baseUrl: "Unused but required field",
            versions: {
              8.7: {
                specPath:
                  "api/administration-sm/version-8.7/administration-sm-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.7/apis-tools/administration-sm-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.6: {
                specPath:
                  "api/administration-sm/version-8.6/administration-sm-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.6/apis-tools/administration-sm-api/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
            },
          },
        },
      },
    ],
    [
      // Camunda 8 REST API docs generation
      "docusaurus-plugin-openapi-docs",
      {
        id: "api-camunda-openapi",
        docsPluginId: "default",
        config: {
          camunda: {
            specPath: "api/camunda/camunda-openapi.yaml",
            outputDir: "docs/apis-tools/camunda-api-rest/specifications",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            hideSendButton: true,
            version: "1",
            label: "Unused but required field",
            baseUrl: "Unused but required field",
            versions: {
              8.7: {
                specPath: "api/camunda/version-8.7/camunda-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.7/apis-tools/camunda-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.6: {
                specPath: "api/camunda/version-8.6/camunda-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.6/apis-tools/camunda-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
            },
          },
        },
      },
    ],
    [
      // Zeebe REST API docs generation (removed at v8.7)
      "docusaurus-plugin-openapi-docs",
      {
        id: "api-zeebe-openapi",
        docsPluginId: "default",
        config: {
          zeebe: {
            specPath: "inactive",
            outputDir: "docs/apis-tools/zeebe-api-rest/specifications",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
            hideSendButton: true,
            version: "1",
            label: "Unused but required field",
            baseUrl: "Unused but required field",
            versions: {
              // Removed after 8.6
              8.6: {
                specPath: "api/zeebe/version-8.6/zeebe-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.6/apis-tools/zeebe-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
              8.5: {
                specPath: "api/zeebe/version-8.5/zeebe-openapi.yaml",
                outputDir:
                  "versioned_docs/version-8.5/apis-tools/zeebe-api-rest/specifications",
                label: "Unused but required field",
                baseUrl: "Unused but required field",
              },
            },
          },
        },
      },
    ],
  ],
  scripts: [
    {
      src: "https://widget.kapa.ai/kapa-widget.bundle.js",
      "data-website-id": "1a0b2863-2767-4583-9d33-ded0095731e7",
      "data-project-name": "Camunda",
      "data-project-color": "#000000",
      "data-project-logo":
        "https://avatars.githubusercontent.com/u/2443838?s=200&v=4",
      "data-modal-disclaimer":
        "Welcome to Camunda 8 Smart docs, powered by AI. Accessing developer docs, forum posts and product blogs from the last year, responses are generated by combining various sources to formulate the best possible answer. If you have feedback please give a thumbs up or down as we continue to improve the AI.",
      "data-modal-example-questions": `What's new in Camunda ${latestVersion}?,What's Camunda SaaS vs Self-Managed?`,
      "data-search-mode-enabled": "true",
      async: true,
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    announcementBar: {
      id: "camunda8",
      content:
        '📣 <b><a target="_blank" rel="noopener noreferrer" href="https://signup.camunda.com/accounts?utm_source=docs.camunda.io&utm_medium=referral&utm_content=banner">Sign up</a></b> for a free account to start orchestrating your business processes today.',
      backgroundColor: "#14D890",
      textColor: "#000",
      isCloseable: true,
    },

    prism: {
      additionalLanguages: ["java", "protobuf", "csharp"],
      theme: themes.palenight,
      darkTheme: themes.dracula,
    },
    navbar: {
      title: "Camunda 8 Docs",
      logo: {
        alt: "Camunda 8 Docs",
        src: "img/black-C.png",
        srcDark: "img/light-C.png",
      },
      items: [
        {
          type: "docsVersionDropdown",
          position: "left",
          dropdownItemsAfter: [
            {
              type: "html",
              value: '<hr class="dropdown-separator">',
            },
            {
              type: "html",
              className: "dropdown-unsupported-versions",
              value: "<b>Unsupported versions</b>",
            },
            ...unsupportedVersions.map((version) => ({
              label: version.label,
              href: `https://unsupported.docs.camunda.io/${version.urlSuffix}/`,
            })),
          ],
        },
        {
          type: "doc",
          docId: "guides/introduction-to-camunda",
          label: "Guides",
          position: "left",
        },
        {
          type: "doc",
          docId: "components/components-overview",
          label: "Components",
          position: "left",
        },
        {
          type: "doc",
          docId: "apis-tools/working-with-apis-tools",
          label: "APIs & Tools",
          position: "left",
        },
        {
          type: "doc",
          docId: "self-managed/about-self-managed",
          label: "Self-Managed",
          position: "left",
        },
        {
          type: "doc",
          docId: "reference/overview",
          label: "Reference",
          position: "left",
        },
        {
          type: "doc",
          docId: "download-hub/index",
          label: "Download Hub",
          class: "badge badge--primary",
          position: "left",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "Camunda.com",
        src: "img/logo-light.svg",
        href: "https://camunda.com",
      },
      links: [
        {
          title: "About",
          items: [
            {
              label: "How to use our docs",
              to: "meta",
            },
            {
              label: "Camunda Help Center",
              to: "docs/reference/camunda-help-center",
            },
            {
              label: "Try free",
              href: "https://signup.camunda.com/accounts?utm_source=docs.camunda.io&utm_medium=referral&utm_content=footer",
            },
            {
              label: "Contact",
              to: "docs/reference/contact",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              html: `<a href="https://twitter.com/camunda" target="_blank" rel="noreferrer noopener"><img src= "/img/twitter.svg" alt="Camunda on Twitter" class="footer-logos" /></a> <a href="https://github.com/camunda" target="_blank" rel="noreferrer noopener"><img src= "/img/github-mark-white.svg" alt="Camunda on GitHub" class="footer-logos" /></a>`,
            },
            {
              label: "Forum",
              href: "https://forum.camunda.io/",
            },
            {
              label: "Contribute",
              href: "https://camunda.com/developers/how-to-contribute/",
            },
            {
              label: "Developer resources",
              href: "https://camunda.com/developers/",
            },
            {
              label: "Subscribe",
              href: "https://camunda.com/developers/developer-community-updates/",
            },
          ],
        },
        {
          title: "Camunda",
          items: [
            {
              label: "Web Modeler",
              href: "https://camunda.io",
            },
            {
              label: "Status",
              href: "https://status.camunda.io",
            },
            {
              label: "Blog",
              href: "https://camunda.com/blog/tag/camunda-platform-8/",
            },
            {
              label: "Release cycle",
              to: "docs/reference/release-policy",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: "Privacy Statement",
              href: "https://legal.camunda.com/privacy-and-data-protection",
            },
            {
              html: `<a class="footer__link-item" href="#" onclick="Osano.cm.showDrawer('osano-cm-dom-info-dialog-open')">Cookie Preferences</a>`,
            },
            {
              label: "Licenses",
              to: "docs/reference/licenses",
            },
            {
              label: "Security notices",
              to: "docs/reference/notices",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Camunda`,
    },
    algolia: {
      // These keys are for our new standalone algolia instance!
      apiKey: "d701d38126d1a43866047d3ab97680d1",
      appId: "6KYF3VMCXZ",
      indexName: "camunda",
    },
    languageTabs: [
      {
        highlight: "bash",
        language: "curl",
        logoClass: "curl",
      },
      {
        highlight: "java",
        language: "java",
        logoClass: "java",
        variant: "okhttp",
        variants: ["okhttp", "unirest"],
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
        variant: "native",
        variants: ["native", "axios", "request", "unirest"],
      },
      {
        highlight: "csharp",
        language: "csharp",
        logoClass: "csharp",
        variant: "RestSharp",
        variants: ["restsharp", "httpclient", "", " "],
      },
      {
        highlight: "python",
        language: "python",
        logoClass: "python",
        variant: "requests",
        variants: ["requests", "http.client"],
      },
      {
        highlight: "go",
        language: "go",
        logoClass: "go",
        variant: "native",
        variants: ["native", ""],
      },
    ],
    mermaid: {
      options: {
        theme: "base",
        themeVariables: {
          fontFamily:
            "IBM Plex Sans, -apple-system, blinkmacsystemfont, Segoe UI, roboto, oxygen-sans, ubuntu, cantarell, Helvetica Neue, sans-serif",
          fontSize: "16px",
        },
      },
      theme: {
        light: "neutral",
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/camunda/camunda-docs/edit/main/",
          beforeDefaultRemarkPlugins: [versionedLinks],
          lastVersion: "8.6",
          // 👋 When cutting a new version, remove the banner for maintained versions by adding an entry. Remove the entry to versions >18 months old.
          versions: {
            current: {
              label: "8.8 (unreleased)",
            },
            8.7: {
              label: "8.7 (unreleased)",
            },
            8.5: {
              banner: "none",
            },
            8.4: {
              banner: "none",
            },
            8.3: {
              banner: "none",
            },
          },
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: [
            "/docs/**/assets/**",
            "/docs/**/tags/**",
            "/docs/next/**",
            "/docs/8.7/**",
            "/docs/8.3/**",
            "/docs/8.4/**",
            "/docs/8.5/**",
            "/optimize/3.11.0/**",
            "/optimize/3.12.0/**",
            "/optimize/3.13.0/**",
            "/optimize/3.15.0/**",
            "/optimize/next/**",
          ],
        },
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: [
    "docusaurus-theme-openapi-docs",
    "@saucelabs/theme-github-codeblock",
    "@docusaurus/theme-mermaid",
  ],
};
