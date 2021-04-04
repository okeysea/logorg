FROM nginx:1.15.8
MAINTAINER okeysea
ARG LOCAL_UID
ARG LOCAL_GID

RUN apt-get update -qq && apt-get -y install gosu

RUN useradd -u $LOCAL_UID -o -m user
RUN groupmod -g $LOCAL_GID user

RUN rm -f /etc/nginx/conf.d/*

ADD ./containers/nginx/nginx.conf /etc/nginx/conf.d/project.conf
ADD ./containers/nginx/mime.conf /etc/nginx/conf.d/mime.conf

ADD ./tmp /project/tmp
ADD ./public /project/public

# Host User
COPY ./containers/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
