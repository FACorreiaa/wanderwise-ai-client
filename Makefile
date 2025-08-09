# Makefile for gRPC-Web TypeScript generation

# Directories
PROTO_DIR = src/lib/proto
GRPC_DIR = src/lib/grpc

# Protoc settings
PROTOC_GEN_GRPC_WEB = protoc-gen-grpc-web
PROTOC = protoc

# Proto files
PROTO_FILES = $(wildcard $(PROTO_DIR)/*.proto)

# Ensure output directory exists
$(GRPC_DIR):
	mkdir -p $(GRPC_DIR)

# Generate TypeScript files from proto definitions
proto-generate: $(GRPC_DIR)
	@echo "Generating TypeScript gRPC-Web files..."
	$(PROTOC) -I=$(PROTO_DIR) $(PROTO_FILES) \
		--js_out=import_style=commonjs,binary:$(GRPC_DIR) \
		--grpc-web_out=import_style=commonjs+dts,mode=grpcweb:$(GRPC_DIR)
	@echo "TypeScript gRPC-Web files generated successfully!"

# Lint proto files
proto-lint:
	@echo "Linting proto files..."
	@for file in $(PROTO_FILES); do \
		echo "Checking $$file..."; \
		$(PROTOC) -I=$(PROTO_DIR) --descriptor_set_out=/dev/null $$file || exit 1; \
	done
	@echo "Proto files linted successfully!"

# Clean generated files
proto-clean:
	@echo "Cleaning generated files..."
	rm -rf $(GRPC_DIR)
	@echo "Generated files cleaned!"

# Help target
help:
	@echo "Available targets:"
	@echo "  proto-generate - Generate TypeScript gRPC-Web files from proto definitions"
	@echo "  proto-lint     - Lint proto files for syntax errors"
	@echo "  proto-clean    - Clean generated TypeScript files"
	@echo "  help          - Show this help message"

.PHONY: proto-generate proto-lint proto-clean help