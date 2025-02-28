#!/bin/bash
# Navigate to the script's directory
cd "$(dirname "$0")"/..
echo "Cleanup started."
# Find and remove node_modules directories, dist directories, yarn.lock, and pnpm-lock.yaml.
find . -type d -name "node_modules" -exec rm -rf {} + \
    -o -type d -name "dist" -exec rm -rf {} + \
    -o -type d -name "data" -exec rm -rf {} + \
    -o -type f -name "yarn.lock" -exec rm -rf {} + \
    -o -type f -name "pnpm-lock.yaml" -exec rm -rf {} +
echo "Cleanup completed."
