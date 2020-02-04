#!/usr/bin/env bash
set -e

RELEASE_DIR=release/
BUILD_DIR=dist/

rm -rf ${RELEASE_DIR}
mkdir -p ${RELEASE_DIR}
cp -r ${BUILD_DIR}/* ${RELEASE_DIR}
cp package.json ${RELEASE_DIR}
cd ${RELEASE_DIR}
npm publish --access=public
