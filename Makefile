ARG = -h
WORKDIR = /terraform

.PHONY: tfcmd tfinit tfplan tfapply tfdestroy tfcheck terraform_chown sync_bundle sync_packs get_node_bin cm rm_public
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
	docker rm -v $(id)

sync_packs:
	$(eval colon := :)
	$(eval id := $(shell docker create logorg-rails-dev))
	docker cp $(id)$(colon)/project/public/packs ./public/
	docker rm -v $(id)

get_node_bin:
	$(eval colon := :)
	$(eval id := $(shell docker create node:15.14.0-buster-slim))
	$(eval hpref :=./containers/logorg/dev_bin)
	docker cp $(id)$(colon)/usr/local/bin/node $(hpref)/usr/local/bin/
	docker cp $(id)$(colon)/usr/local/include/node $(hpref)/usr/local/include/
	docker cp $(id)$(colon)/usr/local/lib/node_modules $(hpref)/usr/local/lib/
	docker cp $(id)$(colon)/opt/yarn-v1.22.5 $(hpref)/opt/yarn
	docker rm -v $(id)

rm_public:
	sudo chown -R $(shell whoami) ./containers/logorg/dev_tmp/public
	rm -r ./containers/logorg/dev_tmp/public/*
	

cm:
	docker-compose -f docker-compose.cloudmapper.yml run --service-ports cm bash

