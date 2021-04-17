SQL_CREATE=$(cat << SQL
CREATE USER '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
SQL
)

SQL_GRANT=$(cat << SQL
GRANT ALL PRIVILEGES ON \`%\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL
)

mysql -h"${MYSQL_HOST}" -u"${MYSQL_USER}" -p"${MYSQL_PASSWORD}" -e"SELECT 1;" >/dev/null 2>&1

if [ $? = 0 ]; then
  echo "[INIT] User exists"
  echo $SQL_GRANT
  mysql -h"${MYSQL_HOST}" -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "${SQL_GRANT}"
  exit 0
else
  echo "[INIT] Create User and grant user"
  echo "$SQL_CREATE $SQL_GRANT"
  mysql -h"${MYSQL_HOST}" -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "${SQL_CREATE} ${SQL_GRANT}"
  exit 0
fi
