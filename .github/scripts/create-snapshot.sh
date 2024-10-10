#!/bin/bash

# Ensure we're in the project root
cd "$(git rev-parse --show-toplevel)"

# Get the current commit short SHA
SHORT_SHA=$(git rev-parse --short HEAD)

# Clean and build the project
echo "Cleaning and building the project..."
pnpm clean && pnpm build:pkgs

# Create snapshot version
echo "Creating snapshot version..."
pnpm changeset version --snapshot ${SHORT_SHA}

# Clean examples (if applicable)
echo "Cleaning examples..."
pnpm clean-examples

# Publish snapshot
echo "Publishing snapshot..."
pnpm changeset publish --no-git-tag --tag snapshot

echo "Snapshot release complete!"
