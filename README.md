# Helm Semver Plugin

A Helm plugin to update Chart.yaml version based on semantic versioning.

## Installation

```bash
helm plugin install <path-to-plugin>
```

## Usage

```bash
helm semver [major|minor|patch|premajor|preminor|prepatch|prerelease] -c <path-to-chart> --preid <identifier>
```

- `major`: Increments the major version.
- `minor`: Increments the minor version.
- `patch`: Increments the patch version.
- `premajor`: Increments the major version and adds a prerelease tag.
- `preminor`: Increments the minor version and adds a prerelease tag.
- `prepatch`: Increments the patch version and adds a prerelease tag.
- `prerelease`: Increments the prerelease version.
- `-c, --chart-path <path>`: Path to the chart directory. Defaults to the current directory.
- `--preid <identifier>`: Identifier for prerelease versions (e.g., alpha, rc).