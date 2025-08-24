#!/bin/sh
# wait-for-rabbitmq.sh

set -e

host="$1"
port="$2"

until nc -z "$host" "$port"; do
  echo "Waiting for RabbitMQ at $host:$port..."
  sleep 2
done

echo "RabbitMQ is up! Starting service."
exec node ./index.js
