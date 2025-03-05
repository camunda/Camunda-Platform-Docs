---
id: terraform-setup
title: "Deploy a ROSA HCP Cluster with Terraform"
description: "Deploy Red Hat OpenShift on AWS using a Terraform module for a quick Camunda 8 setup."
---

<!-- (!) Note: Please ensure that this guide maintains a consistent structure and presentation style throughout, as with ../amazon-eks/terraform-setup.md. The user should have a similar experience when reading both guides. -->

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

This guide provides a detailed tutorial for deploying a [Red Hat OpenShift on AWS (ROSA) cluster with Hosted Control Plane (HCP)](https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html-single/architecture/index#architecture-overview) capabilities. It is specifically tailored for deploying Camunda 8 using Terraform, a widely-used Infrastructure as Code (IaC) tool.

We recommend this guide for building a robust and sustainable infrastructure. However, if you are looking for a quicker trial or proof of concept, or if your needs aren't fully met by our module, consider following the official [ROSA Quickstart Guide](https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/getting_started/rosa-quickstart-guide-ui#rosa-quickstart-guide-ui).

This guide aims to help you leverage IaC to streamline and reproduce your cloud infrastructure setup. While it covers the essentials for deploying an ROSA HCP cluster, for more advanced use cases, please refer to the official [Red Hat OpenShift on AWS Documentation](https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4).

:::tip

If you are completely new to Terraform and the idea of IaC, read through the [Terraform IaC documentation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code) and give their [interactive quick start](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code#quick-start) a try for a basic understanding.

:::

## Requirements

- A [Red Hat Account](https://www.redhat.com/) to create the Red Hat OpenShift cluster.
- An [AWS account](https://docs.aws.amazon.com/accounts/latest/reference/accounts-welcome.html) to create any resources within AWS.
- [AWS CLI (2.17+)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), a CLI tool for creating AWS resources.
- [Terraform (1.9+)](https://developer.hashicorp.com/terraform/downloads)
- [kubectl (1.30+)](https://kubernetes.io/docs/tasks/tools/#kubectl) to interact with the cluster.
- [ROSA CLI](https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/getting_started/rosa-quickstart-guide-ui#rosa-getting-started-environment-setup_rosa-quickstart-guide-ui) to interact with the cluster.
- [jq (1.7+)](https://jqlang.github.io/jq/download/) to interact with some Terraform variables.
- [AWS Quotas](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html)
  - Ensure at least **3 Elastic IPs** (one per availability zone).
  - Verify quotas for **VPCs, EC2 instances, and storage**.
  - Request increases if needed via the AWS console ([guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html)), costs are only for resources used.
- This guide uses GNU/Bash for all the shell commands listed.

### Considerations

This setup provides a foundational starting point for working with Camunda 8, though it is not optimized for peak performance. It serves as a solid initial step in preparing a production environment by leveraging [Infrastructure as Code (IaC) tools](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code).

Terraform can initially appear complex. If you're new to it, you might want to start by considering trying out the [Red Hat OpenShift on AWS UI-based tutorial](https://docs.redhat.com/en/documentation/red_hat_openshift_service_on_aws/4/html/tutorials/getting-started-with-rosa#creating-account-wide-roles). This guide will show you what resources are created and how they interact with each other.

If you require managed services for PostgreSQL Aurora or OpenSearch, you can refer to the definitions provided in the [EKS setup with Terraform](../amazon-eks/terraform-setup.md) guide. However, please note that these configurations may need adjustments to fit your specific requirements and have not been tested. By default, this guide assumes that the database services (PostgreSQL and Elasticsearch) integrated into the default chart will be used.

For testing Camunda 8 or developing against it, you might consider signing up for our [SaaS offering](https://camunda.com/platform/). If you already have a Red Hat OpenShift cluster on AWS, you can skip ahead to the [Helm setup guide](/self-managed/setup/deploy/openshift/redhat-openshift.md).

To keep this guide concise, we provide links to additional documentation covering best practices, allowing you to explore each topic in greater depth.

:::danger Cost management

Following this guide will incur costs on your cloud provider account and your Red Hat account, specifically for the managed OpenShift service, OpenShift worker nodes running in EC2, the hosted control plane, Elastic Block Storage (EBS), and Route 53. For more details, refer to [ROSA AWS pricing](https://aws.amazon.com/rosa/pricing/) and the [AWS Pricing Calculator](https://calculator.aws/#/) as total costs vary by region.

:::

### Variants

Unlike the [EKS Terraform setup](../amazon-eks/terraform-setup.md), we currently support only one main variant of this setup:

- The **standard installation** uses a username and password connection for Camunda components (or relies solely on network isolation for certain components). This option is straightforward and easier to implement, making it ideal for environments where simplicity and rapid deployment are priorities, or where network isolation provides adequate security.

- The second variant, **IRSA** (IAM Roles for Service Accounts), may work but has not been tested. If you’re interested in setting it up, please refer to the EKS guide as a foundational resource.

### Outcome

<!-- The following diagram should be exported as an image and as a PDF from the sources https://miro.com/app/board/uXjVL-6SrPc=/ --->
<!-- To export: click on the frame > "Export Image" > as PDF and as JPG (low res), then save it in the ./assets/ folder --->

_Infrastructure diagram for a single region ROSA setup (click on the image to open the PDF version)_
[![Infrastructure Diagram ROSA Single-Region](./assets/rosa-single-region.jpg)](./assets/rosa-single-region.pdf)

Following this tutorial and steps will result in:

- A [Red Hat OpenShift with Hosted Control Plane](https://www.redhat.com/en/topics/containers/what-are-hosted-control-planes#rosa-with-hcp) cluster running the latest ROSA version with six nodes ready for Camunda 8 installation.
- The [EBS CSI driver](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) is installed and configured, which is used by the Camunda 8 Helm chart to create [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

## 1. Configure AWS and initialize Terraform

### Terraform prerequisites

To manage the infrastructure for Camunda 8 on AWS using Terraform, we need to set up Terraform's backend to store the state file remotely in an S3 bucket. This ensures secure and persistent storage of the state file.

:::note
Advanced users may want to handle this part differently and use a different backend. The backend setup provided is an example for new users.
:::

#### Set up AWS authentication

The [AWS Terraform provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) is required to create resources in AWS. Before you can use the provider, you must authenticate it using your AWS credentials.

:::caution Ownership of the created resources

A user who creates resources in AWS will always retain administrative access to those resources, including any Kubernetes clusters created. It is recommended to create a dedicated [AWS IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html) for Terraform purposes, ensuring that the resources are managed and owned by that user.

:::

You can further change the region and other preferences and explore different [authentication](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication-and-configuration) methods:

- For development or testing purposes you can use the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html). If you have configured your AWS CLI, Terraform will automatically detect and use those credentials.
  To configure the AWS CLI:

  ```bash
  aws configure
  ```

  Enter your `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, region, and output format. These can be retrieved from the [AWS Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).

- For production environments, we recommend the use of a dedicated IAM user. Create [access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) for the new IAM user via the console, and export them as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

#### Create an S3 bucket for Terraform state management

Before setting up Terraform, you need to create an S3 bucket that will store the state file. This is important for collaboration and to prevent issues like state file corruption.

To start, set the region as an environment variable upfront to avoid repeating it in each command:

```bash
export AWS_REGION=<your-region>
```

Replace `<your-region>` with your chosen AWS region (for example, `eu-central-1`).

Now, follow these steps to create the S3 bucket with versioning enabled:

1. Open your terminal and ensure the AWS CLI is installed and configured.

1. Run the following command to create an S3 bucket for storing your Terraform state. Make sure to use a unique bucket name and set the `AWS_REGION` environment variable beforehand:

   ```bash
   # Replace "my-rosa-tf-state" with your unique bucket name
   export S3_TF_BUCKET_NAME="my-rosa-tf-state"

   aws s3api create-bucket --bucket "$S3_TF_BUCKET_NAME" --region "$AWS_REGION" \
     --create-bucket-configuration LocationConstraint="$AWS_REGION"
   ```

1. Enable versioning on the S3 bucket to track changes and protect the state file from accidental deletions or overwrites:

   ```bash
   aws s3api put-bucket-versioning --bucket "$S3_TF_BUCKET_NAME" --versioning-configuration Status=Enabled --region "$AWS_REGION"
   ```

1. Secure the bucket by blocking public access:

   ```bash
   aws s3api put-public-access-block --bucket "$S3_TF_BUCKET_NAME" --public-access-block-configuration \
     "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" --region "$AWS_REGION"
   ```

1. Verify versioning is enabled on the bucket:

   ```bash
   aws s3api get-bucket-versioning --bucket "$S3_TF_BUCKET_NAME" --region "$AWS_REGION"
   ```

This S3 bucket will now securely store your Terraform state files with versioning enabled.

#### Create a `config.tf` with the following setup

Once the S3 bucket is created, configure your `config.tf` file to use the S3 backend for managing the Terraform state:

```hcl reference
https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region/config.tf
```

#### Initialize Terraform

Once your `config.tf` and authentication are set up, you can initialize your Terraform project. The previous steps configured a dedicated S3 Bucket (`S3_TF_BUCKET_NAME`) to store your state, and the following creates a bucket key that will be used by your configuration.

Configure the backend and download the necessary provider plugins:

```bash
export S3_TF_BUCKET_KEY="camunda-terraform/terraform.tfstate"

echo "Storing terraform state in s3://$S3_TF_BUCKET_NAME/$S3_TF_BUCKET_KEY"

terraform init -backend-config="bucket=$S3_TF_BUCKET_NAME" -backend-config="key=$S3_TF_BUCKET_KEY"
```

Terraform will connect to the S3 bucket to manage the state file, ensuring remote and persistent storage.

### OpenShift cluster module setup

This module sets up the foundational configuration for ROSA HCP and Terraform usage.

We will leverage [Terraform modules](https://developer.hashicorp.com/terraform/language/modules), which allow us to abstract resources into reusable components, simplifying infrastructure management.

The [Camunda-provided module](https://github.com/camunda/camunda-deployment-references/tree/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region) is publicly available and serves as a robust starting point for deploying a Red Hat OpenShift cluster on AWS using a Hosted Control Plane. It is highly recommended to review this module before implementation to understand its structure and capabilities.

Please note that this module is based on the official [ROSA HCP Terraform module documentation](https://docs.openshift.com/rosa/rosa_hcp/terraform/rosa-hcp-creating-a-cluster-quickly-terraform.html). It is presented as an example for running Camunda 8 in ROSA. For advanced use cases or custom setups, we encourage you to use the official module, which includes vendor-supported features.

#### Set up ROSA authentication

To set up a ROSA cluster, certain prerequisites must be configured on your AWS account. Below is an excerpt from the [official ROSA planning prerequisites checklist](https://docs.openshift.com/rosa/rosa_planning/rosa-cloud-expert-prereq-checklist.html):

1. Verify that your AWS account is correctly configured:

   ```bash
   aws sts get-caller-identity
   ```

1. Check if the ELB service role exists, as if you have never created a load balancer in your AWS account, the role for Elastic Load Balancing (ELB) might not exist yet:

   ```bash
   aws iam get-role --role-name "AWSServiceRoleForElasticLoadBalancing"
   ```

   If it doesn't exist, create it:

   ```bash
   aws iam create-service-linked-role --aws-service-name "elasticloadbalancing.amazonaws.com"
   ```

1. Create a Red Hat Hybrid Cloud Console account if you don’t already have one: [Red Hat Hybrid Cloud Console](https://console.redhat.com/).

1. Enable ROSA on your AWS account via the [AWS Console](https://console.aws.amazon.com/rosa/).

1. Enable HCP ROSA on [AWS Marketplace](https://docs.openshift.com/rosa/cloud_experts_tutorials/cloud-experts-rosa-hcp-activation-and-account-linking-tutorial.html):

   - Navigate to the ROSA console: [AWS ROSA Console](https://console.aws.amazon.com/rosa).
   - Choose **Get started**.
   - On the **Verify ROSA prerequisites** page, select **I agree to share my contact information with Red Hat**.
   - Choose **Enable ROSA**.

   **Note**: Only a single AWS account can be associated with a Red Hat account for service billing.

1. Install the ROSA CLI from the [OpenShift AWS Console](https://console.redhat.com/openshift/downloads#tool-rosa).

1. Get an API token, go to the [OpenShift Cluster Management API Token](https://console.redhat.com/openshift/token/rosa), click **Load token**, and save it. Use the token to log in with ROSA CLI:

   ```bash
   export RHCS_TOKEN="<yourToken>"
   rosa login --token="$RHCS_TOKEN"

   # Verify the login
   rosa whoami
   ```

1. Verify your AWS quotas:

   ```bash
   rosa verify quota --region="$AWS_REGION"
   ```

   **Note**: This may fail due to organizational policies.

1. Create the required account roles:

   ```bash
   rosa create account-roles --mode auto
   ```

1. Verify your AWS quotas, and if quotas are insufficient, consult the following:

   - [Provisioned AWS Infrastructure](https://docs.openshift.com/rosa/rosa_planning/rosa-sts-aws-prereqs.html#rosa-aws-policy-provisioned_rosa-sts-aws-prereqs)
   - [Required AWS Service Quotas](https://docs.openshift.com/rosa/rosa_planning/rosa-sts-required-aws-service-quotas.html#rosa-sts-required-aws-service-quotas)

1. Ensure the `oc` CLI is installed. If it’s not already installed, follow the [official ROSA oc installation guide](https://docs.openshift.com/rosa/cli_reference/openshift_cli/getting-started-cli.html#cli-getting-started):

   ```bash
   rosa verify openshift-client
   ```

#### Set up the ROSA cluster module

1. Create a `cluster.tf` file in the same directory as your `config.tf` file.
2. Add the following content to your newly created `cluster.tf` file to utilize the provided module:

   :::note Configure your cluster

   Please customize the cluster name, availability zones, with the values you previously retrieved from the Red Hat Console.
   Additionally, provide a secure username and password for the cluster administrator.

   Ensure that you have set the environment variable `RHCS_TOKEN` with your [OpenShift Cluster Management API Token](https://console.redhat.com/openshift/token/rosa).

   By default, this cluster will be accessible from the internet. If you prefer to restrict access, please refer to the official documentation of the module.

   :::

   ```hcl reference
   https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region/cluster.tf

   ```

   :::caution Camunda Terraform module

   This ROSA module is based on the [official Red Hat Terraform module for ROSA HCP](https://registry.terraform.io/modules/terraform-redhat/rosa-hcp/rhcs/latest). Please be aware of potential differences and choices in implementation between this module and the official one.

   We invite you to consult the [Camunda ROSA module documentation](https://github.com/camunda/camunda-deployment-references/tree/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region/README.md) for more information.

   :::

3. [Initialize](#initialize-terraform) Terraform for this module using the following Terraform command:

   ```bash
   terraform init -backend-config="bucket=$S3_TF_BUCKET_NAME" -backend-config="key=$S3_TF_BUCKET_KEY"
   ```

4. Configure user access to the cluster. By default, the user who creates the OpenShift cluster has administrative access, if you want to grant access to other users, please follow the [Red Hat documentation for granting admin rights to users](https://docs.openshift.com/rosa/cloud_experts_tutorials/cloud-experts-getting-started/cloud-experts-getting-started-admin-rights.html) when the cluster is created.

5. Customize the cluster setup. The module offers various input options that allow you to further customize the cluster configuration. For a comprehensive list of available options and detailed usage instructions, refer to the [ROSA module documentation](https://github.com/camunda/camunda-deployment-references/tree/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region/README.md).

### Define outputs

**Terraform** allows you to define outputs, which make it easier to retrieve important values generated during execution, such as cluster endpoints and other necessary configurations for Helm setup.

Each module that you have previously set up contains an output definition at the end of the file. You can adjust them to your needs.

### Execution

:::note Secret management

We strongly recommend managing sensitive information such as the OpenSearch, Aurora username and password using a secure secrets management solution like HashiCorp Vault. For details on how to inject secrets directly into Terraform via Vault, see the [Terraform Vault Secrets Injection Guide](https://developer.hashicorp.com/terraform/tutorials/secrets/secrets-vault).

:::

1. Open a terminal in the created Terraform folder where `config.tf` and other `.tf` files are.

2. Plan the configuration files:

   ```bash
   terraform plan -out cluster.plan # describe what will be created
   ```

3. After reviewing the plan, you can confirm and apply the changes.

   ```bash
   terraform apply cluster.plan     # apply the creation
   ```

Terraform will now create the OpenShift cluster with all the necessary configurations. The completion of this process may require approximately 20-30 minutes for each component.

### Reference files

Depending on the installation path you have chosen, you can find the reference files used on this page:

- **Standard installation:** [Reference Files](https://github.com/camunda/camunda-deployment-references/blob/feature/integrate-tests-rosa/aws/openshift/rosa-hcp-single-region/)

## 2. Preparation for Camunda 8 installation

### Access the created OpenShift cluster

You can access the created OpenShift cluster using the following steps:

Set up the required environment variables:

```shell
export CLUSTER_NAME="$(terraform console <<<local.rosa_cluster_name | jq -r)"
export CLUSTER_API_URL=$(terraform output -raw openshift_api_url)
export CLUSTER_ADMIN_USERNAME="$(terraform console <<<local.rosa_admin_username | jq -r)"
export CLUSTER_ADMIN_PASSWORD="$(terraform console <<<local.rosa_admin_password | jq -r)"
```

If you want to give cluster administrator access to the created user, this is not required for a standard installation but can be useful for debugging:

```shell
rosa grant user cluster-admin --cluster="$CLUSTER_NAME" --user="$CLUSTER_ADMIN_USERNAME"
```

Log in to the OpenShift cluster:

```shell
oc login -u "$CLUSTER_ADMIN_USERNAME" "$CLUSTER_API_URL" -p "$CLUSTER_ADMIN_PASSWORD"
```

Clean up and configure the kubeconfig context:

```shell
oc config rename-context $(oc config current-context) "$CLUSTER_NAME"
oc config use-context "$CLUSTER_NAME"
```

Verify your connection to the cluster with `oc`:

```shell
oc get nodes
```

Create a project for Camunda using `oc`:

```shell
oc new-project camunda
```

In the remainder of the guide, the `camunda` namespace part of the camunda project will be referenced to create the required resources in the Kubernetes cluster, such as secrets or one-time setup jobs.

## 3. Install Camunda 8 using the Helm chart

Now that you've exported the necessary values, you can proceed with installing Camunda 8 using Helm charts. Follow the guide [Camunda 8 on OpenShift](/self-managed/setup/deploy/openshift/redhat-openshift.md) for detailed instructions on deploying the platform to your OpenShift cluster.
