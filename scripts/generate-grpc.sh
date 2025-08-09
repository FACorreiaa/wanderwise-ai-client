#!/bin/bash

# Script to generate grpc-web client code from proto files
set -e

# Directories
PROTO_DIR="../go-ai-poi-proto/proto"
OUTPUT_DIR="src/lib/grpc/generated"
CLIENT_DIR=$(pwd)

echo "🔄 Generating grpc-web client code..."

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Navigate to client directory
cd "$CLIENT_DIR"

# Generate grpc-web code for auth.proto and common.proto
protoc \
  --proto_path="$PROTO_DIR" \
  --js_out=import_style=es6,binary:"$OUTPUT_DIR" \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:"$OUTPUT_DIR" \
  --plugin=protoc-gen-grpc-web="./protoc-gen-grpc-web" \
  "$PROTO_DIR/common.proto" \
  "$PROTO_DIR/auth.proto"

echo "✅ grpc-web client code generated successfully!"
echo "📁 Generated files in: $OUTPUT_DIR"