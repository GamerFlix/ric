# fvtt-dual-track-module
Template repo for FVTT module development using a dual track (release/beta) workflow. 

## Setup
When cloning or using this as a template, if you choose to only clone the `master` branch, be sure to create and push a branch named `next` in order for the pre-release workflow steps to function correctly.

If cloning all branches, it may be wise to delete all branches other than `master` and `next`. Some branches may contain experimental or non-functioning code.

This template also includes an (opinionated) module structure inside of `scripts/`. Feel free to dismiss. However, top level folder/file changes should be reflected appropriately in the `main.yml` workflow.

## Creating a Release
When creating a release package, the primary consideration is the tag name used. This tag name will be used as the module's version and will be used to compare against previous versions to determine if an update is needed for a user. Semantic versioning is mostly supported by foundry, e.g. `0.1.0`, `1.2.3`, `1.2+3`. Check your versioning scheme within foundry via is `isNewerVersion` helper.

Once a few minutes have passed after release creation, two new files will be attached to the release. These are the release artifacts named `module.json` and `module.zip`. Point the foundry package management url to the `module.json` for that specific release. The release creation workflow ensures that users will always update to the latest release package.
