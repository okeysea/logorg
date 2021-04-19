ARG = -h
WORKDIR = /terraform

.PHONY: secret_convert build_prod ecr_push deliver
.PHONY: tfcmd tfinit tfplan tfapply tfdestroy tfcheck terraform_chown 
.PHONY: sync_bundle sync_packs get_node_bin rm_public up_dev
.PHONY: cm

tfcmd:
	@TERRAFORM_WORK_DIR=${WORKDIR} docker-compose run --rm terraform ${ARG}

tfinit: tfcheck
	@docker-compose run --rm terraform init

tfplan: tfcheck
	@docker-compose run --rm terraform plan

tfapply: tfcheck
	@docker-compose run --rm terraform apply

tfdestroy: tfcheck
	@docker-compose run --rm terraform destroy

terraform_chown:
	chown -R user ./terraform

tfcheck:
	@docker-compose run --rm terraform fmt -recursive
	@docker-compose run --rm terraform fmt -check
	@docker-compose run --rm terraform validate

sync_bundle:
	$(eval colon := :)
	$(eval id := $(shell docker create logorg-rails-dev))
	docker cp $(id)$(colon)/project/vendor ./
	docker cp $(id)$(colon)/project/Gemfile.lock ./Gemfile.lock
	docker rm -v $(id)

rm_public:
	sudo chown -R $(shell whoami) ./containers/logorg/dev_tmp/public
	rm -r ./containers/logorg/dev_tmp/public/*

sync_packs:
	$(eval colon := :)
	$(eval id := $(shell docker create logorg-rails-dev))
	docker cp $(id)$(colon)/project/public/packs ./public/
	docker cp $(id)$(colon)/project/public/packs ./containers/logorg/dev_tmp/public/
	docker rm -v $(id)

up_dev: rm_public sync_packs sync_bundle
	docker-compose up

get_node_bin:
	$(eval colon := :)
	$(eval id := $(shell docker create node:15.14.0-buster-slim))
	$(eval hpref :=./containers/logorg/dev_bin)
	docker cp $(id)$(colon)/usr/local/bin/node $(hpref)/usr/local/bin/
	docker cp $(id)$(colon)/usr/local/include/node $(hpref)/usr/local/include/
	docker cp $(id)$(colon)/usr/local/lib/node_modules $(hpref)/usr/local/lib/
	docker cp $(id)$(colon)/opt/yarn-v1.22.5 $(hpref)/opt/yarn
	docker rm -v $(id)

secret_convert:
	convert_secrets_for_tf ./environments/secret/

build_prod:
	docker-compose -f docker-compose.production.yml build

ecr_push:
	./scripts/secret/aws_ecr_push.sh

deliver: build_prod ecr_push secret_convert tfapply

cm:
	docker-compose -f docker-compose.cloudmapper.yml run --service-ports cm bash

