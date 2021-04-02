FROM ruby:2.7.1
MAINTAINER okeysea
ARG LOCAL_UID
ARG LOCAL_GID

RUN apt-get update && apt-get install -y nodejs --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y postgresql-client --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Install bash
RUN apt-get update -qq && apt-get install bash

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
      && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install yarn

# Install Rust for wasmer ruby gem
# ( install script from https://github.com/rust-lang/docker-rust/{version}/buster/Dockerfile )

# rust 1.50   FAILED
# rust 1.49   FAILED
# rust 1.48   FAILED
# rust 1.47   FAILED
# rust 1.46   FAILED
# rust 1.45.2 BUILD SUCCESS
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.45.2

RUN set -eux; \
    dpkgArch="$(dpkg --print-architecture)"; \
    case "${dpkgArch##*-}" in \
        amd64) rustArch='x86_64-unknown-linux-gnu'; rustupSha256='49c96f3f74be82f4752b8bffcf81961dea5e6e94ce1ccba94435f12e871c3bdb' ;; \
        armhf) rustArch='armv7-unknown-linux-gnueabihf'; rustupSha256='5a2be2919319e8778698fa9998002d1ec720efe7cb4f6ee4affb006b5e73f1be' ;; \
        arm64) rustArch='aarch64-unknown-linux-gnu'; rustupSha256='d93ef6f91dab8299f46eef26a56c2d97c66271cea60bf004f2f088a86a697078' ;; \
        i386) rustArch='i686-unknown-linux-gnu'; rustupSha256='e3d0ae3cfce5c6941f74fed61ca83e53d4cd2deb431b906cbd0687f246efede4' ;; \
        *) echo >&2 "unsupported architecture: ${dpkgArch}"; exit 1 ;; \
    esac; \
    url="https://static.rust-lang.org/rustup/archive/1.22.1/${rustArch}/rustup-init"; \
    wget "$url"; \
    echo "${rustupSha256} *rustup-init" | sha256sum -c -; \
    chmod +x rustup-init; \
    ./rustup-init -y --no-modify-path --profile minimal --default-toolchain $RUST_VERSION; \
    rm rustup-init; \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

# Host User
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
RUN apt-get update -qq && apt-get -y install gosu

WORKDIR /project

ADD Gemfile /project/Gemfile
ADD Gemfile.lock /project/Gemfile.lock

RUN gem install bundler
RUN gem install wasmer
RUN bundle update
RUN bundle install

ADD package.json /project/package.json
ADD .npmrc /project/.npmrc
ADD yarn.lock /project/yarn.lock

RUN useradd -u $LOCAL_UID -o -m user
RUN groupmod -g $LOCAL_GID user

RUN chown -R ${LOCAL_UID}:${LOCAL_GID} .

USER user

ADD .authtoken /home/user/.npmrc
RUN yarn install --check-files
RUN yarn upgrade

ADD . /project

USER root

