function optimizeLink(label, href) {
  return {
    type: "link",
    label: label,
    href: `/optimize/next/${href}`,
  };
}

module.exports = {
  Guides: [
    "guides/introduction-to-camunda",
    {
      "Get started": [
        "guides/getting-started-java-spring",
        "guides/model-your-first-process",
        {
          "Orchestration use cases": [
            "guides/orchestrate-human-tasks",
            "guides/orchestrate-apis",
            "guides/orchestrate-microservices",
          ],
        },
      ],
    },
    {
      Design: [
        "guides/automating-a-process-using-bpmn",
        "guides/create-decision-tables-using-dmn",
        "guides/utilizing-forms",
      ],
      Automate: [
        "guides/create-cluster",
        "guides/setting-up-development-project",
        "guides/setup-client-connection-credentials",
        "guides/configuring-out-of-the-box-connectors",
        "guides/use-connectors-in-hybrid-mode",
        "guides/host-custom-connectors",
      ],
      Improve: [
        "guides/improve-processes-with-optimize",
        {
          "DevOps lifecycle": [
            "guides/devops-lifecycle/integrate-web-modeler-in-ci-cd",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Migrate from Camunda 7",
      link: {
        type: "doc",
        id: "guides/migrating-from-camunda-7/index",
      },
      items: [
        "guides/migrating-from-camunda-7/migration-journey",
        "guides/migrating-from-camunda-7/conceptual-differences",
        "guides/migrating-from-camunda-7/migration-tooling",
        "guides/migrating-from-camunda-7/code-conversion",
        "guides/migrating-from-camunda-7/migration-readiness",
        "guides/migrating-from-camunda-7/technical-details",
      ],
    },
  ],
  Components: [
    "components/components-overview",
    {
      Concepts: [
        "components/concepts/what-is-camunda-8",
        "components/concepts/clusters",
        "components/concepts/processes",
        "components/concepts/job-workers",
        "components/concepts/execution-listeners",
        "components/concepts/user-task-listeners",
        "components/concepts/process-instance-creation",
        "components/concepts/messages",
        "components/concepts/signals",
        "components/concepts/incidents",
        "components/concepts/variables",
        "components/concepts/expressions",
        "components/concepts/workflow-patterns",
        "components/concepts/process-instance-modification",
        "components/concepts/process-instance-migration",
        "components/concepts/data-retention",
        "components/concepts/encryption-at-rest",
        "components/concepts/outbound-connectors-job-workers",
        "components/concepts/backups",
        "components/concepts/resource-deletion",
        "components/concepts/resource-authorizations",
        "components/concepts/document-handling",
        {
          "Access control": [
            "components/concepts/access-control/user-groups",
            "components/concepts/access-control/user-task-access-restrictions",
          ],
        },
      ],
      Console: [
        "components/console/introduction-to-console",
        {
          "Manage your organization": [
            "components/console/manage-organization/organization-settings",
            "components/console/manage-organization/manage-users",
            "components/console/manage-organization/view-organization-activity",
            "components/console/manage-organization/enable-alpha-features",
            "components/console/manage-organization/usage-history",
            "components/console/manage-organization/usage-alerts",
            "components/console/manage-organization/advanced-search",
            "components/console/manage-organization/switch-organization",
            "components/console/manage-organization/external-sso",
            "components/console/manage-organization/delete-account",
          ],
        },
        {
          "Manage clusters": [
            "components/console/manage-clusters/create-cluster",
            "components/console/manage-clusters/manage-cluster",
            "components/console/manage-clusters/manage-api-clients",
            "components/console/manage-clusters/manage-secrets",
            "components/console/manage-clusters/manage-alerts",
            "components/console/manage-clusters/manage-ip-allowlists",
            "components/console/manage-clusters/create-backups",
            "components/console/manage-clusters/settings",
          ],
        },
        {
          "Manage your plan": [
            "components/console/manage-plan/available-plans",
            "components/console/manage-plan/upgrade-to-starter-plan",
            "components/console/manage-plan/update-billing-reservations",
            "components/console/manage-plan/update-creditcard",
            "components/console/manage-plan/retrieve-invoices-or-update-billing-info",
            "components/console/manage-plan/cancel-starter-subscription",
            "components/console/manage-plan/migrate-from-prof-to-starter",
          ],
        },
        {
          Troubleshooting: [
            "components/console/console-troubleshooting/common-pitfalls",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Modeler",
      link: {
        type: "doc",
        id: "components/modeler/about-modeler",
      },
      items: [
        {
          "Web Modeler": [
            "components/modeler/web-modeler/launch-web-modeler",
            "components/modeler/web-modeler/model-your-first-diagram",
            "components/modeler/web-modeler/context-pad",
            "components/modeler/web-modeler/git-sync",
            "components/modeler/web-modeler/import-diagram",
            "components/modeler/web-modeler/fix-problems-in-your-diagram",
            "components/modeler/web-modeler/run-or-publish-your-process",
            {
              type: "category",
              label: "Process applications",
              link: {
                type: "doc",
                id: "components/modeler/web-modeler/process-applications",
              },
              items: [
                "components/modeler/web-modeler/process-application-pipeline",
                "components/modeler/web-modeler/create-a-process-application",
                "components/modeler/web-modeler/deploy-process-application",
                "components/modeler/web-modeler/process-application-versioning",
              ],
            },
            {
              Collaboration: [
                "components/modeler/web-modeler/collaboration",
                "components/modeler/web-modeler/collaborate-with-modes",
                "components/modeler/web-modeler/design-your-process",
                "components/modeler/web-modeler/implement-your-process",
                "components/modeler/web-modeler/play-your-process",
              ],
            },
            "components/modeler/web-modeler/camunda-marketplace",
            "components/modeler/web-modeler/versions",
            "components/modeler/web-modeler/token-simulation",
            {
              "Advanced modeling": [
                "components/modeler/web-modeler/advanced-modeling/business-rule-task-linking",
                "components/modeler/web-modeler/advanced-modeling/call-activity-linking",
                "components/modeler/web-modeler/advanced-modeling/form-linking",
                "components/modeler/web-modeler/advanced-modeling/publish-public-processes",
                {
                  "AI features": [
                    "components/modeler/web-modeler/advanced-modeling/refactoring-suggestions",
                    "components/modeler/web-modeler/advanced-modeling/camunda-docs-ai",
                  ],
                },
              ],
            },
            "components/modeler/web-modeler/file-download",
            "components/modeler/web-modeler/web-modeler-settings",
            "components/modeler/web-modeler/process-landscape-visualization",
          ],
        },
        {
          type: "category",
          label: "Desktop Modeler",
          link: {
            type: "doc",
            id: "components/modeler/desktop-modeler/index",
          },
          items: [
            "components/modeler/desktop-modeler/install-the-modeler",
            "components/modeler/desktop-modeler/model-your-first-diagram",
            "components/modeler/desktop-modeler/connect-to-camunda-8",
            "components/modeler/desktop-modeler/start-instance",
            "components/modeler/desktop-modeler/use-connectors",
            "components/modeler/desktop-modeler/variables",
            {
              type: "category",
              label: "Element templates",
              link: {
                type: "doc",
                id: "components/modeler/desktop-modeler/element-templates/about-templates",
              },
              items: [
                "components/modeler/desktop-modeler/element-templates/configuring-templates",
                "components/modeler/desktop-modeler/element-templates/using-templates",
                "components/modeler/desktop-modeler/element-templates/defining-templates",
                "components/modeler/desktop-modeler/element-templates/c7-defining-templates",
                "components/modeler/desktop-modeler/element-templates/additional-resources",
              ],
            },
            {
              "Additional configuration": [
                "components/modeler/desktop-modeler/flags/flags",
                "components/modeler/desktop-modeler/plugins/plugins",
                "components/modeler/desktop-modeler/custom-lint-rules/custom-lint-rules",
                "components/modeler/desktop-modeler/search-paths/search-paths",
                "components/modeler/desktop-modeler/telemetry/telemetry",
              ],
            },
            "components/modeler/desktop-modeler/troubleshooting",
          ],
        },
        {
          BPMN: [
            "components/modeler/bpmn/modeler-bpmn",
            "components/modeler/bpmn/bpmn-primer",
            "components/modeler/bpmn/bpmn-coverage",
            "components/modeler/bpmn/data-flow",
            {
              Tasks: [
                "components/modeler/bpmn/tasks",
                "components/modeler/bpmn/service-tasks/service-tasks",
                "components/modeler/bpmn/user-tasks/user-tasks",
                "components/modeler/bpmn/receive-tasks/receive-tasks",
                "components/modeler/bpmn/business-rule-tasks/business-rule-tasks",
                "components/modeler/bpmn/script-tasks/script-tasks",
                "components/modeler/bpmn/send-tasks/send-tasks",
                "components/modeler/bpmn/manual-tasks/manual-tasks",
                "components/modeler/bpmn/undefined-tasks/undefined-tasks",
              ],
            },
            {
              Gateways: [
                "components/modeler/bpmn/gateways",
                "components/modeler/bpmn/exclusive-gateways/exclusive-gateways",
                "components/modeler/bpmn/parallel-gateways/parallel-gateways",
                "components/modeler/bpmn/event-based-gateways/event-based-gateways",
                "components/modeler/bpmn/inclusive-gateways/inclusive-gateways",
              ],
            },
            {
              Events: [
                "components/modeler/bpmn/events",
                "components/modeler/bpmn/none-events/none-events",
                "components/modeler/bpmn/message-events/message-events",
                "components/modeler/bpmn/signal-events/signal-events",
                "components/modeler/bpmn/timer-events/timer-events",
                "components/modeler/bpmn/error-events/error-events",
                "components/modeler/bpmn/escalation-events/escalation-events",
                "components/modeler/bpmn/terminate-events/terminate-events",
                "components/modeler/bpmn/link-events/link-events",
                "components/modeler/bpmn/compensation-events/compensation-events",
              ],
            },
            {
              Subprocesses: [
                "components/modeler/bpmn/subprocesses",
                "components/modeler/bpmn/embedded-subprocesses/embedded-subprocesses",
                "components/modeler/bpmn/call-activities/call-activities",
                "components/modeler/bpmn/event-subprocesses/event-subprocesses",
              ],
            },
            {
              Markers: [
                "components/modeler/bpmn/markers",
                "components/modeler/bpmn/multi-instance/multi-instance",
                "components/modeler/bpmn/compensation-handler/compensation-handler",
                "components/modeler/bpmn/ad-hoc/ad-hoc",
              ],
            },
          ],
        },
        require("./docs/components/modeler/dmn/sidebar-schema"),
        require("./docs/components/modeler/feel/sidebar-schema"),
        require("./docs/components/modeler/forms/sidebar-schema"),
        "components/modeler/data-handling",
        require("./docs/components/modeler/reference/sidebar-schema"),
      ],
    },
    {
      type: "category",
      label: "Connectors",
      link: {
        type: "doc",
        id: "components/connectors/introduction-to-connectors",
      },
      items: [
        {
          type: "category",
          label: "How to use connectors",
          link: {
            type: "doc",
            id: "components/connectors/use-connectors/index",
          },
          items: [
            "components/connectors/connector-types",
            "components/connectors/use-connectors/inbound",
            "components/connectors/use-connectors/outbound",
          ],
        },
        {
          type: "category",
          label: "Camunda connectors",
          link: {
            type: "doc",
            id: "components/connectors/out-of-the-box-connectors/available-connectors-overview",
          },
          items: [
            {
              "Amazon AWS": [
                "components/connectors/out-of-the-box-connectors/amazon-bedrock",
                "components/connectors/out-of-the-box-connectors/amazon-comprehend",
                "components/connectors/out-of-the-box-connectors/amazon-dynamodb",
                "components/connectors/out-of-the-box-connectors/amazon-eventbridge",
                "components/connectors/out-of-the-box-connectors/aws-lambda",
                "components/connectors/out-of-the-box-connectors/amazon-sagemaker",
                "components/connectors/out-of-the-box-connectors/amazon-sns",
                "components/connectors/out-of-the-box-connectors/amazon-sqs",
                "components/connectors/out-of-the-box-connectors/amazon-s3",
                "components/connectors/out-of-the-box-connectors/amazon-textract",
              ],
            },
            "components/connectors/out-of-the-box-connectors/asana",
            "components/connectors/out-of-the-box-connectors/automation-anywhere",
            "components/connectors/out-of-the-box-connectors/blueprism",
            "components/connectors/out-of-the-box-connectors/box",
            "components/connectors/out-of-the-box-connectors/easy-post",
            "components/connectors/out-of-the-box-connectors/email",
            "components/connectors/out-of-the-box-connectors/github",
            "components/connectors/out-of-the-box-connectors/gitlab",
            {
              Google: [
                "components/connectors/out-of-the-box-connectors/googledrive",
                "components/connectors/out-of-the-box-connectors/google-maps-platform",
                "components/connectors/out-of-the-box-connectors/google-sheets",
                "components/connectors/out-of-the-box-connectors/google-gemini",
              ],
            },
            "components/connectors/protocol/graphql",
            "components/connectors/protocol/http-webhook",
            "components/connectors/out-of-the-box-connectors/hugging-face",
            "components/connectors/out-of-the-box-connectors/kafka",
            {
              Microsoft: [
                "components/connectors/out-of-the-box-connectors/azure-open-ai",
                "components/connectors/out-of-the-box-connectors/microsoft-teams",
                "components/connectors/out-of-the-box-connectors/microsoft-o365-mail",
              ],
            },
            "components/connectors/out-of-the-box-connectors/openai",
            "components/connectors/out-of-the-box-connectors/operate",
            "components/connectors/protocol/polling",
            "components/connectors/out-of-the-box-connectors/rabbitmq",
            "components/connectors/protocol/rest",
            "components/connectors/out-of-the-box-connectors/salesforce",
            "components/connectors/out-of-the-box-connectors/sendgrid",
            "components/connectors/out-of-the-box-connectors/slack",
            "components/connectors/protocol/soap",
            "components/connectors/out-of-the-box-connectors/sql",
            "components/connectors/out-of-the-box-connectors/twilio",
            "components/connectors/out-of-the-box-connectors/uipath",
            "components/connectors/out-of-the-box-connectors/whatsapp",
          ],
        },
        {
          type: "category",
          label: "Custom connectors",
          link: {
            type: "doc",
            id: "components/connectors/custom-built-connectors/build-connector",
          },
          items: [
            {
              type: "category",
              label: "Connector templates",
              link: {
                type: "doc",
                id: "components/connectors/custom-built-connectors/connector-templates",
              },
              items: [
                "components/connectors/custom-built-connectors/connector-template-generator",
                "components/connectors/manage-connector-templates",
              ],
            },
            "components/connectors/custom-built-connectors/connector-sdk",
          ],
        },
      ],
    },
    {
      Zeebe: [
        "components/zeebe/zeebe-overview",
        {
          "Technical concepts": [
            "components/zeebe/technical-concepts/technical-concepts-overview",
            "components/zeebe/technical-concepts/architecture",
            "components/zeebe/technical-concepts/clustering",
            "components/zeebe/technical-concepts/partitions",
            "components/zeebe/technical-concepts/internal-processing",
            "components/zeebe/technical-concepts/process-lifecycles",
            "components/zeebe/technical-concepts/protocols",
          ],
        },
      ],
      Operate: [
        "components/operate/operate-introduction",
        {
          "User guide": [
            "components/operate/userguide/basic-operate-navigation",
            "components/operate/userguide/resolve-incidents-update-variables",
            "components/operate/userguide/selections-operations",
            "components/operate/userguide/delete-finished-instances",
            "components/operate/userguide/delete-resources",
            {
              "Process instance modification": [
                "components/operate/userguide/process-instance-modification",
                "components/operate/userguide/process-instance-batch-modification",
              ],
            },
            "components/operate/userguide/process-instance-migration",
            "components/operate/userguide/monitor-operation-status",
          ],
        },
      ],
      Tasklist: [
        "components/tasklist/introduction-to-tasklist",
        {
          "User guide": [
            "components/tasklist/userguide/using-tasklist",
            "components/tasklist/userguide/managing-tasks",
            "components/tasklist/userguide/using-filters",
            "components/tasklist/userguide/defining-task-priorities",
            "components/tasklist/userguide/starting-processes",
            "components/tasklist/userguide/tasklist-localization",
          ],
        },
      ],
      Optimize: [
        optimizeLink("What is Optimize?", "components/what-is-optimize/"),

        {
          "User guide": [
            optimizeLink(
              "Collections, dashboards, and reports",
              "components/userguide/collections-dashboards-reports/"
            ),
            optimizeLink(
              "User permissions",
              "components/userguide/user-permissions/"
            ),
            optimizeLink("Data sources", "components/userguide/data-sources/"),

            {
              Dashboards: [
                optimizeLink(
                  "Creating dashboards",
                  "components/userguide/creating-dashboards/"
                ),
                optimizeLink("Edit mode", "components/userguide/edit-mode/"),
                optimizeLink("View mode", "components/userguide/view-mode/"),
              ],
            },

            {
              "Dashboards maintained by Camunda": [
                optimizeLink(
                  "Process dashboards",
                  "components/userguide/process-dashboards/"
                ),
                optimizeLink(
                  "Instant process dashboards",
                  "components/userguide/instant-process-dashboards/"
                ),
              ],
            },

            optimizeLink(
              "Creating reports",
              "components/userguide/creating-reports/"
            ),
            optimizeLink("Process KPIs", "components/userguide/process-KPIs/"),

            {
              "Process analysis": [
                optimizeLink(
                  "Overview",
                  "components/userguide/process-analysis/process-analysis-overview/"
                ),
                optimizeLink(
                  "Task analysis",
                  "components/userguide/process-analysis/task-analysis/"
                ),
                optimizeLink(
                  "Branch analysis",
                  "components/userguide/process-analysis/branch-analysis/"
                ),
                optimizeLink(
                  "User task analytics",
                  "components/userguide/process-analysis/user-task-analytics/"
                ),
                {
                  "Report analysis": [
                    optimizeLink(
                      "Report process analysis",
                      "components/userguide/process-analysis/report-analysis/overview/"
                    ),

                    {
                      "Edit mode": [
                        optimizeLink(
                          "Overview",
                          "components/userguide/process-analysis/report-analysis/edit-mode/"
                        ),
                        optimizeLink(
                          "Select process definitions",
                          "components/userguide/process-analysis/report-analysis/select-process-definitions/"
                        ),
                        optimizeLink(
                          "Define reports",
                          "components/userguide/process-analysis/report-analysis/define-reports/"
                        ),
                        optimizeLink(
                          "Measures",
                          "components/userguide/process-analysis/report-analysis/measures/"
                        ),
                        optimizeLink(
                          "Compare target values",
                          "components/userguide/process-analysis/report-analysis/compare-target-values/"
                        ),
                        optimizeLink(
                          "Process instance parts",
                          "components/userguide/process-analysis/report-analysis/process-instance-parts/"
                        ),
                        optimizeLink(
                          "Configure reports",
                          "components/userguide/process-analysis/report-analysis/configure-reports/"
                        ),
                      ],
                    },

                    optimizeLink(
                      "View mode",
                      "components/userguide/process-analysis/report-analysis/view-mode/"
                    ),
                  ],
                },

                {
                  Filters: [
                    optimizeLink(
                      "Overview",
                      "components/userguide/process-analysis/filters/"
                    ),
                    optimizeLink(
                      "Metadata filters",
                      "components/userguide/process-analysis/metadata-filters/"
                    ),
                    optimizeLink(
                      "Instance state filters",
                      "components/userguide/process-analysis/instance-state-filters/"
                    ),
                    optimizeLink(
                      "Flow node filters",
                      "components/userguide/process-analysis/flow-node-filters/"
                    ),
                    optimizeLink(
                      "Process instance filters",
                      "components/userguide/process-analysis/process-instance-filters/"
                    ),
                    optimizeLink(
                      "Variable filters",
                      "components/userguide/process-analysis/variable-filters/"
                    ),
                  ],
                },
              ],
            },

            {
              "Additional features": [
                optimizeLink(
                  "Alerts",
                  "components/userguide/additional-features/alerts/"
                ),
                optimizeLink(
                  "Export and import",
                  "components/userguide/additional-features/export-import/"
                ),
                optimizeLink(
                  "Variable labeling",
                  "components/userguide/additional-features/variable-labeling/"
                ),
                optimizeLink(
                  "Process variants comparison",
                  "components/userguide/additional-features/process-variants-comparison/"
                ),
                optimizeLink(
                  "Machine learning-ready data set",
                  "components/userguide/additional-features/ml-dataset/"
                ),
              ],
            },
          ],
        },
      ],
      "Best Practices": [
        "components/best-practices/best-practices-overview",
        {
          "Project management": [
            "components/best-practices/management/following-the-customer-success-path",
            "components/best-practices/management/doing-a-proper-poc",
          ],
          Architecture: [
            "components/best-practices/architecture/deciding-about-your-stack",
            "components/best-practices/architecture/sizing-your-environment",
            "components/best-practices/architecture/understanding-human-tasks-management",
          ],
          Development: [
            "components/best-practices/development/connecting-the-workflow-engine-with-your-world",
            "components/best-practices/development/service-integration-patterns",
            "components/best-practices/development/writing-good-workers",
            "components/best-practices/development/dealing-with-problems-and-exceptions",
            "components/best-practices/development/handling-data-in-processes",
            "components/best-practices/development/routing-events-to-processes",
            "components/best-practices/development/testing-process-definitions",
          ],
          Modeling: [
            "components/best-practices/modeling/creating-readable-process-models",
            "components/best-practices/modeling/naming-bpmn-elements",
            "components/best-practices/modeling/naming-technically-relevant-ids",
            "components/best-practices/modeling/modeling-beyond-the-happy-path",
            "components/best-practices/modeling/modeling-with-situation-patterns",
            "components/best-practices/modeling/building-flexibility-into-bpmn-models",
            "components/best-practices/modeling/choosing-the-dmn-hit-policy",
            "components/best-practices/modeling/choosing-the-resource-binding-type",
          ],
          Operations: [
            "components/best-practices/operations/versioning-process-definitions",
            "components/best-practices/operations/reporting-about-processes",
          ],
          "Camunda 7 specific": [
            "components/best-practices/architecture/deciding-about-your-stack-c7",
            "components/best-practices/architecture/sizing-your-environment-c7",
            "components/best-practices/development/invoking-services-from-the-process-c7",
            "components/best-practices/development/understanding-transaction-handling-c7",
            "components/best-practices/development/testing-process-definitions-c7",
            "components/best-practices/development/routing-events-to-processes-c7",
            "components/best-practices/operations/operating-camunda-c7",
            "components/best-practices/operations/performance-tuning-camunda-c7",
            "components/best-practices/operations/securing-camunda-c7",
            "components/best-practices/architecture/extending-human-task-management-c7",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Early access",
      link: {
        type: "doc",
        id: "components/early-access/overview",
      },
      items: [
        {
          type: "category",
          label: "Experimental features",
          items: [
            "components/early-access/experimental/rpa/rpa-integration",
            "components/early-access/experimental/rpa/rpa-framework-library",
          ],
        },
        {
          type: "category",
          label: "Alpha features",
          link: {
            type: "doc",
            id: "components/early-access/alpha/alpha-features",
          },
          items: [
            {
              type: "category",
              label: "SAP",
              link: {
                type: "doc",
                id: "components/early-access/alpha/sap/sap-integration",
              },
              items: [
                "components/early-access/alpha/sap/sap-integration",
                "components/early-access/alpha/sap/odata-connector",
                "components/early-access/alpha/sap/rfc-connector",
                "components/early-access/alpha/sap/btp-plugin",
              ],
            },
            {
              type: "category",
              label: "BPMN Copilot",
              link: {
                type: "doc",
                id: "components/early-access/alpha/bpmn-copilot/bpmn-copilot",
              },
              items: [
                "components/early-access/alpha/bpmn-copilot/bpmn-copilot",
              ],
            },
          ],
        },
      ],
    },
  ],
  "APIs & Tools": [
    "apis-tools/working-with-apis-tools",
    {
      APIs: [
        require("./docs/apis-tools/administration-api/sidebar-schema"),
        require("./docs/apis-tools/administration-sm-api/sidebar-schema"),
        require("./docs/apis-tools/camunda-api-rest/sidebar-schema"),
        {
          "Optimize API (REST)": [
            optimizeLink("Overview", "apis-tools/optimize-api/overview/"),
            optimizeLink(
              "Authentication",
              "apis-tools/optimize-api/optimize-api-authentication/"
            ),
            optimizeLink(
              "Tutorial",
              "apis-tools/optimize-api/optimize-api-tutorial/"
            ),

            {
              Configuration: [
                optimizeLink(
                  "Enable sharing",
                  "apis-tools/optimize-api/configuration/enable-sharing/"
                ),
                optimizeLink(
                  "Disable sharing",
                  "apis-tools/optimize-api/configuration/disable-sharing/"
                ),
              ],
            },

            {
              Dashboard: [
                optimizeLink(
                  "Get dashboard IDs",
                  "apis-tools/optimize-api/dashboard/get-dashboard-ids/"
                ),
                optimizeLink(
                  "Delete dashboards",
                  "apis-tools/optimize-api/dashboard/delete-dashboard/"
                ),
                optimizeLink(
                  "Export dashboard definitions",
                  "apis-tools/optimize-api/dashboard/export-dashboard-definitions/"
                ),
              ],
            },

            {
              Report: [
                optimizeLink(
                  "Get report IDs",
                  "apis-tools/optimize-api/report/get-report-ids/"
                ),
                optimizeLink(
                  "Delete reports",
                  "apis-tools/optimize-api/report/delete-report/"
                ),
                optimizeLink(
                  "Export report definitions",
                  "apis-tools/optimize-api/report/export-report-definitions/"
                ),
                optimizeLink(
                  "Export report result data",
                  "apis-tools/optimize-api/report/get-data-export/"
                ),
              ],
            },

            optimizeLink(
              "External variable ingestion",
              "apis-tools/optimize-api/external-variable-ingestion/"
            ),
            optimizeLink(
              "Health readiness",
              "apis-tools/optimize-api/health-readiness/"
            ),
            optimizeLink(
              "Import entities",
              "apis-tools/optimize-api/import-entities/"
            ),
            optimizeLink(
              "Variable labeling",
              "apis-tools/optimize-api/variable-labeling/"
            ),
          ],
        },
        require("./docs/apis-tools/web-modeler-api/sidebar-schema"),
        require("./docs/apis-tools/zeebe-api/sidebar-schema"),
        {
          Deprecated: [
            require("./docs/apis-tools/operate-api/sidebar-schema"),
            require("./docs/apis-tools/tasklist-api-rest/sidebar-schema"),
            {
              "Zeebe API (REST)": [
                "apis-tools/zeebe-api-rest/zeebe-api-rest-overview",
                "apis-tools/zeebe-api-rest/zeebe-api-rest-authentication",
                "apis-tools/zeebe-api-rest/zeebe-api-tutorial",
                {
                  Specifications: [
                    {
                      type: "doc",
                      id: "apis-tools/zeebe-api-rest/specifications/zeebe-rest-api",
                    },
                    {
                      type: "category",
                      label: "Cluster",
                      items: [
                        {
                          type: "doc",
                          id: "apis-tools/zeebe-api-rest/specifications/get-cluster-topology",
                          label: "Get cluster topology",
                          className: "api-method get",
                        },
                      ],
                    },
                    {
                      type: "category",
                      label: "User task",
                      items: [
                        {
                          type: "doc",
                          id: "apis-tools/zeebe-api-rest/specifications/complete-a-user-task",
                          label: "Complete a user task",
                          className: "api-method post",
                        },
                        {
                          type: "doc",
                          id: "apis-tools/zeebe-api-rest/specifications/assign-a-user-task",
                          label: "Assign a user task",
                          className: "api-method post",
                        },
                        {
                          type: "doc",
                          id: "apis-tools/zeebe-api-rest/specifications/update-a-user-task",
                          label: "Update a user task",
                          className: "api-method patch",
                        },
                        {
                          type: "doc",
                          id: "apis-tools/zeebe-api-rest/specifications/unassign-a-user-task",
                          label: "Unassign a user task",
                          className: "api-method delete",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      "Clients & SDKs": [
        {
          SDKs: [
            "apis-tools/node-js-sdk",
            {
              "Spring Zeebe": [
                "apis-tools/spring-zeebe-sdk/getting-started",
                "apis-tools/spring-zeebe-sdk/configuration",
              ],
            },
          ],
        },
        {
          Clients: [
            {
              "Java client": [
                "apis-tools/java-client/index",
                "apis-tools/java-client/authentication",
                "apis-tools/java-client/job-worker",
                "apis-tools/java-client/logging",
                "apis-tools/java-client/zeebe-process-test",
                {
                  Examples: [
                    "apis-tools/java-client-examples/index",
                    "apis-tools/java-client-examples/process-deploy",
                    "apis-tools/java-client-examples/process-instance-create",
                    "apis-tools/java-client-examples/process-instance-create-nonblocking",
                    "apis-tools/java-client-examples/process-instance-create-with-result",
                    "apis-tools/java-client-examples/decision-evaluate",
                    "apis-tools/java-client-examples/job-worker-open",
                    "apis-tools/java-client-examples/data-pojo",
                    "apis-tools/java-client-examples/cluster-topology-request",
                  ],
                },
              ],
            },
            {
              "Community clients": [
                "apis-tools/community-clients/index",
                {
                  "Zeebe clients": [
                    {
                      "CLI client": [
                        "apis-tools/community-clients/cli-client/index",
                        "apis-tools/community-clients/cli-client/cli-get-started",
                      ],
                      "Go client": [
                        "apis-tools/community-clients/go-client/index",
                        "apis-tools/community-clients/go-client/go-get-started",
                        "apis-tools/community-clients/go-client/job-worker",
                      ],
                    },
                  ],
                },
                "apis-tools/build-your-own-client",
              ],
            },
          ],
        },
      ],
    },
    require("./docs/apis-tools/frontend-development/sidebar-schema"),
    {
      Testing: [
        {
          "Camunda Process Test": [
            "apis-tools/testing/getting-started",
            "apis-tools/testing/assertions",
            "apis-tools/testing/utilities",
            "apis-tools/testing/connectors",
          ],
        },
      ],
    },
    {
      "Migration manuals": [
        "apis-tools/migration-manuals/migrate-to-camunda-user-tasks",
        "apis-tools/migration-manuals/migrate-to-camunda-api",
      ],
    },
  ],

  Reference: [
    "reference/overview",
    {
      type: "category",
      label: "Announcements",
      link: {
        type: "doc",
        id: "reference/announcements",
      },
      items: [
        "reference/announcements/announcements-880",
        "reference/announcements/announcements-870",
        "reference/announcements/announcements-860",
        "reference/announcements/announcements-850",
      ],
    },
    {
      type: "category",
      label: "Release notes",
      link: {
        type: "doc",
        id: "reference/release-notes/release-notes",
      },
      items: [
        "reference/release-notes/880",
        "reference/release-notes/870",
        "reference/release-notes/860",
        "reference/release-notes/850",
      ],
    },
    "reference/contact",
    "reference/supported-environments",
    "reference/dependencies",
    "reference/camunda-help-center",
    "reference/auto-updates",
    "reference/status",
    "reference/licenses",
    "reference/notices",
    "reference/release-policy",
    "reference/regions",
    "reference/usage-metrics",
    "reference/glossary",
  ],
  "Self-Managed": [
    "self-managed/about-self-managed",
    {
      type: "category",
      label: "Get started",
      link: {
        type: "doc",
        id: "self-managed/get-started/index",
      },
      items: [
        "self-managed/setup/deploy/local/c8run",
        "self-managed/setup/deploy/local/local-kubernetes-cluster",
      ],
    },
    {
      Install: [
        "self-managed/setup/overview",
        {
          type: "doc",
          label: "Helm",
          id: "self-managed/setup/install",
        },
        "self-managed/setup/deploy/other/docker",
        "self-managed/setup/deploy/local/manual",
      ],
    },
    {
      type: "category",
      label: "Deploy",
      link: {
        type: "doc",
        id: "self-managed/setup/index",
      },
      items: [
        {
          "Reference architecture": [
            "self-managed/reference-architecture/reference-architecture",
            "self-managed/reference-architecture/manual/manual",
          ],
        },
        {
          "Amazon (AWS)": [
            {
              type: "category",
              label: "Amazon EKS",
              link: {
                type: "doc",
                id: "self-managed/setup/deploy/amazon/amazon-eks/amazon-eks",
              },
              items: [
                "self-managed/setup/deploy/amazon/amazon-eks/eks-eksctl",
                "self-managed/setup/deploy/amazon/amazon-eks/eks-terraform",
                "self-managed/setup/deploy/amazon/amazon-eks/eks-helm",
                "self-managed/setup/deploy/amazon/amazon-eks/dual-region",
                "self-managed/setup/deploy/amazon/amazon-eks/irsa",
              ],
            },
            {
              type: "category",
              label: "ROSA",
              link: {
                type: "doc",
                id: "self-managed/setup/deploy/amazon/openshift/terraform-setup",
              },
              items: [
                "self-managed/setup/deploy/amazon/openshift/terraform-setup",
                "self-managed/setup/deploy/amazon/openshift/terraform-setup-dual-region",
              ],
            },
            {
              type: "category",
              label: "Amazon MarketPlace",
              link: {
                type: "doc",
                id: "self-managed/setup/deploy/amazon/aws-marketplace",
              },
              items: [],
            },
            "self-managed/setup/deploy/amazon/aws-ec2",
          ],
          "Microsoft (Azure)": [
            "self-managed/setup/deploy/azure/microsoft-aks",
          ],
          "Google (GCP)": ["self-managed/setup/deploy/gcp/google-gke"],
          "Red Hat (OpenShift)": [
            "self-managed/setup/deploy/openshift/redhat-openshift",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Update",
      link: {
        type: "doc",
        id: "self-managed/update/index",
      },
      items: [
        "self-managed/setup/upgrade",
        {
          type: "category",
          label: "Update by version",
          link: {
            type: "doc",
            id: "self-managed/operational-guides/update-guide/introduction",
          },
          items: [
            "self-managed/operational-guides/update-guide/870-to-880",
            "self-managed/operational-guides/update-guide/860-to-870",
            "self-managed/operational-guides/update-guide/850-to-860",
            "self-managed/operational-guides/update-guide/840-to-850",
            "self-managed/operational-guides/update-guide/830-to-840",
            "self-managed/operational-guides/update-guide/820-to-830",
            {
              Elasticsearch: [
                "self-managed/operational-guides/update-guide/elasticsearch/7-to-8",
              ],
            },
            {
              Keycloak: [
                "self-managed/operational-guides/update-guide/keycloak/keycloak-update",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Configure",
      link: {
        type: "doc",
        id: "self-managed/setup/guides/guides",
      },
      items: [
        "self-managed/setup/guides/accessing-components-without-ingress",
        "self-managed/setup/guides/ingress-setup",
        "self-managed/setup/guides/using-existing-keycloak",
        "self-managed/setup/guides/using-existing-elasticsearch",
        "self-managed/setup/guides/using-existing-opensearch",
        "self-managed/setup/guides/configure-db-custom-headers",
        "self-managed/setup/guides/connect-to-an-oidc-provider",
        "self-managed/setup/guides/air-gapped-installation",
        "self-managed/setup/guides/running-custom-connectors",
        "self-managed/setup/guides/multi-namespace-deployment",
        "self-managed/setup/guides/installing-payment-app-example",
      ],
    },
    {
      "Operational guides": [
        "self-managed/operational-guides/configure-multi-tenancy",
        {
          type: "category",
          label: "Backup and restore",
          link: {
            type: "doc",
            id: "self-managed/operational-guides/backup-restore/backup-and-restore",
          },
          items: [
            "self-managed/operational-guides/backup-restore/optimize-backup",
            "self-managed/operational-guides/backup-restore/operate-tasklist-backup",
            "self-managed/operational-guides/backup-restore/zeebe-backup-and-restore",
            "self-managed/operational-guides/backup-restore/modeler-backup-and-restore",
          ],
        },
        {
          type: "doc",
          label: "Configure components",
          id: "self-managed/operational-guides/application-configs",
        },
        {
          type: "doc",
          label: "Configure flow control",
          id: "self-managed/operational-guides/configure-flow-control/configure-flow-control",
        },
        {
          "Multi-region": [
            "self-managed/operational-guides/multi-region/dual-region-operational-procedure",
          ],
        },
        {
          Troubleshooting: [
            "self-managed/operational-guides/troubleshooting/troubleshooting",
            "self-managed/operational-guides/troubleshooting/log-levels",
          ],
        },
      ],
    },
    {
      Concepts: [
        {
          "Access control": [
            "self-managed/concepts/access-control/applications",
            "self-managed/concepts/access-control/resource-authorizations",
            "self-managed/concepts/access-control/user-task-access-restrictions",
          ],
        },
        "self-managed/concepts/exporters",
        {
          "Multi-region": ["self-managed/concepts/multi-region/dual-region"],
        },
        "self-managed/concepts/multi-tenancy",
        "self-managed/concepts/mapping-rules",
        "self-managed/concepts/elasticsearch-privileges",
        "self-managed/concepts/opensearch-privileges",
      ],
    },
    {
      Components: [
        {
          Console: [
            "self-managed/console-deployment/overview",
            "self-managed/console-deployment/installation",
            {
              Configuration: [
                "self-managed/console-deployment/configuration/configuration",
                "self-managed/console-deployment/configuration/ssl",
              ],
            },
            "self-managed/console-deployment/telemetry",
          ],
          Zeebe: [
            "self-managed/zeebe-deployment/zeebe-installation",
            {
              "Zeebe Gateway": [
                "self-managed/zeebe-deployment/zeebe-gateway/overview",
                "self-managed/zeebe-deployment/zeebe-gateway/interceptors",
                "self-managed/zeebe-deployment/zeebe-gateway/filters",
                "self-managed/zeebe-deployment/zeebe-gateway/job-streaming",
              ],
            },
            {
              Configuration: [
                "self-managed/zeebe-deployment/configuration/configuration",
                "self-managed/zeebe-deployment/configuration/logging",
                "self-managed/zeebe-deployment/configuration/gateway-health-probes",
                "self-managed/zeebe-deployment/configuration/environment-variables",
                "self-managed/zeebe-deployment/configuration/fixed-partitioning",
                "self-managed/zeebe-deployment/configuration/priority-election",
                "self-managed/zeebe-deployment/configuration/broker-config",
                "self-managed/zeebe-deployment/configuration/gateway-config",
              ],
            },
            {
              Security: [
                "self-managed/zeebe-deployment/security/security",
                "self-managed/zeebe-deployment/security/client-authorization",
                "self-managed/zeebe-deployment/security/secure-client-communication",
                "self-managed/zeebe-deployment/security/secure-cluster-communication",
              ],
            },
            {
              Operation: [
                "self-managed/zeebe-deployment/operations/zeebe-in-production",
                "self-managed/zeebe-deployment/operations/resource-planning",
                "self-managed/zeebe-deployment/operations/network-ports",
                "self-managed/zeebe-deployment/operations/setting-up-a-cluster",
                "self-managed/zeebe-deployment/operations/metrics",
                "self-managed/zeebe-deployment/operations/health",
                "self-managed/zeebe-deployment/operations/backpressure",
                "self-managed/zeebe-deployment/operations/disk-space",
                "self-managed/zeebe-deployment/operations/update-zeebe",
                "self-managed/zeebe-deployment/operations/rebalancing",
                "self-managed/zeebe-deployment/operations/management-api",
                "self-managed/zeebe-deployment/operations/backups",
                "self-managed/zeebe-deployment/operations/cluster-scaling",
              ],
            },
            {
              type: "category",
              label: "Exporters",
              link: {
                type: "doc",
                id: "self-managed/zeebe-deployment/exporters/exporters",
              },
              items: [
                "self-managed/zeebe-deployment/exporters/install-zeebe-exporters",
                "self-managed/zeebe-deployment/exporters/camunda-exporter",
                "self-managed/zeebe-deployment/exporters/elasticsearch-exporter",
                "self-managed/zeebe-deployment/exporters/opensearch-exporter",
              ],
            },
          ],
          Operate: [
            "self-managed/operate-deployment/install-and-start",
            "self-managed/operate-deployment/operate-configuration",
            "self-managed/operate-deployment/data-retention",
            "self-managed/operate-deployment/schema-and-migration",
            "self-managed/operate-deployment/importer-and-archiver",
            "self-managed/operate-deployment/operate-authentication",
            "self-managed/operate-deployment/usage-metrics",
          ],
          Tasklist: [
            "self-managed/tasklist-deployment/install-and-start",
            "self-managed/tasklist-deployment/tasklist-configuration",
            "self-managed/tasklist-deployment/tasklist-custom-styling",
            "self-managed/tasklist-deployment/data-retention",
            "self-managed/tasklist-deployment/importer-and-archiver",
            "self-managed/tasklist-deployment/tasklist-authentication",
            "self-managed/tasklist-deployment/usage-metrics",
          ],
          Connectors: [
            "self-managed/connectors-deployment/install-and-start",
            "self-managed/connectors-deployment/connectors-configuration",
          ],

          Optimize: [
            optimizeLink(
              "Installation",
              "self-managed/optimize-deployment/install-and-start/"
            ),

            {
              Configuration: [
                optimizeLink(
                  "Getting started",
                  "self-managed/optimize-deployment/configuration/getting-started/"
                ),

                {
                  "System configuration": [
                    optimizeLink(
                      "Overview",
                      "self-managed/optimize-deployment/configuration/system-configuration/"
                    ),
                    optimizeLink(
                      "Camunda 8 system configuration",
                      "self-managed/optimize-deployment/configuration/system-configuration-platform-8/"
                    ),
                  ],
                },

                optimizeLink(
                  "Logging",
                  "self-managed/optimize-deployment/configuration/logging/"
                ),
                optimizeLink(
                  "Security instructions",
                  "self-managed/optimize-deployment/configuration/security-instructions/"
                ),
                optimizeLink(
                  "Shared Elasticsearch/OpenSearch cluster",
                  "self-managed/optimize-deployment/configuration/shared-elasticsearch-cluster/"
                ),
                optimizeLink(
                  "History cleanup",
                  "self-managed/optimize-deployment/configuration/history-cleanup/"
                ),
                optimizeLink(
                  "Localization",
                  "self-managed/optimize-deployment/configuration/localization/"
                ),
                optimizeLink(
                  "Object and list variable support",
                  "self-managed/optimize-deployment/configuration/object-variables/"
                ),
                optimizeLink(
                  "Multi-tenancy",
                  "self-managed/optimize-deployment/configuration/multi-tenancy/"
                ),
              ],
            },
          ],

          Identity: [
            "self-managed/identity/what-is-identity",
            "self-managed/identity/getting-started/install-identity",
            {
              "User guide": [
                {
                  Configuration: [
                    "self-managed/identity/user-guide/configuration/making-identity-production-ready",
                    "self-managed/identity/user-guide/configuration/configure-external-identity-provider",
                    "self-managed/identity/user-guide/configuration/configure-logging",
                    "self-managed/identity/user-guide/configuration/connect-to-an-existing-keycloak",
                  ],
                },
                {
                  Roles: [
                    "self-managed/identity/user-guide/roles/add-assign-role",
                    "self-managed/identity/user-guide/roles/add-assign-permission",
                  ],
                },
                {
                  Groups: [
                    "self-managed/identity/user-guide/groups/create-group",
                    "self-managed/identity/user-guide/groups/assign-users-roles-to-group",
                  ],
                },
                {
                  Authorizations: [
                    "self-managed/identity/user-guide/authorizations/managing-resource-authorizations",
                    "self-managed/identity/user-guide/authorizations/managing-user-access",
                    "self-managed/identity/user-guide/authorizations/generating-m2m-tokens",
                  ],
                },
                {
                  Tenants: [
                    "self-managed/identity/user-guide/tenants/managing-tenants",
                  ],
                },
                {
                  "Mapping rules": [
                    "self-managed/identity/user-guide/mapping-rules/managing-mapping-rules",
                  ],
                },
                {
                  "Additional features": [
                    "self-managed/identity/user-guide/additional-features/adding-an-api",
                    "self-managed/identity/user-guide/additional-features/incorporate-applications",
                  ],
                },
              ],
            },
            {
              Deployment: [
                "self-managed/identity/deployment/configuration-variables",
                "self-managed/identity/deployment/application-monitoring",
                "self-managed/identity/deployment/starting-configuration-for-identity",
                "self-managed/identity/deployment/resource-management",
              ],
            },
            "self-managed/identity/troubleshooting/troubleshoot-identity",
          ],
        },
        {
          Modeler: [
            {
              "Web Modeler": [
                "self-managed/modeler/web-modeler/installation",
                {
                  Configuration: [
                    "self-managed/modeler/web-modeler/configuration/configuration",
                    "self-managed/modeler/web-modeler/configuration/database",
                    "self-managed/modeler/web-modeler/configuration/identity",
                    "self-managed/modeler/web-modeler/configuration/logging",
                    "self-managed/modeler/web-modeler/configuration/ssl",
                  ],
                  Troubleshooting: [
                    "self-managed/modeler/web-modeler/troubleshooting/troubleshoot-database-connection",
                    "self-managed/modeler/web-modeler/troubleshooting/troubleshoot-zeebe-connection",
                    "self-managed/modeler/web-modeler/troubleshooting/troubleshoot-missing-data",
                    "self-managed/modeler/web-modeler/troubleshooting/troubleshoot-proxy-configuration",
                  ],
                },
              ],
            },
            {
              "Desktop Modeler": [
                "self-managed/modeler/desktop-modeler/deploy-to-self-managed",
              ],
            },
          ],
        },
      ],
    },
  ],
};
