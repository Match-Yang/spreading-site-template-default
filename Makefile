install:
	pnpm install

build:
	pnpm run build

artifacts:	
	# Copy artifacts for deployment
	cp -r .next/standalone/* $(ARTIFACTS_DIR)
	cp run.sh $(ARTIFACTS_DIR)

build-NextFunction: install build artifacts