# Documentation Guidelines

## PRs for every change

All changes have to be done in a separate Branch. As soon as the changes are done please open a PR. A Github Action runs with every commit to a Branch and checks if the documentation can be build (including a broken links check).

PRs should be in a draft status while being actively worked. Removing a PR from draft status indicates they are ready for review (by a technical writer).

## Labeling PRs

PRs can be labeled “hold” by engineering teams for any reason, including ongoing conversations, coordination across teams or departments, or anything that’s not obvious within the discussion or description of the PR.

PRs labeled “bug” will be merged and released as immediately as possible.

## Not all PRs require an issue

In the spirit of "Always Progress", if you are confident you know what change needs to be made a separate issue on the topic is not required. However, if you have an idea that needs to go into the backlog, creating an issue instead of a PR is the best way to go.

## Structure

- Name Markdown files according to the title. This makes it easier to find a file. Example: **Introduction to Camunda Platform 8** --> `introduction-to-camunda-platform-8.md`. Avoid non-alphanumeric characters in titles. Use the file name as internal document id to reference in [the appropriate sidebars file](#sidebar-navigation).
- Sub categories have to be placed in their own sub directories. Example: Guides/Update Guide can be found in `docs/guides/update-guide`.

## Instances: Docs vs Optimize

Due to a difference in version numbers, the documentation is split into [multiple Docusaurus "instances"](https://docusaurus.io/docs/docs-multi-instance). Documentation specific to Optimize lives in the `optimize` instance, and all other documentation lives in the main `docs` instance.

## Versions

[Each instance of the documentation](#instances-docs-vs-optimize) contains documentation for multiple versions:

| Instance   | Version(s)               | Source path                                                         |
| ---------- | ------------------------ | ------------------------------------------------------------------- |
| `docs`     | Next                     | [/docs/](../docs/)                                                  |
| `docs`     | 8.1, 8.0, 1.3, ...       | [/versioned_docs/version-\*/](../versioned_docs/)                   |
| `optimize` | Next                     | [/optimize/](../optimize/)                                          |
| `optimize` | 3.9.0, 3.8.0, 3.7.0, ... | [/optimize_versioned_docs/version-\*/](../optimize_versioned_docs/) |

When edits are intended to apply to both the current version _and beyond_, they should be made in both the most recent versioned folder and the "Next" version folder.

### Version alignment

Specific Optimize versions are aligned with Camunda Platform versions as follows:

| Camunda Platform version | Optimize version |
| ------------------------ | ---------------- |
| 8.1                      | 3.9.0            |
| 8.0                      | 3.8.0            |
| 1.3                      | 3.7.0            |

## Sidebar navigation

[Sidebar navigation](https://docusaurus.io/docs/sidebar) of the documentation is managed in the sidebars files. [Each instance of the documentation](#instances-docs-vs-optimize) has its own sidebars file:

| Instance   | Version(s)               | Sidebars path                                                                             |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `docs`     | Next                     | [/docs/sidebars.js](../docs/sidebars.js)                                                  |
| `docs`     | 8.1, 8.0, 1.3, ...       | [/versioned_sidebars/version-\*-sidebars.json](../versioned_sidebars/)                    |
| `optimize` | Next                     | [/optimize/sidebars.js](../optimize/sidebars.js)                                          |
| `optimize` | 3.9.0, 3.8.0, 3.7.0, ... | [/optimize_versioned_sidebars/version-\*-sidebars.json/](../optimize_versioned_sidebars/) |

### Sidebar items

The large object in each sidebars file contains two different types of items:

- Items within the same [documentation instance](#instances-docs-vs-optimize) are [linked by the path to the target .md file](https://github.com/camunda/camunda-platform-docs/blob/89993fbc1446c203324f38139ae7eb40e19b14ac/versioned_sidebars/version-8.1-sidebars.json#L5):
  ```json
  "guides/introduction-to-camunda",
  ```
- Items in the opposite [documentation instance](#instances-docs-vs-optimize) are [linked by an object containing the title and URL of the target document](https://github.com/camunda/camunda-platform-docs/blob/89993fbc1446c203324f38139ae7eb40e19b14ac/versioned_sidebars/version-8.1-sidebars.json#L331-L335):
  ```json
  {
    "type": "link",
    "label": "What is Optimize?",
    "href": "/optimize/components/what-is-optimize/"
  },
  ```

> **Note**
> The "next" versions of the docs are JavaScript rather than JSON. As such, [cross-instance sidebar items in these files](https://github.com/camunda/camunda-platform-docs/blob/main/sidebars.js#L266) call a helper function instead of emitting the entire cross-instance object for each item.

### Synchronization of sidebars

Several sections of the sidebar navigation are shared across the Optimize and main sections of the docs: Components, Self-Managed, and APIs & Clients. For these sections, the structure of the sidebars should always match across instances. [When they drift](./versioning.md#sidebar-drift), it appears to the user as differences in the sidebar navigation depending on which page they're viewing.

Any PRs that make a structural change to one of the instance's sidebars file in a shared section should make the same structural change to the other instance's sidebars file. This typically appears as a link to the target .md file in one file, and an object containing the target title and URL in the other file.

> **Note**
> Changes outside of the shared sections do not need to be synchronized to the corresponding Optimize sidebars file.

## Internal links

When linking internally from one document to another, follow these guidelines:

- if the source and target document are within the same instance (i.e. both are in `docs` or both are in `optimize`):
  - Use a relative path to the target markdown file if it is in the same subtree as the source file. [See example](https://github.com/camunda/camunda-platform-docs/blob/930a0c384b48be27d0bc66216015404f67716f61/docs/components/console/introduction-to-console.md?plain=1#L10).
  - Use an absolute path to the target markdown file if it is in a different subtree than the source file. [See example](https://github.com/camunda/camunda-platform-docs/blob/930a0c384b48be27d0bc66216015404f67716f61/docs/apis-clients/community-clients/spring.md?plain=1#L8).
  - Always include the `.md` extension in the path.
- if the source and target document are in different instances (i.e. one is in `docs` and the other is in `optimize`):
  - If the source is in `docs` and the target is in `optimize`, use the `$optimize$` token to prefix the URL. [See example](https://github.com/camunda/camunda-platform-docs/blob/930a0c384b48be27d0bc66216015404f67716f61/docs/guides/setting-up-development-project.md?plain=1#L17).
  - If the source is in `optimize` and the target is in `docs`, use the `$docs$` token to prefix the URL. [See example](https://github.com/camunda/camunda-platform-docs/blob/930a0c384b48be27d0bc66216015404f67716f61/optimize/components/what-is-optimize.md?plain=1#L8).
  - Use the browser-facing _URL_ to the target document, instead of the path to the target's `.md` file.
  - Do not include the `.md` extension on the target path.

## Adding a new documentation page

1. Select the corresponding directory.
2. Add the document id to [the corresponding sidebars file](#sidebar-navigation). [Example](https://github.com/camunda/camunda-platform-docs/blob/main/versioned_sidebars/version-8.1-sidebars.json#L47):
   ```json
   " components/components-overview",
   ```
3. If the doc is [in one of the shared sections](#synchronization-of-sidebars), add a parallel change to [the other instance's corresponding sidebars file](#sidebar-navigation). [Example](https://github.com/camunda/camunda-platform-docs/blob/main/optimize_versioned_sidebars/version-3.9.0-sidebars.json#L3-L7):
   ```json
   {
     "type": "link",
     "label": "Overview Components",
     "href": "/docs/components/"
   },
   ```

## Moving an existing page

1. Identify the page, pages, or directory and relocate it in the file structure.
2. Update [the corresponding sidebars file(s)](#sidebar-navigation) to fit the new location.
3. If the doc is [in one of the shared sections](#synchronization-of-sidebars), update [the opposite instance's corresponding sidebars file(s)](#sidebar-navigation).
4. Add necessary redirect/rewrite rules to the top of `.htaccess`.

> **Note**
> The redirects/rewrite rules added to `.htaccess` will not work when running the documentation locally. You can use online tooling to help with this (e.g. https://htaccess.madewithlove.com/).

## Remove an existing page

1. Identify the page, pages, or directory and delete it in the file structure.
2. Update [the corresponding sidebars file(s)](#sidebar-navigation).
3. If the doc is [in one of the shared sections](#synchronization-of-sidebars), update [the opposite instance's corresponding sidebars file(s)](#sidebar-navigation).
4. Add necessary redirect/rewrite rules to the top of `.htaccess` to redirect users to appropriate relevant content on another page.

> **Note**
> The redirects/rewrite rules added to `.htaccess` will not work when running the documentation locally. You can use online tooling to help with this (e.g. https://htaccess.madewithlove.com/).

## Review Process

After the proposed change is finished open a GitHub PR and assign at least one reviewer, it is good to pick a reviewer who is expert in the matter of the change. If unsure about who to pick choose one of the corresponding team representatives, and they will take care of delegating the issue:

- Console: @ultraschuppi
- Modeler: @camunda/modeling-dev
- Zeebe: @npepinpe
- Operate/Tasklist: @ralfpuchert
- Optimize: @RomanJRW
- DevRel/DevEx: @akeller
- Product Management: @felix-mueller
- Documentation: @christinaausley (fallback: @akeller)
- Documentation infrastructure: @pepopowitz (fallback: @akeller)
- Fallback: @menski

In case you don't know who to assign for an engineering review choose @menski and he will delegate.

As a reviewer feel free to merge any PR which you feel comfortable with after your review. If you have questions, concerns, or feel that you are not the right person to review the PR please make this transparent to the PR author so they can clarify this.

[versioned-source]: https://github.com/camunda/camunda-platform-docs/tree/main/versioned_docs
[next-source]: https://github.com/camunda/camunda-platform-docs/tree/main/docs
[versioned-sidebars]: https://github.com/camunda/camunda-platform-docs/tree/main/versioned_sidebars
[next-sidebars]: https://github.com/camunda/camunda-platform-docs/blob/main/sidebars.js
