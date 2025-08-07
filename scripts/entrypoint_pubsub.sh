#! /bin/sh
if [ "$IS_DEVELOPMENT" = "1" ]
then
    echo "Waiting for backend..."
    while ! nc -z $MONGO_HOST $MONGO_PORT; do
      sleep 0.5
    done
    echo "Backend started"
    echo "Starting PubSub service..."
    # node pubsub/subscriber.js
else
    echo "Starting PubSub service..."
    # node pubsub/subscriber.js
fi
