# fvtt-dual-track-module (BETA BRANCH)

Create releases for this beta track by publishing a "pre-release".

Consider versioning scheme for beta branches such that foundry correctly identifies a beta for v1.1.0 to be _older_ than a full release for v1.1.0. For example, a beta for version 1.1.0 could be labeled as:
* `1.1.!0` - using the fact that `!` is evaluated as less than _all_ alphanumeric characters.
* `beta-1.1.0` - using the fact that letters evaluate lower than numbers.

