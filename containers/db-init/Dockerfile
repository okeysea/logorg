FROM alpine:3.13
RUN apk add --no-cache mysql-client
COPY ./containers/db-init/health_check /health_check
COPY ./containers/db-init/init /db-init
CMD ash -c "ash /db-init/wait_db.sh && ash /db-init/grant_user.sh"
