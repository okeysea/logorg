FROM ruby:2.7.1
MAINTAINER okeysea

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

# Host User
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
RUN apt-get update -qq && apt-get -y install gosu

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

