import { EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import { config } from './configs';

const client = EventStoreDBClient.connectionString(
  config.eventStore.connection_string
);

const connect = async () => {
  await client.readAll({
	direction: FORWARDS,
	fromPosition: START,
	maxCount: 1
  });
}

export {
  client, connect
};