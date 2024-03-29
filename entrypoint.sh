#!/bin/bash

USER_ID=${LOCAL_UID:-9001}
GROUP_ID=${LOCAL_GID:-9001}

chown -R $USER_ID:$GROUP_ID /project/tmp
chown -R $USER_ID:$GROUP_ID /project/public
chown -R $USER_ID:$GROUP_ID /project/log

echo "Starting with UID: $USER_ID, GID: $GROUP_ID"
export HOME=/home/user
usermod -u $USER_ID -o -m user
groupmod -g $GROUP_ID user

id

# GitHub packages authtoken
if [ ! -e /project/.authtoken ]; then
  echo "NOTE: If you want to install a package, you need an .authtoken file."
  echo "Alternatively, you can add the credentials to ~/.npmrc ."
else
  cp /project/.authtoken /home/user/.npmrc
  echo "[INFO] Copied an .authtoken file to ~/.npmrc ."
fi

# exec /usr/sbin/gosu user "$@"
exec "$@"
