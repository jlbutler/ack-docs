# ACK Services Generator

A fast Go-based tool to generate the ACK services page from local controller repositories.

## Features

- Scans local controller directories (no GitHub API required)
- Reads metadata from `metadata.yaml` files
- Gets versions from local git tags
- Auto-detects maintenance phase: `>= v1.0.0` = GA, `< v1.0.0` = Preview
- Counts CRDs to show resource count
- Generates TypeScript file for Docusaurus website

## Usage

```bash
# Build the tool
go build -o gen-services

# Run the generator
./gen-services \
  --controllers-dir=/Users/aminehilaly/source/github.com/aws-controllers-k8s \
  --output=../../website/src/pages/services.tsx \
  --config=services-config.yaml
```

## Configuration

Edit `services-config.yaml` to customize:
- Service categories
- Service descriptions
- Project stages (RELEASED, IN PROGRESS, PLANNED, PROPOSED)

## How It Works

1. Scans for `*-controller` directories
2. Reads `metadata.yaml` for service name and details
3. Runs `git describe --tags --abbrev=0` to get latest version
4. Determines GA vs Preview based on version number
5. Counts CRDs in `helm/templates` or `config/crd/bases`
6. Merges with config file for category and description
7. Generates TypeScript services file

## Version Logic

- Version `>= 1.0.0` → General Availability
- Version `< 1.0.0` → Preview

## Why Go?

- Fast compilation and execution
- No Python dependencies or GitHub token required
- Works offline with local repositories
- Simple to use upstream in CI/CD
