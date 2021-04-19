echo "Waiting for mysql"

mysql -h"${MYSQL_HOST}" -uroot -p"${MYSQL_ROOT_PASSWORD}"

until mysql -h"${MYSQL_HOST}" -uroot -p"${MYSQL_ROOT_PASSWORD}" &> /dev/null
do
  >&2 echo -n "."
  sleep 1
done
