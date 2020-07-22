FROM ruby:2.7.1

ENV LANG C.UTF-8 \
  TZ Asia/Tokyo

RUN apt-get update && apt-get install -y nodejs --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y postgresql-client --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Install yarn
RUN apt-get update -qq && apt-get install bash
RUN touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && ln -s "$HOME/.yarn/bin/yarn" /usr/local/bin/yarn


WORKDIR /project

ADD Gemfile /project/Gemfile
ADD Gemfile.lock /project/Gemfile.lock

RUN gem install bundler
RUN bundle install

ADD package.json /project/package.json
ADD yarn.lock /project/yarn.lock
RUN yarn upgrade
RUN yarn install --check-files

ADD . /project




