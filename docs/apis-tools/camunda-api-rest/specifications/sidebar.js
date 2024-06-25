module.exports = [
  {
    type: "doc",
    id: "apis-tools/camunda-api-rest/specifications/camunda-8-rest-api",
  },
  {
    type: "category",
    label: "Cluster",
    items: [
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/get-cluster-topology",
        label: "Get cluster topology",
        className: "api-method get",
      },
    ],
  },
  {
    type: "category",
    label: "Job",
    items: [
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/activate-jobs",
        label: "Activate jobs",
        className: "api-method post",
      },
    ],
  },
  {
    type: "category",
    label: "User task",
    items: [
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/complete-a-user-task",
        label: "Complete a user task",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/assign-a-user-task",
        label: "Assign a user task",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/update-a-user-task",
        label: "Update a user task",
        className: "api-method patch",
      },
      {
        type: "doc",
        id: "apis-tools/camunda-api-rest/specifications/unassign-a-user-task",
        label: "Unassign a user task",
        className: "api-method delete",
      },
    ],
  },
];
