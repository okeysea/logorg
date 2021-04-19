#!/bin/bash

if [ $RAILS_ENV = "development" ]; then

  cp -rp /project/containers/logorg/dev_bin/ /

  ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
    ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn

fi

bin/rails db:create
bin/rails db:migrate

exec "$@"
