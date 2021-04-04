#!/bin/bash

USER_ID=${LOCAL_UID:-9001}
GROUP_ID=${LOCAL_GID:-9001}

chown -R $USER_ID:$GROUP_ID /project/tmp
chown -R $USER_ID:$GROUP_ID /project/public

exec "$@"
