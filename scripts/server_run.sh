#! /bin/sh

echo $IS_DEVELOPMENT
if [ "$IS_DEVELOPMENT" = "1" ]
then
    echo "Waiting for mongo..."
    while ! nc -z $MONGO_HOST $MONGO_PORT; do
      sleep 0.5
    done
    echo "MongoDB started"
    npm run migrate
    npm run start:dev
else
    npm run migrate
    npm start
fi
exec "$@"
