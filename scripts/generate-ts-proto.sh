#!/bin/bash

# Script to generate TypeScript types using ts-proto
set -e

# Directories
PROTO_DIR="../go-ai-poi-proto/proto"
OUTPUT_DIR="src/lib/grpc/types"
CLIENT_DIR=$(pwd)

echo "🔄 Generating TypeScript types with ts-proto..."

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Navigate to client directory
cd "$CLIENT_DIR"

# Generate TypeScript types using ts-proto
protoc \
  --proto_path="$PROTO_DIR" \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="$OUTPUT_DIR" \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=forceLong=long \
  --ts_proto_opt=useOptionals=messages \
  --ts_proto_opt=outputServices=grpc-web \
  --ts_proto_opt=outputClientImpl=grpc-web \
  "$PROTO_DIR/common.proto" \
  "$PROTO_DIR/auth.proto"

echo "✅ TypeScript types generated successfully!"
echo "📁 Generated files in: $OUTPUT_DIR"