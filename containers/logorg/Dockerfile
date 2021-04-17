ARG TARGET_ENV="production"

FROM mysql:8.0 as mysql
FROM rust:1.45.2-slim-buster as rust
FROM node:15.14.0-buster-slim as node
FROM dpokidov/imagemagick:7.0.11-2-buster as imagick

FROM ruby:2.7.1-buster as builder

ARG TARGET_ENV

# RUN apk --update --no-cache add shadow sudo busybox-suid mariadb-connector-c-dev tzdata alpine-sdk
# RUN apt-get update && apt-get install -y \ 
#     build-essential \
#     git \
#     gcc \
#     make \
#     g++ \
#     cmake \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.45.2

COPY --from=rust /usr/local/rustup /usr/local/rustup
COPY --from=rust /usr/local/cargo /usr/local/cargo

RUN ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/cargo-clippy   && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/cargo-fmt      && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/cargo-miri     && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/clippy-driver  && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rls            && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rust-gdb       && \ 
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rust-lldb      && \
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rustc          && \
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rustdoc        && \
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rustfmt        && \
    ln -s -f /usr/local/cargo/bin/cargo /usr/local/cargo/bin/rustup         

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/include/node /usr/local/include/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /opt/yarn-v* /opt/yarn

RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
      ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
      ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn

WORKDIR /project

ADD Gemfile Gemfile.lock ./

RUN gem install bundler && \
      if [ $TARGET_ENV = "production" ] ; then bundle install --without development test --path vendor/bundle ; else bundle install --path vendor/bundle ; fi &&\
      find vendor/bundle/ruby -path '*/gems/*/ext/*/Makefile' -exec dirname {} \; | xargs -n1 -P$(nproc) -I{} make -C {} clean

ADD .authtoken /root/.npmrc
ADD yarn.lock package.json .npmrc ./

RUN yarn install --check-files && yarn cache clean && yarn upgrade

# precomile
COPY Rakefile tsconfig.json postcss.config.js ./
COPY app/javascript app/javascript
COPY app/assets app/assets
COPY bin bin
COPY config config

RUN RAILS_ENV=production bundle exec rails assets:precompile


FROM ruby:2.7.1-slim-buster

ARG TARGET_ENV

EXPOSE 3000

WORKDIR /project

# imagemagick
COPY --from=imagick /etc /etc
COPY --from=imagick /usr/local/bin /usr/local/bin
COPY --from=imagick /usr/local/lib /usr/local/lib
COPY --from=imagick /usr/local/etc /usr/local/etc
COPY --from=imagick /usr/local/share /usr/local/share
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libjpeg.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libpng16.so*      /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libde265.so*      /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libx265.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libwebpmux.so*    /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libwebpdemux.so*  /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libwebp.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libxml2.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libgomp.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libnuma.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libicui18n.so*     /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libicuuc.so*       /usr/lib/x86_64-linux-gnu/
COPY --from=imagick /usr/lib/x86_64-linux-gnu/libicudata.so*     /usr/lib/x86_64-linux-gnu/

COPY --from=builder /project/vendor/bundle vendor/bundle
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder /project/public/assets/ /project/public/assets
COPY --from=builder /project/public/packs/ /project/public/packs

COPY --from=builder /usr/lib/x86_64-linux-gnu/libmariadb.so.3 /usr/lib/x86_64-linux-gnu/libmariadb.so.3

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/include/node /usr/local/include/node

RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs 

COPY --from=builder /project/node_modules/@okeysea/ /project/node_modules/@okeysea

# helth check用にもってくる
COPY containers/logorg/health_check /health_check

COPY containers/logorg/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

COPY . /project

VOLUME /project/public
VOLUME /project/tmp
VOLUME /project/log
# COPY --from=builder /project/Gemfile.lock /project/Gemfile.lock

CMD exec bundle exec -e $TARGET_ENV puma -C config/puma.rb
